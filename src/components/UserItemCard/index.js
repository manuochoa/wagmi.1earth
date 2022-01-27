import React from "react";
import { Badge, Card } from "react-bootstrap";
import "./styles.css";

const UserItemCard = (props) => {
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
        {/* <div className="item-image d-flex justify-content-center align-items-center mt-4 pt-2">
          <img src={item.metadata?.image} alt="" />
        </div> */}
        {item.metadata.name ? (
          <h5 className="m-0 mb-1 item-name">{item.metadata.name}</h5>
        ) : null}
        {item.metadata?.attributes[0] !== "" ? (
          <div className="tags mt-2 d-flex">
            <Badge
              className={
                item.metadata.attributes[0]?.value === "Common"
                  ? "rarity-badge"
                  : item.metadata.attributes[0]?.value === "Endangered"
                  ? "rarity-badge nft-Endangered"
                  : item.metadata.attributes[0]?.value === "Shiny"
                  ? "rarity-badge nft-Shiny"
                  : item.metadata.attributes[0]?.value === "Unique"
                  ? "rarity-badge nft-Unique"
                  : item.metadata.attributes[0]?.value === "Shiny Endangered"
                  ? "rarity-badge nft-sEndangered"
                  : "rarity-badge"
              }
            >
              {item.metadata?.attributes[0].value}
            </Badge>
          </div>
        ) : null}
      </Card.Body>
    </Card>
  );
};

export default UserItemCard;
