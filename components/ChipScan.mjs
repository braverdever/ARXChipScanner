"use client";
import { execHaloCmdWeb } from "@arx-research/libhalo/api/web.js";
import { useEffect, useState } from "react";
import { Web3 } from "web3";
import SpheraVault from "../abi/SpheraVault.json";

const ChipScan = () => {
  const [blockNumber, setBlockNumber] = useState();
  const [sig, setSig] = useState("");
  const [address, setAddress] = useState("");
  const [tx, setTx] = useState("");
  const [contract, setContract] = useState();

  async function getRecentBlockHash(web3Instance) {
    const latestBlockNumber = await web3Instance.eth.getBlockNumber();
    setBlockNumber(latestBlockNumber);
    const block = await web3Instance.eth.getBlock(latestBlockNumber);
    return { latestBlockNumber, recentBlockHash: block.hash };
  }

  const connectWallet = () => {
    if (true || window.ethereum) {
      var web3Provider = new Web3.providers.HttpProvider(
        "https://ethereum-sepolia-rpc.publicnode.com"
      );
      const web3Instance = new Web3(web3Provider);
      // await web3Instance.currentProvider.request({
      //   method: "wallet_switchEthereumChain",
      //   params: [{ chainId: "0xaa36a7" }],
      // });
      // const accounts = await window.ethereum.request({
      //   method: "eth_requestAccounts",
      // });
      // setAddress(accounts[0]);
      const account = web3Instance.eth.accounts.wallet.add(
        "0x2e7dcddaa71bf5e7c56faa18777cb3f2ce7b5e1a9018b6083cdc9c57dceb1465"
      );
      setAddress(account[0].address);

      setContract(
        new web3Instance.eth.Contract(
          SpheraVault.abi,
          "0x60c780Cd8F62d8aC25c9C4F6032Cfbd8aD9f7990"
        )
      );
      return { web3Instance, address: account[0].address };
    } else {
      alert("Please install metamask.");
    }
  };

  const sendTransaction = async () => {
    try {
      const tx = await contract.methods
        .mintPBT(sig, blockNumber)
        .send({
          from: address,
        })
        .catch((err) => {
          alert(err);
        });
      if (tx != "undefined") {
        setTx(tx);
        console.log(tx);
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div style={{ display: "inline-grid", gap: "20px" }}>
      <button
        style={{
          // display: keys == "" ? "none" : "block",
          backgroundColor: sig == "" ? "red" : "green",
          padding: "20px",
          width: "200px",
        }}
        onClick={async () => {
          const { web3Instance, address } = connectWallet();
          console.log(web3Instance);
          const { latestBlockNumber, recentBlockHash } =
            await getRecentBlockHash(web3Instance);
          const encodedMsg = web3Instance.utils.encodePacked(
            { value: address, type: "address" },
            { value: recentBlockHash, type: "bytes" }
          );
          const messageHash = web3Instance.utils.keccak256(encodedMsg);

          const signer = web3Instance.eth.accounts.sign(
            messageHash,
            "0x865aba28f210f192e60bca223b3467e6a59f842da17f1ebfadb4787f611542d0"
            // "0x3e459b1e11ddc0163348197d72a0013a2c4624b9741974617dc50de00c64b2f9"
          );

          const msg = `
              Recent Block Number: ${latestBlockNumber}
              Recent Block Hash: ${recentBlockHash}
              Message Hash: ${messageHash}
              Wallet signature: ${signer.signature}
          `;

          console.log(msg);
          alert(msg);

          try {
            let sig;
            sig = await execHaloCmdWeb({
              name: "sign",
              digest: messageHash,
              keyNo: 1,
            });
            alert(JSON.stringify(sig));
            setSig(sig.signature.ether);
          } catch {}
        }}
      >
        Get Signature
      </button>
      <button
        style={{
          display: sig == "" ? "none" : "block",
          backgroundColor: tx == "" ? "red" : "green",
          padding: "20px",
        }}
        onClick={sendTransaction}
      >
        Send Transaction
      </button>
    </div>
  );
};

export default ChipScan;
