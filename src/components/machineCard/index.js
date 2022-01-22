import React, { useEffect } from "react";
import { Badge, Card } from "react-bootstrap";
import "./styles.css";
import musicGray from "../../assets/Images/icons/music-gray.png";
import playGray from "../../assets/Images/icons/play-gray.png";
import imageGray from "../../assets/Images/icons/Image-gray.png";
import Carousel from "react-bootstrap/Carousel";

const MachineCard = (props) => {
  const { item, bundle, onClick } = props;

  const getMachineSize = (size) => {
    if (size === 4) {
      return "XXL";
    } else if (size === 3) {
      return "XL";
    } else if (size === 2) {
      return "L";
    } else if (size === 1) {
      return "M";
    } else {
      return "S";
    }
  };

  useEffect(() => {
    console.log(item, "machine");
  }, []);

  return (
    <Card
      onClick={onClick}
      className={`item-card ${bundle ? "bundle-card" : null}`}
    >
      <Card.Body>
        <div className="item-image d-flex justify-content-center align-items-center mt-4 pt-2 flex-column">
          {/* <Carousel controls={false} interval={1000}>
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
          </Carousel> */}
          <svg
            width="150"
            height="150"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 512 512"
            style={{ marginBottom: "10px" }}
          >
            <g>
              <g>
                <rect x="205.913" y="100.174" width="100.174" height="77.913" />
              </g>
            </g>
            <g>
              <g>
                <path
                  d="M422.957,0H89.044c-9.217,0-16.696,7.473-16.696,16.696c0,9.223,7.479,16.696,16.696,16.696h16.696V244.87h300.522V33.391
			h16.696c9.217,0,16.696-7.473,16.696-16.696C439.652,7.473,432.174,0,422.957,0z M339.478,194.783
			c0,9.223-7.479,16.696-16.696,16.696H189.217c-9.217,0-16.696-7.473-16.696-16.696V83.478c0-9.223,7.479-16.696,16.696-16.696
			h133.565c9.217,0,16.696,7.473,16.696,16.696V194.783z"
                  fill="white"
                />
              </g>
            </g>
            <g>
              <g>
                <path
                  d="M72.348,378.435v116.87c0,9.223,7.479,16.696,16.696,16.696h333.913c9.217,0,16.696-7.473,16.696-16.696v-116.87H72.348z
			 M339.478,478.609H172.522v-33.391h166.957V478.609z,"
                  fill="white"
                />
              </g>
            </g>
            <g>
              <g>
                <path
                  d="M434.987,345.043l-22.261-66.783H99.273l-22.261,66.783h95.509v-16.696c0-9.223,7.479-16.696,16.696-16.696
			s16.696,7.473,16.696,16.696v16.696h100.174v-16.696c0-9.223,7.479-16.696,16.696-16.696c9.217,0,16.696,7.473,16.696,16.696
			v16.696H434.987z"
                  fill="white"
                />
              </g>
            </g>
          </svg>

          {item.name ? <h4 className="item-price">{item.name}</h4> : null}

          <h6>
            <span>
              <Badge className="rarity-badge nft-blue-bg me-2">
                {item.itemsAvailable?.toString()} Items
              </Badge>{" "}
              <Badge className="rarity-badge nft-blue-bg me-2">
                {getMachineSize(Number(item.size))}
              </Badge>
            </span>
          </h6>
          <h6></h6>
          <h5 className="m-0 item-name">{item.price?.toString()} Tickets</h5>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MachineCard;
