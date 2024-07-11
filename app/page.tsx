import Image from "next/image";
import ChipScan from "../components/ChipScan.mjs";
import ChipScan1 from "../components/ChipScan1.mjs";
export default function Home() {
  return (
    <main
      style={{
        display: "inline-flex",
        flexDirection: "column",
      }}
    >
      <ChipScan></ChipScan>
      <ChipScan1></ChipScan1>
    </main>
  );
}
