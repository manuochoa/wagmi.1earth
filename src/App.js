import React, { useState } from "react";
import { Col, Container, Row, Button, Badge } from "react-bootstrap";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ItemCard from "./components/ItemCard";
import NumberFormat from "react-number-format";
import avaxLogo from "./assets/Images/avax-logo.png";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import arrowLeft from "./assets/Images/icons/arrow-left.png";

import { executeOrder, placeBid, cancelBid } from "./blockchain/functions";

function App({
  userAddress,
  setUserAddress,
  connectWallet,
  userBalances,
  items,
  setItems,
  getItems,
  floorPrice,
}) {
  const [activeItem, setActiveItem] = useState(0);
  const [isPreviewItem, setIsPreviewItem] = useState(false);
  const [bid, setBid] = useState("");
  const [rarityFilter, setRarityFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");

  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async (item) => {
    setIsLoading(true);

    let receipt = await executeOrder(item.token_id, item.itemInfo.price);

    if (receipt) {
      console.log(receipt);
      setIsPreviewItem(false);
      getItems();
    }

    setIsLoading(false);
  };

  const handleBid = async (item) => {
    setIsLoading(true);

    let receipt = await placeBid(item.token_id, bid);

    if (receipt) {
      console.log(receipt);
      getItems();
    }

    setIsLoading(false);
  };

  const handleCancelBid = async (item) => {
    setIsLoading(true);

    let receipt = await cancelBid(item.token_id);

    if (receipt) {
      console.log(receipt);
      getItems();
    }

    setIsLoading(false);
  };

  const SectionHeader = (props) => {
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

  const sortItems = (value) => {
    let temp = items;
    if (value === "High to Low") {
      temp.sort((a, b) => b.itemInfo.price - a.itemInfo.price);
    } else if (value === "Low to High") {
      temp.sort((a, b) => a.itemInfo.price - b.itemInfo.price);
    }

    setItems(temp);
  };

  const renderItems = () => {
    return (
      <div className="items-section">
        <SectionHeader />
        <div className="section-items mt-4 mb-4">
          <Row>
            {items.map((item, index) => {
              return rarityFilter === "All" && classFilter === "All" ? (
                <div key={index} className="col-2 mt-4">
                  <ItemCard
                    onClick={() => {
                      setActiveItem(index);
                      setIsPreviewItem(true);
                    }}
                    item={item}
                  />
                </div>
              ) : item.metadata?.attributes[0]?.value === rarityFilter &&
                classFilter === "All" ? (
                <div key={index} className="col-2 mt-4">
                  <ItemCard
                    onClick={() => {
                      setActiveItem(index);
                      setIsPreviewItem(true);
                    }}
                    item={item}
                  />
                </div>
              ) : item.metadata?.attributes[1]?.value === classFilter &&
                rarityFilter === "All" ? (
                <div key={index} className="col-2 mt-4">
                  <ItemCard
                    onClick={() => {
                      setActiveItem(index);
                      setIsPreviewItem(true);
                    }}
                    item={item}
                  />
                </div>
              ) : (
                item.metadata?.attributes[1]?.value === classFilter &&
                item.metadata?.attributes[0]?.value === rarityFilter && (
                  <div key={index} className="col-2 mt-4">
                    <ItemCard
                      onClick={() => {
                        setActiveItem(index);
                        setIsPreviewItem(true);
                      }}
                      item={item}
                    />
                  </div>
                )
              );
            })}
          </Row>
        </div>
      </div>
    );
  };

  const renderItemPreview = () => {
    const item = items[activeItem];

    return (
      <div className="item-section">
        <SectionHeader
          isPreview={true}
          onClickBack={() => setIsPreviewItem(false)}
        />
        <div className="item-preview mt-4">
          <Row className="mt-4">
            <Col xs={5}>
              <div className="item-image d-flex justify-content-center align-items-center pb-5">
                <img className="img-fluid" src={item.metadata.image} alt="" />
              </div>
            </Col>
            <Col xs={7}>
              <div className="item-info mt-5 mb-5 pt-5 pb-5">
                <h5 className="item-number">Mint #{item.token_id}</h5>
                <h3 className="item-name">{item.metadata.name}</h3>
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
                <Button
                  disabled={isLoading}
                  onClick={
                    userAddress ? () => handleBuy(item) : connectWallet()
                  }
                  className="nft-buy-button mt-4"
                >
                  Buy now
                </Button>
              </div>
            </Col>
            <Col xs={6}>
              <div className="info p-4 d-flex flex-column">
                <h3 className="mb-4">About</h3>
                <div className="d-flex">
                  {/* <div className="info-item"> */}
                  <h4>Rarity:</h4>
                  <div className="badge-container">
                    <Badge
                      className={
                        item.metadata.attributes[0]?.value === "Common"
                          ? "rarity-badge"
                          : item.metadata.attributes[0]?.value === "Endangered"
                          ? "rarity-badge nft-Endangered"
                          : item.metadata.attributes[0]?.value === "Shiny"
                          ? "rarity-badge nft-Shiny"
                          : item.metadata.attributes[0]?.value === "unique"
                          ? "rarity-badge nft-Unique"
                          : item.metadata.attributes[0]?.value ===
                            "Shiny Endangered"
                          ? "rarity-badge nft-sEndangered"
                          : "rarity-badge"
                      }
                    >
                      {item.metadata.attributes[0]?.value}
                    </Badge>
                  </div>

                  {/* </div> */}
                </div>
                <div className="d-flex">
                  <h4>Class: {item.metadata.attributes[1]?.value}</h4>
                </div>
                <div className="d-flex mt-3">
                  <h4>Collection: Nicaragua</h4>
                </div>
              </div>
            </Col>
            <Col xs={6}>
              <div className="info p-4">
                <h3 className="mb-3">Bids</h3>
                <div className="mb-3">
                  <h5>Current Bid: {item.bids.price / 10 ** 18} AVAX</h5>
                  <span>
                    {item.bids.bidder !==
                      "0x0000000000000000000000000000000000000000" &&
                      item.bids.bidder}
                  </span>
                </div>

                {userAddress.toLowerCase() ===
                item.bids.bidder.toLowerCase() ? (
                  <div>
                    <button
                      disabled={isLoading}
                      onClick={
                        userAddress
                          ? () => handleCancelBid(item)
                          : connectWallet()
                      }
                      className="nft-buy-button"
                    >
                      Cancel Bid
                    </button>
                  </div>
                ) : (
                  <div className="bid-box">
                    <h5>Place a Bid:</h5>
                    <NumberFormat
                      className="bid-input"
                      value={bid}
                      allowLeadingZeros={false}
                      allowNegative={false}
                      onValueChange={({ value }) => setBid(value)}
                    />
                    <button
                      disabled={isLoading}
                      onClick={
                        userAddress ? () => handleBid(item) : connectWallet()
                      }
                      className="nft-buy-button"
                    >
                      Place Bid
                    </button>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <Container fluid>
        <Sidebar
          classFilter={classFilter}
          setClassFilter={setClassFilter}
          rarityFilter={rarityFilter}
          setRarityFilter={setRarityFilter}
          userAddress={userAddress}
          floorPrice={floorPrice}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          sortItems={sortItems}
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
              {isPreviewItem ? renderItemPreview() : renderItems()}
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default App;
