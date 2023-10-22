"use client";
import { alcommunityAbi, tokenContractAddress } from "@/config/token-contract";
import { useWalletContext } from "@/context/wallet";
import Image from "next/image";
import { useState } from "react";
import { Hash, encodeFunctionData } from "viem";

const ALCOMMUNITY_TOKEN_IMG_SRC =
  "https://recruitnft.s3.us-east-2.amazonaws.com/assets/token.jpg";

type MintStatus =
  | "Mint"
  | "Requesting"
  | "Minting"
  | "Received"
  | "Error Minting";

export default function Hero() {
  const { isLoggedIn, provider } = useWalletContext();
  const [mintTxHash, setMintTxHash] = useState<Hash>();
  const [mintStatus, setMintStatus] = useState<MintStatus>("Mint");

  const handleMint = async () => {
    if (!provider) {
      throw new Error("Provider not initialized");
    }
    setMintStatus("Requesting");

    let uoHash: any;
    try {
      uoHash = await provider.sendUserOperation({
        target: tokenContractAddress,
        data: encodeFunctionData({
          abi: alcommunityAbi,
          functionName: "mint",
          args: [],
        }),
      });
    } catch (e) {
      console.log(e);
      setMintStatus("Error Minting");
      return;
    }

    setMintStatus("Minting");
    let txHash: Hash;
    try {
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
      <div className="flex flex-row flex-wrap gap-[20px]">
        <button
          disabled={!isLoggedIn || mintStatus !== "Mint"}
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
