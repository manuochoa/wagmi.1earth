import React from "react";
import './styles.css';

const SaleInfoCard = (props) => {

    const {buyerName, buyerId, sellerName, sellerId, price, date} = props;

    return (
        <div className="sale-info-card">
            <div className="selling-info d-flex">
                <div className="buyer">
                    <h6 className="m-0">{buyerName} <span>({buyerId})</span></h6>
                </div>
                <div className="seller d-flex">
                    <h6 className="m-0 w-50">{sellerName} <br/><span>({sellerId})</span></h6>
                    <h6 className="m-0 w-50">{price} <br/><span>{date}</span></h6>
                </div>
            </div>
        </div>
    )
}

export default SaleInfoCard;
