"use client";
import { alcommunityAbi, tokenContractAddress } from "@/config/token-contract";
import { useWalletContext } from "@/context/wallet";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Hash, encodeFunctionData } from "viem";

const ALCOMMUNITY_TOKEN_IMG_SRC =
  "https://recruitnft.s3.us-east-2.amazonaws.com/assets/token.jpg";

type MintStatus =
  | "Mint"
  | "Requesting"
  | "Minting"
  | "Received"
  | "Error Minting"
  | "Minted";

export default function Hero() {
  const { isLoggedIn, provider, scaAddress } = useWalletContext();
  const [mintTxHash, setMintTxHash] = useState<Hash>();
  const [mintStatus, setMintStatus] = useState<MintStatus>("Mint");
  const [linkedInUrlInputValue, setLinkedInUrlInputValue] =
    useState<string>("");

  const handleLinkedInUrlInputValueChanged = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setLinkedInUrlInputValue(event.target.value);
  };

  const triggerSlackWebhook = async () => {
    try {
      const data = {
        address: scaAddress || "",
        linkedIn: linkedInUrlInputValue,
      };
      const response = await fetch("/api/trigger-slack-webhook/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const messageResponse = await response.json();
      console.log(messageResponse);
    } catch (error) {
      console.error("Error sending Slack notification:", error);
    }
  };

  const handleMint = async () => {
    if (!provider) {
      throw new Error("Provider not initialized");
    }

    setMintStatus("Minting");

    let uoHash: any;
    try {
      uoHash = await provider
        .sendUserOperation({
          target: tokenContractAddress,
          data: encodeFunctionData({
            abi: alcommunityAbi,
            functionName: "mint",
            args: [],
          }),
        })
        .then(() => {
          triggerSlackWebhook();
        });
    } catch (e) {
      console.log(e);
      setMintStatus("Error Minting");
      return;
    }

    let txHash: Hash;
    try {
      setTimeout(() => {
        setMintStatus("Minted");
      }, 15000);
      txHash = await provider.waitForUserOperationTransaction(uoHash.hash);
    } catch (e) {
      console.log(e);
      return;
    }

    setMintTxHash(txHash);
    setMintStatus("Received");
  };

  return (
    <div className="flex flex-col items-center gap-[20px] max-md:flex-col max-md:text-center">
      <Image
        src={ALCOMMUNITY_TOKEN_IMG_SRC}
        alt="alcommunity Token"
        width={400}
        height={400}
        priority
      />
      <input
        type="text"
        id="myInput"
        name="myInput"
        placeholder="LinkedIn Profile"
        style={{
          width: "100%",
          padding: "10px",
          margin: "5px 0",
          border: "1px solid #ccc",
          borderRadius: "4px",
          boxSizing: "border-box",
          fontSize: "14px",
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
        value={linkedInUrlInputValue}
        onChange={handleLinkedInUrlInputValueChanged}
      />
      <div className="flex flex-row flex-wrap gap-[20px]">
        <button
          disabled={
            !isLoggedIn || mintStatus !== "Mint" || !linkedInUrlInputValue
          }
          onClick={handleMint}
          className="btn text-white bg-gradient-3 disabled:opacity-25 disabled:text-white transition ease-in-out duration-500 transform hover:scale-110 max-md:w-full"
        >
          {mintStatus}
          {(mintStatus === "Requesting" || mintStatus === "Minting") && (
            <span className="loading loading-spinner loading-md"></span>
          )}
        </button>
        {mintTxHash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${mintTxHash}`}
            className="btn text-white bg-gradient-2 disabled:opacity-25 disabled:text-white transition ease-in-out duration-500 transform hover:scale-110 max-md:w-full"
          >
            Your Txn Details
          </a>
        )}
      </div>
      <div className="flex flex-col items-start gap-[20px] max-md:items-center">
        <div className="flex flex-col flex-wrap gap-[20px]">
          <div className="flex flex-row max-md:justify-center">
            <a
              href="https://accountkit.alchemy.com"
              target="_blank"
              className="btn bg-white dark:bg-black text-black dark:text-white transition ease-in-out duration-500 transform hover:scale-110 hover:bg-white hover:dark:bg-black"
            >
              <Image
                src="/kit-logo.svg"
                alt="Account Kit Logo"
                width={28}
                height={28}
                priority
              />
              <div className="text-md">Powered By Account Kit</div>
            </a>
          </div>
          <br />
          <div className="text-3xl font-bold">Mint your alcommunity NFT</div>
        </div>
        <div className="text-l">
          Mint your memory of your time at Alchemy and unlock access to
          exclusive events and much more!
        </div>
      </div>
    </div>
  );
}
