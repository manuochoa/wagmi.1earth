import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Badge, Form } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import "./styles.css";

// IMAGES
import musicGray from "../../assets/Images/icons/music-gray.png";
import playGray from "../../assets/Images/icons/play-gray.png";
import imageGray from "../../assets/Images/icons/Image-gray.png";
import arrowLeft from "../../assets/Images/icons/arrow-left.png";
import itemImage from "../../assets/Images/item.png";
import UserItemCard from "../../components/UserItemCard";

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
} from "../../blockchain/functions";

const Account = ({
  userAddress,
  setUserAddress,
  connectWallet,
  userBalances,
  loadUserBalances,
}) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [minted, setMinted] = useState("");
  const [items, setItems] = useState([]);
  const [activeItem, setActiveItem] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState("");
  const [marketAllowance, setMarketAllowance] = useState(false);

  const getInventoryNFTs = async () => {
    let totalSupply = await getMintedNFTs();
    if (totalSupply) {
      setMinted(totalSupply.toString());
    }
    if (userAddress) {
      let receipt = await getUserNFTs(userAddress);
      console.log(receipt, "inventory");

      if (receipt) {
        setItems(receipt);
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
    }

    setIsLoading(false);
  };

  const handleUpdateOrder = async (_tokenId) => {
    setIsLoading(true);

    let result = await updateOrder(_tokenId, price);
    if (result) {
      console.log(result);
    }

    setIsLoading(false);
  };

  const handleAcceptBid = async (_tokenId) => {
    setIsLoading(true);

    let result = await acceptBid(_tokenId);
    if (result) {
      console.log(result);
    }

    loadUserBalances();
    setIsLoading(false);
  };

  const handleClaim = async () => {
    setIsLoading(true);

    let result = await claim();
    if (result) {
      console.log(result);
    }

    loadUserBalances();
    setIsLoading(false);
  };

  const handleClaimRewards = async (_tokenId) => {
    setIsLoading(true);

    let result = await claimRewards(_tokenId);
    if (result) {
      console.log(result);
    }

    loadUserBalances();
    setIsLoading(false);
  };

  const handleClaimReflections = async (_tokenId) => {
    setIsLoading(true);

    let result = await claimReflections(_tokenId);
    if (result) {
      console.log(result);
    }

    loadUserBalances();
    setIsLoading(false);
  };

  const handleMint = async () => {
    setIsLoading(true);

    let result = await mintNFT();
    if (result) {
      console.log(result);
    }

    getInventoryNFTs();
    loadUserBalances();

    setIsLoading(false);
  };

  const checkAllowance = async (_tokenId) => {
    if (userAddress) {
      let result = await checkERC721Allowance(userAddress);
      if (result) {
        setMarketAllowance(result);
      }
    }
  };

  useEffect(() => {
    getInventoryNFTs();
    checkAllowance();
  }, [userAddress]);

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
              <div className="item-image d-flex justify-content-center align-items-center mt-5 mb-5 pt-5 pb-5">
                <img className="img-fluid" src={item.metadata.image} alt="" />
              </div>
            </Col>
            <Col xs={7}>
              <div className="item-info mt-5 mb-5 pt-5 pb-5">
                <h5 className="item-number">Token Id: {item.token_id}</h5>
                <h3 className="item-name">{item.metadata.name}</h3>
                <div className="item-price d-flex align-items-center">
                  <h1 className="me-5">
                    <Form.Control
                      className="nft-input"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="$0"
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
            <Col xs={6}>
              <div className="info p-4 d-flex flex-column">
                <h3 className="mb-4">About</h3>
                <div className="d-flex">
                  <div className="info-item">
                    <h4>Machine</h4>
                    <h6>
                      <Badge className="rarity-badge nft-blue-bg me-2">
                        {/* {getMachineSize(Number(item.giftPrice))} */}
                      </Badge>
                    </h6>
                  </div>
                  <div className="info-item">
                    <h4>Rarity</h4>
                    <h6>
                      <Badge
                        className={
                          item.metadata.attributes[0].value === "Common"
                            ? "rarity-badge"
                            : item.metadata.attributes[0].value === "Endangered"
                            ? "rarity-badge nft-Endangered"
                            : item.metadata.attributes[0].value === "Shiny"
                            ? "rarity-badge nft-Shiny"
                            : item.metadata.attributes[0].value === "Unique"
                            ? "rarity-badge nft-Unique"
                            : item.metadata.attributes[0].value ===
                              "Shiny Endangered"
                            ? "rarity-badge nft-sEndangered"
                            : "rarity-badge"
                        }
                      >
                        {item.metadata.attributes[0].value}
                      </Badge>
                    </h6>
                  </div>
                </div>
                <div className="owner-detail mt-5 d-flex align-items-center ">
                  <h4 className="mr-3">
                    Pending Rewards: {item.pendingRewards} AVAX
                  </h4>
                  <button
                    disabled={isLoading}
                    onClick={() => handleClaimRewards(item.token_id)}
                    className="nft-buy-button m-3"
                  >
                    Claim
                  </button>
                </div>
                <div className="owner-detail mt-5 d-flex align-items-center ">
                  <h4 className="mr-3">
                    Pending Reflections: {item.pendingReflections} $1EARTH
                  </h4>
                  <button
                    disabled={isLoading}
                    onClick={() => handleClaimReflections(item.token_id)}
                    className="nft-buy-button m-3"
                  >
                    Claim
                  </button>
                </div>
              </div>
            </Col>
            <Col xs={6}>
              <div className="info p-4">
                <h3 className="mb-4">Sale History</h3>
                <div className="d-flex">
                  <h4 className="buyer-title ps-2">Buyer</h4>
                  <h4 className="seller-title">Seller</h4>
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
        <SectionHeader headerTitle="Wallet" />
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
      </div>
    );
  };

  const renderDashboard = () => {
    return (
      <div className="activity-section">
        <SectionHeader headerTitle="Dashboard" />
        <div className="mt-3">
          <h4>Total NFTs minted: {minted}/2763</h4>
          <h4>Mint a new NFT</h4>
          <button disabled={isLoading} onClick={handleMint}>
            Mint
          </button>
        </div>
        <div className="mt-3">
          <h4>Balances:</h4>
          <h5>{userBalances[0]?.value} $1EARTH</h5>
          <h5>{userBalances[1]?.value} AVAX</h5>
        </div>
        <div className="mt-3">
          <h4>Your Holder Rewards: {userBalances[2]?.value} AVAX</h4>
          <h5> Claim your rewards</h5>
          <button disabled={isLoading} onClick={handleClaim}>
            Claim
          </button>
        </div>
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
                : null}
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Account;
