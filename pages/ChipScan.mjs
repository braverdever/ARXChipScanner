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

  const getInfoToSign = async () => {
    var web3Provider = new Web3.providers.HttpProvider(
      "https://ethereum-sepolia-rpc.publicnode.com"
    );
    const web3Instance = new Web3(web3Provider);
    const account = web3Instance.eth.accounts.wallet.add(
      "0x2e7dcddaa71bf5e7c56faa18777cb3f2ce7b5e1a9018b6083cdc9c57dceb1465"
    );

    const latestBlockNumber = await web3Instance.eth.getBlockNumber();
    const block = await web3Instance.eth.getBlock(latestBlockNumber);

    setBlockNumber(latestBlockNumber);
    setAddress(account[0].address);
    setContract(
      new web3Instance.eth.Contract(
        SpheraVault.abi,
        "0x2c01F5aD8921cbaB605B8e09CCF981B4e31F59b4"
      )
    );

    return {
      addr: account[0].address,
      recentBlockHash: block.hash,
    };
  };

  const mintPBT = async () => {
    try {
      const tx = await contract.methods
        .mintPBT(sig, blockNumber)
        .send({
          from: address,
        })
        .catch((err) => {
          alert(err);
        });
      setTx(tx);
    } catch (error) {
      alert(error);
    }
  };

  const transferPBT = async () => {
    try {
      const tx = await contract.methods
        .transferTokenWithChip(sig, blockNumber)
        .send({
          from: address,
        })
        .catch((err) => {
          alert(err);
        });
      setTx(tx);
    } catch (error) {
      alert(error);
    }
  };

  const generateSignature = async (addr, blockHash) => {
    const messageHash = web3Instance.utils.keccak256(
      web3Instance.utils.encodePacked(
        { value: addr, type: "address" },
        { value: blockHash, type: "bytes" }
      )
    );
    const signature = (
      await execHaloCmdWeb({
        name: "sign",
        message: messageHash,
        keyNo: 1,
      })
    ).signature.ether;
    alert(signature);
    return signature;
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
          const { addr, recentBlockHash } = await getInfoToSign();
          alert(addr + recentBlockHash);
          setSig(await generateSignature(addr, recentBlockHash));
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
        onClick={mintPBT}
      >
        Mint PBT
      </button>
      Address:
      <input id="addr" style={{ width: "300px", color: "black" }}></input>
      <button
        style={{
          display: sig == "" ? "none" : "block",
          backgroundColor: "red",
          padding: "20px",
        }}
        onClick={transferPBT}
      >
        Transfer PBT
      </button>
    </div>
  );
};

export default ChipScan;
