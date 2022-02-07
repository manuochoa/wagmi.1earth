import React from "react";
import { Badge, Card } from "react-bootstrap";
import avaxLogo from "../../assets/Images/avax-logo.png";
import "./styles.css";

const ItemCard = (props) => {
  const { item, bundle, onClick } = props;

  return (
    <Card
      onClick={onClick}
      className={`item-card ${bundle ? "bundle-card" : null}`}
    >
      <Card.Img
        className="card-main-img"
        src={item.metadata.image}
        alt="NFT Image"
      />

      <Card.Body className="d-flex flex-column align-items-center">
        <div className="price-container">
          <h3 className="mt-1 mb-1 item-price d-flex justify-content-between align-items-center">
            {item.itemInfo?.price / 10 ** 18}
          </h3>
          <img className="price-logo" src={avaxLogo} alt="" />
        </div>
        {item.metadata.name ? (
          <h5 className="m-0 mb-1 item-name">{item.metadata.name}</h5>
        ) : null}
        {item.metadata.attributes[0] !== "" ? (
          <div className="tags mt-2 d-flex">
            <Badge
              className={
                item.metadata.attributes[0].value === "Common"
                  ? "rarity-badge"
                  : item.metadata.attributes[0].value === "Endangered"
                  ? "rarity-badge nft-Endangered"
                  : item.metadata.attributes[0].value === "Shiny"
                  ? "rarity-badge nft-Shiny"
                  : item.metadata.attributes[0].value === "unique"
                  ? "rarity-badge nft-Unique"
                  : item.metadata.attributes[0].value === "Shiny Endangered"
                  ? "rarity-badge nft-sEndangered"
                  : "rarity-badge"
              }
            >
              {item.metadata.attributes[0].value}
            </Badge>
          </div>
        ) : null}
      </Card.Body>
    </Card>
  );
};

export default ItemCard;
