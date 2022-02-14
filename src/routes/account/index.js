import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Badge, Form } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import "./styles.css";
import arrowLeft from "../../assets/Images/icons/arrow-left.png";
import UserItemCard from "../../components/UserItemCard";
import NumberFormat from "react-number-format";
import avaxLogo from "../../assets/Images/avax-logo.png";
import earthLogo from "../../assets/Images/earth-logo.png";

import {
  createOrder,
  checkERC721Allowance,
  approveERC721,
  getUserNFTs,
  cancelOrder,
  updateOrder,
  acceptBid,
  claim,
  claimRewards,
  claimReflections,
  mintNFT,
  getMintedNFTs,
  claimAirdrop,
  checkIsWhitelisted,
} from "../../blockchain/functions";

const Account = ({
  userAddress,
  setUserAddress,
  connectWallet,
  userBalances,
  loadUserBalances,
  marketItems,
  getItems,
}) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [minted, setMinted] = useState("");
  const [items, setItems] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [userRewards, setUserRewards] = useState({
    userAvaxRewards: "",
    userEarthReflections: "",
  });
  const [userTokensIds, setUserTokensIds] = useState([]);
  const [activeItem, setActiveItem] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState("");
  const [marketAllowance, setMarketAllowance] = useState(false);
  const [amountToMint, setAmountToMint] = useState("1");
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [isClaimed, steIsClaimed] = useState(false);

  const getInventoryNFTs = async () => {
    let totalSupply = await getMintedNFTs();
    if (totalSupply) {
      setMinted(totalSupply.toString());
    }
    if (userAddress) {
      let receipt = await getUserNFTs(userAddress);

      if (receipt) {
        setItems(receipt.tokens);
        setUserRewards({
          userAvaxRewards: receipt.userAvaxRewards,
          userEarthReflections: receipt.userEarthReflections,
        });
        setUserTokensIds(receipt.ids);
      }
    }
  };

  const handleCreateOrder = async (_tokenId) => {
    setIsLoading(true);

    if (!marketAllowance) {
      await approveERC721();
    }

    let result = await createOrder(_tokenId, price);
    if (result) {
      console.log(result);
    }
    setActiveTab("wallet");
    getInventoryNFTs();

    setIsLoading(false);
  };

  const handleCancelOrder = async (_tokenId) => {
    setIsLoading(true);

    let result = await cancelOrder(_tokenId);
    if (result) {
      console.log(result);
      setActiveTab("wallet");
      getInventoryNFTs();
    }

    setIsLoading(false);
  };

  const handleUpdateOrder = async (_tokenId) => {
    setIsLoading(true);

    let result = await updateOrder(_tokenId, price);
    if (result) {
      console.log(result);
      setActiveTab("wallet");
      getItems();
    }

    setIsLoading(false);
  };

  const handleAcceptBid = async (_tokenId) => {
    setIsLoading(true);

    let result = await acceptBid(_tokenId);
    if (result) {
      console.log(result);
    }
    setActiveTab("wallet");
    loadUserBalances();
    setIsLoading(false);
  };

  const handleClaim = async () => {
    setIsLoading(true);

    let result = await claim();
    if (result) {
      console.log(result);
      getInventoryNFTs();
      loadUserBalances();
    }

    setIsLoading(false);
  };

  const handleClaimRewards = async () => {
    setIsLoading(true);

    let result = await claimRewards(userTokensIds);
    if (result) {
      console.log(result);
      getInventoryNFTs();
      loadUserBalances();
    }

    setIsLoading(false);
  };

  const handleClaimReflections = async () => {
    setIsLoading(true);

    let result = await claimReflections(userTokensIds);
    if (result) {
      console.log(result);
      getInventoryNFTs();
      loadUserBalances();
    }

    setIsLoading(false);
  };

  const handleAirdrop = async () => {
    setIsLoading(true);

    let result = await claimAirdrop();
    if (result) {
      loadUserBalances();
      checkAllowance();
    }

    setIsLoading(false);
  };

  const handleMint = async () => {
    setIsLoading(true);

    let result = await mintNFT(amountToMint);
    if (result) {
      console.log(result);
      getInventoryNFTs();
      loadUserBalances();
    }

    setIsLoading(false);
  };

  const getUserOrders = async () => {
    if (marketItems.length > 0 && userAddress) {
      let orders = marketItems.filter(
        (el) => el.itemInfo.seller.toLowerCase() === userAddress.toLowerCase()
      );
      if (orders) {
        setUserOrders(orders);
      }
    }
  };

  const checkAllowance = async (_tokenId) => {
    if (userAddress) {
      let result = await checkERC721Allowance(userAddress);
      let airdrop = await checkIsWhitelisted(userAddress);

      console.log("airdrop", airdrop);
      setIsWhitelisted(airdrop.isWhitelisted);
      steIsClaimed(airdrop.isClaimed);
      if (result || airdrop) {
        setMarketAllowance(result);
      }
    }
  };

  const handleAmountToMint = (value) => {
    if (value < 1) {
      setAmountToMint(1);
    } else if (value > 20) {
      setAmountToMint(20);
    } else {
      setAmountToMint(value);
    }
  };

  useEffect(() => {
    getInventoryNFTs();
    checkAllowance();
  }, [userAddress]);

  useEffect(() => {
    getUserOrders();
  }, [marketItems]);

  const SectionHeader = (props) => {
    const { headerTitle } = props;

    return (
      <div className="section-header mt-5">
        <h1 className="m-0 me-5">{headerTitle}</h1>
      </div>
    );
  };

  const BackHeader = (props) => {
    return (
      <div className="section-header mt-5">
        {props.isPreview ? (
          <div className="go-back d-flex justify-content-between">
            <a role="button" onClick={props.onClickBack}>
              <h3>
                <img src={arrowLeft} alt="" />
                Back
              </h3>
            </a>
          </div>
        ) : (
          <div className="d-flex justify-content-between">
            <div className="left-content d-flex justify-content-center align-items-center">
              <h1 className="m-0 me-5">{`${items.length} Items`}</h1>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderItemPreview = () => {
    const item = items[activeItem];

    return (
      <div className="item-section">
        <BackHeader
          isPreview={true}
          onClickBack={() => setActiveTab("wallet")}
        />
        <div className="item-preview mt-4">
          <Row className="mt-4">
            <Col xs={5}>
              <div className="item-image d-flex justify-content-center align-items-center  mb-5 ">
                <img className="img-fluid" src={item.metadata?.image} alt="" />
              </div>
            </Col>
            <Col xs={7}>
              <div className="item-info mt-5 mb-5 pt-5 pb-5">
                <h5 className="item-number">Mint #{item.token_id}</h5>
                <h3 className="item-name">{item.metadata?.name}</h3>
                <div className="item-price d-flex align-items-center">
                  <h1 className="me-5">
                    <Form.Control
                      className="nft-input"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0 AVAX"
                    />
                  </h1>
                  <Button
                    disabled={isLoading}
                    onClick={() => handleCreateOrder(item.token_id)}
                    className="nft-buy-button"
                  >
                    {isLoading ? "Selling..." : "Sell"}
                  </Button>
                </div>
              </div>
            </Col>
            <Col xs={12}>
              <div className="info p-4 d-flex flex-column">
                <h3 className="mb-4">About</h3>
                <div className="d-flex">
                  {/* <div className="info-item"> */}
                  <h4>Rarity:</h4>
                  <div className="badge-container">
                    <Badge
                      className={
                        item.metadata?.attributes[0]?.value === "Common"
                          ? "rarity-badge"
                          : item.metadata?.attributes[0]?.value === "Endangered"
                          ? "rarity-badge nft-Endangered"
                          : item.metadata?.attributes[0]?.value === "Shiny"
                          ? "rarity-badge nft-Shiny"
                          : item.metadata?.attributes[0]?.value === "Unique"
                          ? "rarity-badge nft-Unique"
                          : item.metadata?.attributes[0]?.value ===
                            "Shiny Endangered"
                          ? "rarity-badge nft-sEndangered"
                          : "rarity-badge"
                      }
                    >
                      {item.metadata?.attributes[0]?.value}
                    </Badge>
                  </div>
                </div>
                <div className="d-flex">
                  <h4>Class: {item.metadata?.attributes[1]?.value}</h4>
                </div>
                <div className="owner-detail mt-2 d-flex align-items-center ">
                  <h4 className="mr-3">
                    Pending Rewards: {item.pendingRewards} AVAX
                  </h4>
                  {/* <button
                    disabled={isLoading}
                    onClick={() => handleClaimRewards(item.token_id)}
                    className="nft-buy-button m-1"
                  >
                    Claim
                  </button> */}
                </div>
                <div className="owner-detail mt-2 d-flex align-items-center ">
                  <h4 className="mr-3">
                    Pending Reflections: {item.pendingReflections} $1EARTH
                  </h4>
                  {/* <button
                    disabled={isLoading}
                    onClick={() => handleClaimReflections(item.token_id)}
                    className="nft-buy-button m-1"
                  >
                    Claim
                  </button> */}
                </div>
              </div>
            </Col>
            {/* <Col xs={6}>
              <div className="info p-4">
                <h3 className="mb-4">Sale History</h3>
                <div className="d-flex">
                  <h4 className="buyer-title ps-2">Buyer</h4>
                  <h4 className="seller-title">Seller</h4>
                </div>
              </div>
            </Col> */}
          </Row>
        </div>
      </div>
    );
  };

  const renderOrderPreview = () => {
    const item = userOrders[activeItem];

    return (
      <div className="item-section">
        <BackHeader
          isPreview={true}
          onClickBack={() => setActiveTab("wallet")}
        />
        <div className="item-preview mt-4">
          <Row className="mt-4">
            <Col xs={5}>
              <div className="item-image d-flex justify-content-center align-items-center pb-5">
                <img className="img-fluid" src={item.metadata?.image} alt="" />
              </div>
            </Col>
            <Col xs={7}>
              <div className="item-info mt-5 mb-5 pt-5 pb-5">
                <h5 className="item-number">Mint #{item.token_id}</h5>
                <h3 className="item-name">{item.metadata?.name}</h3>
                <div className="item-price d-flex align-items-center">
                  <div className="item-price d-flex align-items-center">
                    <div className="price-container">
                      <h1 className="me-3">
                        {item.itemInfo?.price / 10 ** 18} WGM
                      </h1>
                      {/* <img
                        className="price-logo-main"
                        src={avaxLogo}
                        alt="avax-logo"
                      /> */}
                    </div>
                  </div>
                </div>
                <Button
                  disabled={isLoading}
                  onClick={
                    userAddress
                      ? () => handleCancelOrder(item.token_id)
                      : connectWallet()
                  }
                  className="nft-buy-button mt-4"
                >
                  Cancel Order
                </Button>
              </div>
            </Col>
            <Col xs={6}>
              <div className="info p-4 d-flex flex-column">
                <h3 className="mb-3">About</h3>
                <div className="d-flex">
                  {/* <div className="info-item"> */}
                  <h4>Rarity:</h4>
                  <div className="badge-container">
                    <Badge
                      className={
                        item.metadata?.attributes[0]?.value === "Common"
                          ? "rarity-badge"
                          : item.metadata?.attributes[0]?.value === "Endangered"
                          ? "rarity-badge nft-Endangered"
                          : item.metadata?.attributes[0]?.value === "Shiny"
                          ? "rarity-badge nft-Shiny"
                          : item.metadata?.attributes[0]?.value === "unique"
                          ? "rarity-badge nft-Unique"
                          : item.metadata?.attributes[0]?.value ===
                            "Shiny Endangered"
                          ? "rarity-badge nft-sEndangered"
                          : "rarity-badge"
                      }
                    >
                      {item.metadata?.attributes[0]?.value}
                    </Badge>
                  </div>
                  <div className="d-flex">
                    <h4>Class: {item.metadata?.attributes[1]?.value}</h4>
                  </div>

                  {/* </div> */}
                </div>
                <div className="owner-detail mt-2 d-flex align-items-center ">
                  <h4 className="mr-3">
                    Pending Rewards: {item.pendingRewards} AVAX
                  </h4>
                </div>
                <div className="owner-detail mt-2 d-flex align-items-center ">
                  <h4 className="mr-3">
                    Pending Reflections: {item.pendingReflections} $1EARTH
                  </h4>
                </div>
              </div>
            </Col>
            <Col xs={6}>
              <div className="info p-4">
                <h4 className="mb-3">Bids</h4>
                <div className="d-flex align-items-end mb-2">
                  <div>
                    <h5>Current Bid: {item.bids.price / 10 ** 18} AVAX</h5>
                    <span>{item.bids.bidder}</span>
                  </div>
                  <div className="mx-3">
                    <button
                      disabled={isLoading}
                      onClick={
                        userAddress
                          ? () => handleAcceptBid(item.token_id)
                          : connectWallet()
                      }
                      className="nft-buy-button"
                    >
                      Accept Bid
                    </button>
                  </div>
                </div>

                <div className="d-flex align-items-baseline mb-2">
                  <div className="d-flex align-items-baseline">
                    <h4 className="m-0">Update Price:</h4>
                    <NumberFormat
                      className="bid-input"
                      value={price}
                      allowLeadingZeros={false}
                      allowNegative={false}
                      onValueChange={({ value }) => setPrice(value)}
                    />
                  </div>
                  <div>
                    <button
                      disabled={isLoading}
                      onClick={
                        userAddress
                          ? () => handleUpdateOrder(item.token_id)
                          : connectWallet()
                      }
                      className="nft-buy-button"
                    >
                      Update Price
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  const renderUserWallet = () => {
    return (
      <div className="inventory-section mt-5 mb-5">
        <SectionHeader headerTitle="My Collections" />
        <Row>
          <div className="bundle-items">
            {items.length == 0 ? (
              <div className="no-items w-100 h-100 d-flex flex-column justify-content-center align-items-center">
                <h3 className="mb-4">No items found</h3>
              </div>
            ) : (
              <div className="inventory-items">
                <Row>
                  <Col xs={12}>
                    <div className="d-flex mt-3">
                      <h1>{items.length} Items</h1>
                    </div>
                  </Col>
                  {items.map((item, index) => {
                    return (
                      <Col xs={2} key={index} className="mt-4">
                        <UserItemCard
                          onClick={() => {
                            setActiveItem(index);
                            setActiveTab("item");
                          }}
                          item={item}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </div>
            )}
          </div>
        </Row>
      </div>
    );
  };

  const renderActiveOrders = () => {
    return (
      <div className="activity-section">
        <SectionHeader headerTitle="Active Orders" />
        <Row>
          <div className="bundle-items">
            {userOrders.length == 0 ? (
              <div className="no-items w-100 h-100 d-flex flex-column justify-content-center align-items-center">
                <h3 className="mb-4">No items found</h3>
              </div>
            ) : (
              <div className="inventory-items">
                <Row>
                  <Col xs={12}>
                    <div className="d-flex mt-3">
                      <h1>{userOrders.length} Items</h1>
                    </div>
                  </Col>
                  {userOrders.map((item, index) => {
                    return (
                      <Col xs={2} key={index} className="mt-4">
                        <UserItemCard
                          onClick={() => {
                            setActiveItem(index);
                            setActiveTab("order");
                          }}
                          item={item}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </div>
            )}
          </div>
        </Row>
      </div>
    );
  };

  const renderDashboard = () => {
    return (
      <div className="activity-section">
        <SectionHeader headerTitle="Home" />
        <Row className="mb-4">
          <Col xs={4} className="mt-4"></Col>
          <Col xs={4} className="mt-4 pb-3 dashboard-block">
            <div className="mt-3">
              <h4>Total NFTs minted: {minted}/2763</h4>
              <h4>Mint a new NFT</h4>
              <div className="price-container">
                <h4 className="d-flex justify-content-center align-items-center">
                  {1 * amountToMint} WGM
                  {/* <img className="price-logo" src={avaxLogo} alt="avax-logo" /> */}
                </h4>
              </div>
              <div className="d-flex flex-row align-items-center justify-content-center">
                <button
                  className="mint-icon"
                  onClick={() => handleAmountToMint(Number(amountToMint) - 1)}
                >
                  -
                </button>
                <NumberFormat
                  className="mint-input"
                  value={amountToMint}
                  allowLeadingZeros={false}
                  allowNegative={false}
                  onValueChange={({ value }) => handleAmountToMint(value)}
                />
                <button
                  className="mint-icon"
                  onClick={() => handleAmountToMint(Number(amountToMint) + 1)}
                >
                  +
                </button>
              </div>
              <button disabled={isLoading} onClick={handleMint}>
                Mint
              </button>
            </div>
          </Col>
          <Col xs={4} className="mt-4"></Col>
        </Row>
        <Row className="mb-4">
          <Col xs={4} className="mt-4"></Col>
          <Col xs={4} className="mt-4 pb-3 dashboard-block">
            <div className="mt-3">
              <h4>Airdrop</h4>
              {isWhitelisted ? (
                isClaimed ? (
                  <h4>Airdrop already claimed</h4>
                ) : (
                  <>
                    <h4>You're on the whitelist</h4>
                    <div className="price-container">
                      <h4 className="d-flex justify-content-center align-items-center">
                        100
                        <img
                          className="price-logo"
                          src={earthLogo}
                          alt="avax-logo"
                        />
                      </h4>
                    </div>
                    <button
                      disabled={isLoading || !isWhitelisted}
                      onClick={handleAirdrop}
                    >
                      Claim
                    </button>
                  </>
                )
              ) : (
                <h4>You're not on the whitelist</h4>
              )}
            </div>
          </Col>
          <Col xs={4} className="mt-4"></Col>
        </Row>
      </div>
    );
  };

  return (
    <div className="App">
      <Container fluid>
        <Sidebar
          isAccount={true}
          onAccountTabChange={(tab) => setActiveTab(tab)}
        />
        <div className="page-content">
          <Row>
            <Col xs={12}>
              <Header
                userBalances={userBalances}
                userAddress={userAddress}
                setUserAddress={setUserAddress}
                connectWallet={connectWallet}
              />
            </Col>
            <Col xs={12}>
              {activeTab === "wallet"
                ? renderUserWallet()
                : activeTab === "activity"
                ? renderActiveOrders()
                : activeTab === "item"
                ? renderItemPreview()
                : activeTab === "dashboard"
                ? renderDashboard()
                : activeTab === "order"
                ? renderOrderPreview()
                : null}
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Account;
