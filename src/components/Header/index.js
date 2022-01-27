import React, { useEffect } from "react";
import { Button, Dropdown, DropdownButton, Col, Row } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles.css";

// IMAGES
import dropdownIcon from "../../assets/Images/icons/dropdown.png";

const Header = ({
  userAddress,
  connectWallet,
  setUserAddress,
  userBalances,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToAccount = () => {
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const disconnectWallet = () => {
    setUserAddress("");
    window.localStorage.removeItem("userAddress");
  };

  useEffect(() => {}, []);

  return (
    <header className="pt-4 pb-4 d-flex justify-content-end align-items-center">
      <Row className="w-50">
        {userBalances.map((item, index) => {
          return (
            <Col key={index} className="nft-img-dropdown">
              {item.value} <span className="ms-1">{item.coin}</span>
            </Col>
          );
        })}
      </Row>
      <DropdownButton
        className="nft-img-dropdown m-2"
        title={
          <span>
            {userAddress ? (
              <div>
                <h5 className="m-0">
                  {userAddress.slice(0, 6)}...{userAddress.slice(-6)}
                </h5>{" "}
              </div>
            ) : (
              <div>
                <h5 className="m-0">Connect Wallet</h5>
              </div>
            )}
          </span>
        }
      >
        {userAddress && <Dropdown.Item href="">Copy Address</Dropdown.Item>}
        <Dropdown.Item
          onClick={
            userAddress ? () => disconnectWallet() : () => connectWallet()
          }
          href=""
        >
          {userAddress ? "Disconnect" : "Connect Wallet"}
        </Dropdown.Item>
      </DropdownButton>
      <Button className="nft-button" onClick={() => navigateToAccount()}>
        Wallet
        <img className="img-fluid ms-2" src={dropdownIcon} alt="" />
      </Button>
    </header>
  );
};

export default Header;
