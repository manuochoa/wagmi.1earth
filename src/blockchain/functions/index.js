import { ethers } from "ethers";
import { NFTabi, marketAbi, tokenAbi } from "../abis";
import axios from "axios";

let provider = new ethers.providers.JsonRpcProvider(
  "https://api.avax-test.network/ext/bc/C/rpc"
);

let marketAddress = "0x847Bfefc478912aBf3AB060ec8556F7ddccBd45A";
let tokenAddress = "0xAD334fB7743741d98baBb81a07800250Cf1EDE1D";
let NFTAddress = "0x4e32090656F6deB1CB59C521307F04A40A96c9a3";

let marketContract = new ethers.Contract(marketAddress, marketAbi, provider);
let NFTcontract = new ethers.Contract(NFTAddress, NFTabi, provider);
let tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);

// TOKEN VIEW FUNCTIONS

export const getUserBalances = async (userAddress) => {
  let tokenBalance = await tokenContract.balanceOf(userAddress);
  let avaxValance = await provider.getBalance(userAddress);
  let withdrawableDividend = await tokenContract.withdrawableDividendOf(
    userAddress
  );

  console.log("balances", [
    { value: Number(tokenBalance / 10 ** 18).toFixed(2), coin: "$1EARTH" },
    { value: Number(avaxValance / 10 ** 18).toFixed(4), coin: "AVAX" },
    {
      value: Number(withdrawableDividend / 10 ** 18).toFixed(6),
      coin: "Dividens",
    },
  ]);

  return [
    { value: Number(tokenBalance / 10 ** 18).toFixed(2), coin: "$1EARTH" },
    { value: Number(avaxValance / 10 ** 18).toFixed(4), coin: "AVAX" },
    {
      value: Number(withdrawableDividend / 10 ** 18).toFixed(6),
      coin: "Dividens",
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

  let tokens = await Promise.all(
    await marketNFTs.map(async (el) => {
      let metadata;
      let itemInfo = await marketContract.orderByTokenId(el);
      let token_uri = await NFTcontract.tokenURI(el);
      let rewards = await NFTcontract.getRewards(el);
      let reflections = await NFTcontract.getReflections(el);

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
        pendingRewards: Number(rewards.amount / 10 ** 18).toFixed(4),
        pendingReflections: Number(reflections / 10 ** 18).toFixed(4),
      };
    })
  );

  console.log(tokens, "market");
  return tokens;
};

export const getUserNFTs = async (userAddress) => {
  const userNFTs = await NFTcontract.walletOfOwner(userAddress);

  let tokens = Promise.all(
    await userNFTs.map(async (el) => {
      let metadata;
      let token_uri = await NFTcontract.tokenURI(el);
      let rewards = await NFTcontract.getRewards(el);
      let reflections = await NFTcontract.getReflections(el);

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

  return tokens;
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

export const claimRewards = async (_tokenId) => {
  try {
    let newNftContract = await nftContractInstance();

    let tx = await newNftContract.claimRewards(_tokenId);

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

export const claimReflections = async (_tokenId) => {
  try {
    let newNftContract = await nftContractInstance();

    let tx = await newNftContract.claimReflections(_tokenId);

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

export const mintNFT = async () => {
  try {
    let newNftContract = await nftContractInstance();

    let value = ethers.utils.parseUnits("1.5");

    let tx = await newNftContract.mint({ value, gasLimit: 500000 });

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
