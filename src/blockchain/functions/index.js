import { ethers } from "ethers";
import { NFTabi, marketAbi, tokenAbi } from "../abis";
import axios from "axios";

let provider = new ethers.providers.JsonRpcProvider(
  "https://api.avax-test.network/ext/bc/C/rpc"
);

let marketAddress = "0x367cD097Ce16Bfde52F17A144C58421E46dEc59E";
let tokenAddress = "0xf328B9a9739097E21B41429891DC1Dd3645a80d1";
let NFTAddress = "0xabD6279BEBD08257f69f8c20e7666C3301768Aa5";
let dividenTrackerAddress = "0x704589d6d5BF1dedAC67a7521290Ab8A4f06452b";

let marketContract = new ethers.Contract(marketAddress, marketAbi, provider);
let NFTcontract = new ethers.Contract(NFTAddress, NFTabi, provider);
let tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);

// TOKEN VIEW FUNCTIONS

export const getUserBalances = async (userAddress) => {
  let tokenBalance = await tokenContract.balanceOf(userAddress);
  let avaxValance = await provider.getBalance(userAddress);
  let dividendBalance = await provider.getBalance(dividenTrackerAddress);
  let withdrawableDividend = await tokenContract.withdrawableDividendOf(
    userAddress
  );

  console.log("balances", dividendBalance.toString());

  return [
    { value: Number(tokenBalance / 10 ** 18).toFixed(2), coin: "$1EARTH" },
    { value: Number(avaxValance / 10 ** 18).toFixed(4), coin: "AVAX" },
    {
      value: Number(withdrawableDividend / 10 ** 18).toFixed(6),
      coin: "Market Reflections",
    },
  ];
};

// NFT VIEW FUNCTIONS

export const getMintedNFTs = async () => {
  const totalSupply = await NFTcontract.totalSupply();

  return totalSupply;
};

// MARKETPLACE VIEW FUNCTIONS

export const getMarketNFTs = async () => {
  const marketNFTs = await NFTcontract.walletOfOwner(marketAddress);
  let floorPrice = "";

  let tokens = await Promise.all(
    await marketNFTs.map(async (el) => {
      let metadata;
      let itemInfo = await marketContract.orderByTokenId(el);
      let bids = await marketContract.bidByTokenId(el);
      let token_uri = await NFTcontract.tokenURI(el);
      let rewards = await NFTcontract.getRewards(el);
      let reflections = await NFTcontract.getReflections(el);

      if (floorPrice === "") {
        floorPrice = itemInfo.price;
      } else if (floorPrice > itemInfo.price) {
        floorPrice = itemInfo.price;
      }

      try {
        let info = await axios.get(token_uri);

        metadata = info.data;
      } catch (error) {
        console.log(error, "axios getMarketNFTs");
      }

      return {
        token_id: el.toString(),
        metadata,
        itemInfo,
        bids,
        pendingRewards: Number(rewards.amount / 10 ** 18).toFixed(4),
        pendingReflections: Number(reflections / 10 ** 18).toFixed(4),
      };
    })
  );

  console.log(tokens, "market");
  return { tokens, floorPrice };
};

export const getUserNFTs = async (userAddress) => {
  const userNFTs = await NFTcontract.walletOfOwner(userAddress);
  let userAvaxRewards = 0;
  let userEarthReflections = 0;

  let tokens = await Promise.all(
    await userNFTs.map(async (el) => {
      let metadata;
      let token_uri = await NFTcontract.tokenURI(el);
      let rewards = await NFTcontract.getRewards(el);
      let reflections = await NFTcontract.getReflections(el);
      userAvaxRewards += Number(rewards.amount);
      userEarthReflections += Number(reflections);

      try {
        let info = await axios.get(token_uri);
        metadata = info.data;
      } catch (error) {
        console.log(error, "axios getUserNFTs");
      }

      return {
        token_id: el.toString(),
        metadata,
        pendingRewards: Number(rewards.amount / 10 ** 18).toFixed(4),
        pendingReflections: Number(reflections / 10 ** 18).toFixed(4),
      };
    })
  );

  return {
    ids: userNFTs,
    tokens,
    userAvaxRewards: Number(userAvaxRewards / 10 ** 18).toFixed(4),
    userEarthReflections: Number(userEarthReflections / 10 ** 18).toFixed(4),
  };
};

export const checkERC721Allowance = async (userAddress) => {
  let marketApproval = await NFTcontract.isApprovedForAll(
    userAddress,
    marketAddress
  );

  return marketApproval;
};

export const checkAllowance = async (userAddress) => {
  let marketAllowance = await tokenContract.allowance(
    userAddress,
    marketAddress
  );

  return marketAllowance > 0;
};

// MARKETPLACE WRITE FUNCTIONS

