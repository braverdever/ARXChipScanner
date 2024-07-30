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
      "https://testnet.hashio.io/api"
    );
    const web3Instance = new Web3(web3Provider);
    const account = web3Instance.eth.accounts.wallet.add(process.env);

    const latestBlockNumber = await web3Instance.eth.getBlockNumber();
    const block = await web3Instance.eth.getBlock(latestBlockNumber);

    console.log(`Block No: ${latestBlockNumber}`);
    setBlockNumber(latestBlockNumber);
    setAddress(account[0].address);
    setContract(
      new web3Instance.eth.Contract(
        SpheraVault.abi,
        "0x2c01F5aD8921cbaB605B8e09CCF981B4e31F59b4"
      )
    );

    return {
      web3Instance,
      addr: account[0].address,
      recentBlockHash: block.hash,
    };
  };

  const generateMessageHash = (web3Instance, addr, blockHash) => {
    const messageHash = web3Instance.utils.keccak256(
      web3Instance.utils.encodePacked(
        { value: addr, type: "address" },
        { value: blockHash, type: "bytes" }
      )
    );
    return messageHash;
  };

  const mintPBT = async () => {
    console.log(sig, blockNumber);
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

  const imitateSignature = (web3Instance, messageHash) => {
    const signer = web3Instance.eth.accounts.sign(messageHash, process.env);
    console.log(`Signature: ${signer.signature}`);
    return signer.signature;
  };

  const generateSignature = async (messageHash) => {
    const signature = (
      await execHaloCmdWeb({
        name: "sign",
        digest: messageHash,
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
          const { web3Instance, addr, recentBlockHash } = await getInfoToSign();
          console.log(`Address: ${addr}`);
          console.log(`BlockHash: ${recentBlockHash}`);
          // setSig(await generateSignature(web3Instance, addr, recentBlockHash));
          const messageHash = generateMessageHash(
            web3Instance,
            addr,
            recentBlockHash
          );
          console.log(`Message Hash: ${messageHash}`);
          setSig(await imitateSignature(web3Instance, messageHash));
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
