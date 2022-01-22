import React, { useEffect } from "react";
import { Badge, Card } from "react-bootstrap";
import "./styles.css";
import musicGray from "../../assets/Images/icons/music-gray.png";
import playGray from "../../assets/Images/icons/play-gray.png";
import imageGray from "../../assets/Images/icons/Image-gray.png";
import Carousel from "react-bootstrap/Carousel";

const BundleCard = (props) => {
  const { item, bundle, onClick } = props;

  const getMachineSize = (price) => {
    console.log(price, "price");
    if (price > 10000) {
      return "XXL";
    } else if (price > 1000) {
      return "XL";
    } else if (price > 100) {
      return "L";
    } else if (price > 10) {
      return "M";
    } else {
      return "S";
    }
  };

  useEffect(() => {
    console.log(item, "bundle");
  }, []);

  return (
    <Card
      onClick={onClick}
      className={`item-card ${bundle ? "bundle-card" : null}`}
    >
      <Card.Body>
        <div className="item-image d-flex justify-content-center align-items-center mt-4 pt-2">
          <Carousel controls={false} interval={1000}>
            {item.items.map((token, index) => {
              return (
                <Carousel.Item key={index}>
                  <img
                    // className="d-block w-100"
                    src={token.metadata.image}
                    alt="First slide"
                  />
                </Carousel.Item>
              );
            })}
          </Carousel>
        </div>
        <h3 className="mt-3 mb-0 item-price d-flex justify-content-between align-items-center">
          {item.price / 10 ** 18} TPL
          {bundle ? (
            <span>
              <h6>
                <Badge className="rarity-badge nft-blue-bg me-2">
                  {item.items.length} Items
                </Badge>
              </h6>
            </span>
          ) : null}
        </h3>
        {item.name ? <h5 className="m-0 item-name">{item.name}</h5> : null}
      </Card.Body>
    </Card>
  );
};

export default BundleCard;
