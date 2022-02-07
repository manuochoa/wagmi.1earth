import React, { useState } from "react";
import {
  Badge,
  Button,
  Col,
  Dropdown,
  DropdownButton,
  Nav,
  Row,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "rc-slider/assets/index.css";
import "./styles.css";

import Logo from "../../assets/Images/logo.png";
import dropdownIcon from "../../assets/Images/icons/dropdown.png";
import avaxLogo from "../../assets/Images/avax-logo.png";

const Sidebar = (props) => {
  const {
    floorPrice,
    isAccount,
    onAccountTabChange,
    rarityFilter,
    setRarityFilter,
    priceFilter,
    setPriceFilter,
    sortItems,
    classFilter,
    setClassFilter,
  } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const [activeAccountTab, setActiveAccountTab] = useState("account");

  const onChangeAccountTab = (tab) => {
    setActiveAccountTab(tab);
    onAccountTabChange(tab);
  };

  const onClickLogo = () => {
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const onClickMarketplace = () => {
    navigate("/marketplace");
  };

  const giftTab = () => {
    return (
      <Row>
        <Col xs={12}>
          <h6 className="text-uppercase mt-2 text-nft-light">Price</h6>
        </Col>
        <Col xs={12}>
          <DropdownButton
            variant="outline-secondary"
            id="input-group-dropdown-1"
            className="nft-dropdown mt-3"
            title={
              <span className="d-flex justify-content-between align-items-center">
                <h6 className="m-0">{priceFilter}</h6>
                <img src={dropdownIcon} alt="" />
              </span>
            }
            onSelect={(value) => {
              setPriceFilter(value);
              sortItems(value);
            }}
          >
            <Dropdown.Item eventKey="All">All</Dropdown.Item>
            <Dropdown.Item eventKey="High to Low">High to Low</Dropdown.Item>
            <Dropdown.Item eventKey="Low to High">Low to High</Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col className="mt-4" xs={12}>
          <h6 className="text-uppercase mt-2 text-nft-light">Rarity</h6>
        </Col>
        <Col xs={12}>
          <DropdownButton
            variant="outline-secondary"
            id="input-group-dropdown-1"
            className="nft-dropdown mt-3"
            title={
              <span className="d-flex justify-content-between align-items-center">
                <h6 className="m-0">{rarityFilter}</h6>
                <img src={dropdownIcon} alt="" />
              </span>
            }
            onSelect={(value) => {
              setRarityFilter(value);
              setPriceFilter("All");
            }}
          >
            <Dropdown.Item eventKey="All">ALL</Dropdown.Item>
            <Dropdown.Item eventKey="Common">
              <Badge className="rarity-badge">Common</Badge>
            </Dropdown.Item>
            <Dropdown.Item eventKey="Endangered">
              <Badge className="rarity-badge nft-Endangered">Endangered</Badge>
            </Dropdown.Item>
            <Dropdown.Item eventKey="Shiny">
              <Badge className="rarity-badge nft-Shiny">Shiny</Badge>
            </Dropdown.Item>
            <Dropdown.Item eventKey="unique">
              <Badge className="rarity-badge nft-Unique">Unique</Badge>
            </Dropdown.Item>
            <Dropdown.Item eventKey="Shiny Endangered">
              <Badge className="rarity-badge nft-sEndangered">
                Shiny Endangered
              </Badge>
            </Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col className="mt-4" xs={12}>
          <h6 className="text-uppercase mt-2 text-nft-light">Class</h6>
        </Col>
        <Col xs={12}>
          <DropdownButton
            variant="outline-secondary"
            id="input-group-dropdown-1"
            className="nft-dropdown mt-3"
            title={
              <span className="d-flex justify-content-between align-items-center">
                <h6 className="m-0">{classFilter}</h6>
                <img src={dropdownIcon} alt="" />
              </span>
            }
            onSelect={(value) => {
              setClassFilter(value);
              setPriceFilter("All");
            }}
          >
            <Dropdown.Item eventKey="All">ALL</Dropdown.Item>
            <Dropdown.Item eventKey="Amphibian">Amphibian</Dropdown.Item>
            <Dropdown.Item eventKey="Animal">Animal</Dropdown.Item>
            <Dropdown.Item eventKey="Bird">Bird</Dropdown.Item>
            <Dropdown.Item eventKey="Environment">Environment</Dropdown.Item>
            <Dropdown.Item eventKey="Insect">Insect</Dropdown.Item>
            <Dropdown.Item eventKey="Plant">Plant</Dropdown.Item>
            <Dropdown.Item eventKey="Reptile">Reptile</Dropdown.Item>
          </DropdownButton>
        </Col>
        <Col className="d-flex align-items-center mt-4" xs={12}>
          <h6 className="text-uppercase mt-2 text-nft-light">
            Floor Price: {Number(floorPrice) / 10 ** 18}
          </h6>
          <img className="price-logo" src={avaxLogo} alt="avax-logo" />
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Nav className="sidebar d-flex flex-column">
        <Nav.Item className="nft-logo d-flex justify-content-center mb-5">
          <a role="button" onClick={() => onClickLogo()}>
            <img src={Logo} alt="" className="img-fluid" />
          </a>
        </Nav.Item>
        {isAccount ? (
          <div className="account">
            <Nav.Item className="mt-5 account-btn">
              <a role="button" onClick={() => onChangeAccountTab("dashboard")}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.2082 5.00854H13.7665C16.8415 5.00854 18.3415 6.65021 18.3332 10.0169V14.0752C18.3332 17.2919 16.3498 19.2752 13.1248 19.2752H6.8665C3.65817 19.2752 1.6665 17.2919 1.6665 14.0669V7.80854C1.6665 4.35854 3.19984 2.60854 6.22484 2.60854H7.5415C8.31734 2.60021 9.0415 2.95854 9.5165 3.56687L10.2498 4.54187C10.4832 4.83354 10.8332 5.00854 11.2082 5.00854ZM6.14148 13.6835H13.8582C14.1998 13.6835 14.4748 13.4002 14.4748 13.0585C14.4748 12.7085 14.1998 12.4335 13.8582 12.4335H6.14148C5.79148 12.4335 5.51648 12.7085 5.51648 13.0585C5.51648 13.4002 5.79148 13.6835 6.14148 13.6835Z"
                    fill={
                      activeAccountTab === "dashboard" ? "#53B9EA" : "#6F6C99"
                    }
                  />
                </svg>
                <span
                  className={`ms-4 ${
                    activeAccountTab === "dashboard" ? "active" : ""
                  }`}
                >
                  Home
                </span>
              </a>
            </Nav.Item>
            <Nav.Item className="mt-5 account-btn">
              <a role="button" onClick={() => onChangeAccountTab("wallet")}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.2082 5.00854H13.7665C16.8415 5.00854 18.3415 6.65021 18.3332 10.0169V14.0752C18.3332 17.2919 16.3498 19.2752 13.1248 19.2752H6.8665C3.65817 19.2752 1.6665 17.2919 1.6665 14.0669V7.80854C1.6665 4.35854 3.19984 2.60854 6.22484 2.60854H7.5415C8.31734 2.60021 9.0415 2.95854 9.5165 3.56687L10.2498 4.54187C10.4832 4.83354 10.8332 5.00854 11.2082 5.00854ZM6.14148 13.6835H13.8582C14.1998 13.6835 14.4748 13.4002 14.4748 13.0585C14.4748 12.7085 14.1998 12.4335 13.8582 12.4335H6.14148C5.79148 12.4335 5.51648 12.7085 5.51648 13.0585C5.51648 13.4002 5.79148 13.6835 6.14148 13.6835Z"
                    fill={activeAccountTab === "wallet" ? "#53B9EA" : "#6F6C99"}
                  />
                </svg>
                <span
                  className={`ms-4 ${
                    activeAccountTab === "wallet" ? "active" : ""
                  }`}
                >
                  My Collections
                </span>
              </a>
            </Nav.Item>
            <Nav.Item className="mt-5 account-btn">
              <a role="button" onClick={() => onChangeAccountTab("activity")}>
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.3166 2.61673C13.3166 1.5084 14.2166 0.608398 15.3249 0.608398C16.4332 0.608398 17.3332 1.5084 17.3332 2.61673C17.3332 3.72507 16.4332 4.62507 15.3249 4.62507C14.2166 4.62507 13.3166 3.72507 13.3166 2.61673ZM10.1082 11.2412L12.5165 8.13365L12.4832 8.15032C12.6165 7.96699 12.6415 7.73365 12.5498 7.52532C12.459 7.31699 12.2582 7.17532 12.0423 7.15865C11.8165 7.13365 11.5923 7.23365 11.4582 7.41699L9.44235 10.0253L7.13318 8.20865C6.99151 8.10032 6.82485 8.05782 6.65818 8.07532C6.49235 8.10032 6.34235 8.19115 6.24151 8.32449L3.77568 11.5337L3.72485 11.6087C3.58318 11.8745 3.64985 12.2162 3.89985 12.4003C4.01651 12.4753 4.14151 12.5253 4.28318 12.5253C4.47568 12.5337 4.65818 12.4328 4.77485 12.2753L6.86651 9.58282L9.24151 11.367L9.31651 11.4162C9.58318 11.5578 9.91651 11.492 10.1082 11.2412ZM11.8748 2.09199C11.8415 2.30032 11.8248 2.50865 11.8248 2.71699C11.8248 4.59199 13.3415 6.10782 15.2082 6.10782C15.4165 6.10782 15.6165 6.08365 15.8248 6.05032V12.7745C15.8248 15.6003 14.1582 17.2753 11.3248 17.2753H5.16734C2.33317 17.2753 0.666504 15.6003 0.666504 12.7745V6.60865C0.666504 3.77532 2.33317 2.09199 5.16734 2.09199H11.8748Z"
                    fill={
                      activeAccountTab === "activity" ? "#53B9EA" : "#6F6C99"
                    }
                  />
                </svg>
                <span
                  className={`ms-4 ${
                    activeAccountTab === "activity" ? "active" : ""
                  }`}
                >
                  Items for Sale
                </span>
              </a>
            </Nav.Item>
            <Nav.Item className="mt-5 account-btn market-tab">
              <Button
                onClick={onClickMarketplace}
                className="marketplace-button"
              >
                Marketplace
              </Button>
            </Nav.Item>
          </div>
        ) : (
          <Nav.Item className="mt-5 d-flex flex-column">
            <div className="items-tab">{giftTab()}</div>
          </Nav.Item>
        )}
      </Nav>
    </>
  );
};

export default Sidebar;
