"use client";
import { execHaloCmdWeb } from "@arx-research/libhalo/api/web.js";
import {
  haloConvertSignature,
  SECP256k1_ORDER,
} from "@arx-research/libhalo/api/common.js";
import { useState } from "react";
import Web3 from "web3";

const ChipScan1 = () => {
  const [keys, setKeys] = useState(null);

  return (
    <>
      <button
        style={{ marginTop: "50px" }}
        onClick={async () => {
          await setKeys(await execHaloCmdWeb({ name: "get_pkeys" }));
          setTimeout(() => alert(keys), 1000);
        }}
      >
        Click Me To Initiate Scan
      </button>
      <button
        style={{ marginTop: "50px" }}
        onClick={async () => {
          var web3Provider = new Web3.providers.HttpProvider(
            "https://ethereum-sepolia-rpc.publicnode.com"
          );
          const web3Instance = new Web3(web3Provider);

          const encodedMsg = web3Instance.utils.encodePacked(
            {
              value: "0x3aF1D724044df4841fED6F8C35438f0cE6f3C7b9",
              type: "address",
            },
            {
              value:
                "b4103351052a73be8e0681caad9b3c2c94f379a3c4b2770e3c0d4430b9090fce",
              type: "bytes32",
            }
          );

          let signRes = await execHaloCmdWeb({
            name: "sign",
            message: encodedMsg,
            keyNo: 1,
            legacySignCommand: true,
          });
          // let publicKey = keys.publicKeys[1];
          // let res = haloConvertSignature(
          //   signRes.input.digest,
          //   signRes.signature.der,
          //   publicKey,
          //   SECP256k1_ORDER
          // );
          // setSig(res.ether);
          // getSignatureFromScan({
          //   chipPublicKey: keys.primaryPublicKeyRaw,
          //   address: "0x3aF1D724044df4841fED6F8C35438f0cE6f3C7b9",
          //   hash: "0xb4103351052a73be8e0681caad9b3c2c94f379a3c4b2770e3c0d4430b9090fce",
          // }).then((sig) => {
          //   setSig(sig);
          // });
        }}
      >
        Click Me To Sign EOA+blockhash w/ Chip
      </button>
    </>
  );
};

export default ChipScan1;
