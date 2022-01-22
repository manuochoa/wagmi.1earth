import React from "react";

function RenderMachinePreview() {
  const item = machines[activeMachine];

  //   const getNfts = async () => {
  //     let result = await getMachineNfts(item.machineId);
  //     if (result) {
  //       console.log(result);
  //     }
  //   };

  //   useEffect(() => {
  //     getNfts();
  //   }, [item?.machineId]);

  return <div></div>;
  // <div className="bundle-section">
  //   <SectionHeader
  //     isPreview={true}
  //     onClickBack={() => setIsPreviewMachine(false)}
  //   />
  //   <div className="item-preview">
  //     <Row>
  //       <Col xs={12}>
  //         {/* <h1 className="mt-4 item-name">Bundle #4454566</h1> */}
  //         <div className="item-price d-flex align-items-center">
  //           <h1 className="me-5">{item.price.toString()} Tickets</h1>
  //           <a
  //             href={`https://push-me-out-game.vercel.app/index.html?machine=${item.machineId}`}
  //             target="_blank"
  //             rel="noopener noreferrer"
  //           >
  //             <Button
  //               disabled={isLoading}
  //               // onClick={
  //               //   userAddress
  //               //     ? () => handleBuy(item, "bundle")
  //               //     : connectWallet()
  //               // }
  //               className="nft-buy-button"
  //             >
  //               Play
  //             </Button>
  //           </a>
  //         </div>
  //       </Col>
  //       <Col xs={6}>
  //         <div className="info p-4 d-flex flex-column mt-5">
  //           <h3 className="mb-4">Machine Details (Id: {item.machineId})</h3>
  //           <div className="bundle-items">
  //             <Row>
  //               {/* {item.items.map((el, index) => {
  //                   return (
  //                     <Col key={index} xs={6}>
  //                       <div className="bundle-item d-flex align-items-center mt-1 mb-1">
  //                         <div className="bundle-image">
  //                           <img
  //                             className="img-fluid"
  //                             src={el.metadata.image}
  //                             alt=""
  //                           />
  //                         </div>
  //                         <div className="bundle-info ms-4">
  //                           <h6>{el.metadata.name}</h6>
  //                           <div>
  //                             <Badge className="rarity-badge nft-blue-bg me-2">
  //                               {getMachineSize(Number(el.giftPrice))}
  //                             </Badge>
  //                             <img
  //                               className="img-fluid"
  //                               src={
  //                                 el.metadata.attributes[0].value === "music"
  //                                   ? musicGray
  //                                   : el.metadata.attributes[0].value ===
  //                                     "video"
  //                                   ? playGray
  //                                   : el.metadata.attributes[0].value ===
  //                                     "image"
  //                                   ? imageGray
  //                                   : ""
  //                               }
  //                               alt=""
  //                             />
  //                             {el.metadata.attributes[0].value}
  //                             <Badge
  //                               className={
  //                                 el.metadata.attributes[1].value === "Common"
  //                                   ? "rarity-badge"
  //                                   : el.metadata.attributes[1].value ===
  //                                     "Rare"
  //                                   ? "rarity-badge nft-green-bg"
  //                                   : el.metadata.attributes[1].value ===
  //                                     "Epic"
  //                                   ? "rarity-badge nft-purple-bg"
  //                                   : el.metadata.attributes[1].value ===
  //                                     "Mytic"
  //                                   ? "rarity-badge nft-yellow-bg"
  //                                   : "rarity-badge"
  //                               }
  //                             >
  //                               {el.metadata.attributes[1].value}
  //                             </Badge>
  //                           </div>
  //                         </div>
  //                       </div>
  //                     </Col>
  //                   );
  //                 })} */}
  //             </Row>
  //           </div>
  //         </div>
  //       </Col>
  //       <Col xs={6}>
  //         <div className="info p-4 d-flex flex-column mt-5">
  //           <h3 className="mb-2">About</h3>
  //           <div className="about-bundle mt-3">
  //             <h6>Items Available</h6>
  //             <div className="items d-flex align-items-center">
  //               <h6 className="m-0 me-3">
  //                 {item.itemsAvailable.toString()} Items
  //               </h6>
  //             </div>
  //             <div className="owner-detail mt-2">
  //               <h4>Machine Size</h4>
  //               <Badge className="rarity-badge nft-blue-bg me-2">
  //                 {item.size.toString() === "4"
  //                   ? "XXL"
  //                   : item.size.toString() === "3"
  //                   ? "XL"
  //                   : item.size.toString() === "2"
  //                   ? "L"
  //                   : item.size.toString() === "1"
  //                   ? "M"
  //                   : "S"}
  //               </Badge>
  //             </div>
  //             <div className="owner-detail mt-3">
  //               <h4>Owner</h4>

  //               <h6 className="id">{item.owner}</h6>
  //             </div>
  //             <div className="owner-detail mt-3">
  //               <h4>Status</h4>

  //               <h6 className="id">
  //                 {Number(item.lockedtime) * 1000 < Date.now()
  //                   ? "In Use"
  //                   : "Available"}
  //               </h6>
  //             </div>
  //           </div>
  //         </div>
  //       </Col>
  //     </Row>
  //   </div>
  // </div>
}

export default RenderMachinePreview;
