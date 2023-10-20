"use client";
import { RecruitNFTAbi, tokenContractAddress } from "@/config/token-contract";
import { useWalletContext } from "@/context/wallet";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Hash, encodeFunctionData } from "viem";

const RECRUIT_TOKEN_IMG_SRC =
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

  const handleMint = useCallback(async () => {
    if (!provider) {
      throw new Error("Provider not initialized");
    }
    setMintTxHash(undefined);
    setMintStatus("Requesting");
    const uoHash = await provider.sendUserOperation({
      target: tokenContractAddress,
      data: encodeFunctionData({
        abi: RecruitNFTAbi,
        functionName: "mint",
        args: [],
      }),
    });

    setMintStatus("Minting");
    let txHash: Hash;
    try {
      txHash = await provider.waitForUserOperationTransaction(uoHash.hash);
    } catch (e) {
      console.log(e);
      setMintStatus("Error Minting");
      return;
    }

    setMintTxHash(txHash);
    setMintStatus("Received");
    setTimeout(() => {
      setMintStatus("Mint");
    }, 5000);
  }, [provider, setMintTxHash]);

  return (
    <div className="flex flex-row items-center gap-[64px] max-md:flex-col max-md:text-center">
      <Image
        src={RECRUIT_TOKEN_IMG_SRC}
        alt="RECRUIT Token"
        width={400}
        height={400}
        priority
      />
      <div className="flex flex-col items-start gap-[48px] max-md:items-center">
        <div className="flex flex-col flex-wrap gap-[12px]">
          <div className="flex flex-row max-md:justify-center">
            <a
              href="https://accountkit.alchemy.com"
              target="_blank"
              className="btn bg-black dark:bg-white text-white dark:text-black transition ease-in-out duration-500 transform hover:scale-110 hover:bg-black hover:dark:bg-white"
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
          <div className="text-5xl font-bold">RecruitNFT</div>
        </div>
        <div className="text-2xl">Mint a FREE ERC-20 NFT!</div>
        <div className="flex flex-row flex-wrap gap-[12px]">
          <button
            disabled={!isLoggedIn || mintStatus !== "Mint"}
            onClick={handleMint}
            className="btn text-white bg-gradient-1 disabled:opacity-25 disabled:text-white transition ease-in-out duration-500 transform hover:scale-110 max-md:w-full"
          >
            {mintStatus} RECRUIT
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
      </div>
    </div>
  );
}
