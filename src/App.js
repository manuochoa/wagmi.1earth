import React, { useState, useEffect } from "react";
import {
  Col,
  Container,
  DropdownButton,
  Dropdown,
  Row,
  Button,
  Card,
  Badge,
} from "react-bootstrap";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ItemCard from "./components/ItemCard";
import SaleInfoCard from "./components/SaleInfoCard";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import arrowLeft from "./assets/Images/icons/arrow-left.png";

import {
  getMarketNFTs,
  executeOrder,
  checkAllowance,
  increaseAllowance,
} from "./blockchain/functions";

function App({ userAddress, setUserAddress, connectWallet, userBalances }) {
  const [activeItem, setActiveItem] = useState(0);
  const [isPreviewItem, setIsPreviewItem] = useState(false);
  const [marketsAllowance, setMarketsAllowance] = useState({
    marketAllowance: false,
    bundlerAllowance: false,
  });
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const itemSaleHistory = [
    {
      buyerName: "cutepapyboy",
      buyerId: "ronin:4568f...15ad",
      sellerName: "Kush | HA",
      sellerId: "ronin:4568f...15ad",
      price: "0.023 ETH",
      date: "Jul, 5 2022",
    },
    {
      buyerName: "cutepapyboy",
      buyerId: "ronin:4568f...15ad",
      sellerName: "Kush | HA",
      sellerId: "ronin:4568f...15ad",
      price: "0.023 ETH",
      date: "Jul, 5 2022",
    },
    {
      buyerName: "cutepapyboy",
      buyerId: "ronin:4568f...15ad",
      sellerName: "Kush | HA",
      sellerId: "ronin:4568f...15ad",
      price: "0.023 ETH",
      date: "Jul, 5 2022",
    },
  ];

  const handleBuy = async (item) => {
    setIsLoading(true);

    let receipt = await executeOrder(item.token_id, item.itemInfo.price);

    if (receipt) {
      console.log(receipt);
    }

    setIsLoading(false);
  };

  const getItems = async () => {
    let result = await getMarketNFTs();
    if (result) {
      setItems(result);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

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

  const renderItems = () => {
    return (
      <div className="items-section">
        <SectionHeader />
        <div className="section-items mt-4 mb-4">
          <Row>
            {items.map((item, index) => {
              return (
                <div key={index} className="col-2 mt-4">
                  <ItemCard
                    onClick={() => {
                      setActiveItem(index);
                      setIsPreviewItem(true);
                    }}
                    item={item}
                  />
                </div>
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
                    {item.itemInfo?.price / 10 ** 18} AVAX
                  </h1>
                  <Button
                    disabled={isLoading}
                    onClick={
                      userAddress ? () => handleBuy(item) : connectWallet()
                    }
                    className="nft-buy-button"
                  >
                    {isLoading ? "Buying..." : "Buy now"}
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
                </div>
                <div className="owner-detail mt-5 d-flex align-items-center ">
                  <h4 className="mr-3">
                    Pending Reflections: {item.pendingReflections} $1EARTH
                  </h4>
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
                {itemSaleHistory.map((item, index) => {
                  return (
                    <SaleInfoCard
                      key={index}
                      buyerName={item.buyerName}
                      buyerId={item.buyerId}
                      sellerName={item.sellerName}
                      sellerId={item.sellerId}
                      price={item.price}
                      date={item.date}
                    />
                  );
                })}
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
        <Sidebar userAddress={userAddress} />
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