export const createOrder = async (_tokenId, _price) => {
  try {
    let newMarketContract = await marketContractInstance();

    let price = ethers.utils.parseUnits(_price);

    let tx = await newMarketContract.createOrder(_tokenId, price);

    let receipt = await tx.wait();

    console.log(receipt);
    return receipt;
  } catch (error) {
    console.log(error);
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const cancelOrder = async (_tokenId) => {
  try {
    let newMarketContract = await marketContractInstance();

    let tx = await newMarketContract.cancelOrder(_tokenId);

    let receipt = await tx.wait();

    console.log(receipt);
    return receipt;
  } catch (error) {
    console.log(error, "cancelOrder");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const updateOrder = async (_tokenId, _price) => {
  try {
    let newMarketContract = await marketContractInstance();

    let price = ethers.utils.parseUnits(_price);

    let tx = await newMarketContract.updateOrder(_tokenId, price);

    let receipt = await tx.wait();

    console.log(receipt);
    return receipt;
  } catch (error) {
    console.log(error, "updateOrder");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const executeOrder = async (_tokenId, value) => {
  try {
    let newMarketContract = await marketContractInstance();

    let tx = await newMarketContract.executeOrder(_tokenId, { value });

    let receipt = await tx.wait();

    console.log(receipt);
    return receipt;
  } catch (error) {
    console.log(error, "executeOrder");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const placeBid = async (_tokenId, price) => {
  try {
    let newMarketContract = await marketContractInstance();

    let value = ethers.utils.parseUnits(price);

    let tx = await newMarketContract.placeBid(_tokenId, { value });

    let receipt = await tx.wait();

    console.log(receipt);
    return receipt;
  } catch (error) {
    console.log(error, "placeBid");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const cancelBid = async (_tokenId) => {
  try {
    let newMarketContract = await marketContractInstance();

    let tx = await newMarketContract.cancelBid(_tokenId);

    let receipt = await tx.wait();

    console.log(receipt);
    return receipt;
  } catch (error) {
    console.log(error, "cancelBid");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const acceptBid = async (_tokenId) => {
  try {
    let newMarketContract = await marketContractInstance();

    let tx = await newMarketContract.acceptBid(_tokenId);

    let receipt = await tx.wait();

    console.log(receipt);
    return receipt;
  } catch (error) {
    console.log(error, "acceptBid");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

const marketContractInstance = async () => {
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner(0);

  let newMarketContract = new ethers.Contract(marketAddress, marketAbi, signer);

  return newMarketContract;
};

// TOKEN WRITE FUNCTIONS

export const claim = async () => {
  try {
    let newTokenContract = await tokenContractInstance();

    let tx = await newTokenContract.claim();

    let receipt = await tx.wait();

    console.log(receipt);
    return receipt;
  } catch (error) {
    console.log(error, "claim");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const increaseAllowance = async () => {
  try {
    let newTokenContract = tokenContractInstance();

    let tx = await newTokenContract.approve(
      marketAddress,
      "9999999999999999999999999999"
    );

    const receipt = await tx.wait();
    if (receipt) {
      console.log(receipt);
      return true;
    }
  } catch (error) {
    console.log(error);
    throw "Allowance not approved!";
  }
};

const tokenContractInstance = async () => {
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner(0);

  let newTokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

  return newTokenContract;
};

// NFT WRITE FUNCTIONS

export const claimRewards = async (_tokenIds) => {
  try {
    let newNftContract = await nftContractInstance();

    let tx = await newNftContract.claimRewards(_tokenIds);

    let receipt = await tx.wait();

    console.log(receipt);
    return receipt;
  } catch (error) {
    console.log(error, "claimRewards");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const claimReflections = async (_tokenIds) => {
  try {
    let newNftContract = await nftContractInstance();

    let tx = await newNftContract.claimReflections(_tokenIds);

    let receipt = await tx.wait();

    console.log(receipt);
    return receipt;
  } catch (error) {
    console.log(error, "claimReflections");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const mintNFT = async (amount) => {
  try {
    let newNftContract = await nftContractInstance();

    let value = ethers.utils.parseUnits((amount * 0.1).toString());

    let tx = await newNftContract.mint(amount, {
      value,
      gasLimit: 400000 * amount,
    });

    let receipt = await tx.wait();

    console.log(receipt);
    return receipt;
  } catch (error) {
    console.log(error, "mint");
    if (error.data) {
      window.alert(error.data.message);
    }
  }
};

export const approveERC721 = async () => {
  try {
    let newNFTcontract = await nftContractInstance();

    let tx = await newNFTcontract.setApprovalForAll(marketAddress, "true");

    const receipt = await tx.wait();
    if (receipt) {
      console.log(receipt);
      return true;
    }
  } catch (error) {
    console.log(error, "approveERC721");
    throw "Allowance not approved!";
  }
};

const nftContractInstance = async () => {
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  let signer = provider.getSigner(0);

  let newNftContract = new ethers.Contract(NFTAddress, NFTabi, signer);

  return newNftContract;
};
