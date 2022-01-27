import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Account from "./routes/account";
import { getUserBalances, getMarketNFTs } from "./blockchain/functions";

function Home() {
  const [userAddress, setUserAddress] = useState("");
  const [userBalances, setUserBalances] = useState([]);
  const [items, setItems] = useState([]);

  const connectWallet = async () => {
    console.log("hola");
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setUserAddress(accounts[0]);

      window.localStorage.setItem("userAddress", accounts[0]);

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      if (chainId !== "0xa869") {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xa869" }],
        });
      }

      window.ethereum.on("accountsChanged", function (accounts) {
        setUserAddress(accounts[0]);
      });

      window.ethereum.on("chainChanged", (_chainId) =>
        window.location.reload()
      );
    } catch (error) {
      console.log(error);
    }
  };

  const checkConnection = () => {
    let user = window.localStorage.getItem("userAddress");
    if (user) {
      connectWallet();
    }
  };

  const loadUserBalances = async () => {
    if (userAddress !== "") {
      let balances = await getUserBalances(userAddress);
      if (balances) {
        setUserBalances(balances);
      }
    }
  };

  const getItems = async () => {
    let result = await getMarketNFTs();
    if (result) {
      setItems(result);
    }
  };

  useEffect(() => {
    checkConnection();
    getItems();
  }, []);

  useEffect(() => {
    loadUserBalances();
  }, [userAddress]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/marketplace"
          element={
            <App
              userAddress={userAddress}
              setUserAddress={setUserAddress}
              connectWallet={connectWallet}
              userBalances={userBalances}
              items={items}
              getItems={getItems}
            />
          }
        />
        <Route
          path="/"
          element={
            <Account
              userAddress={userAddress}
              setUserAddress={setUserAddress}
              connectWallet={connectWallet}
              userBalances={userBalances}
              loadUserBalances={loadUserBalances}
              marketItems={items}
              getItems={getItems}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Home;
