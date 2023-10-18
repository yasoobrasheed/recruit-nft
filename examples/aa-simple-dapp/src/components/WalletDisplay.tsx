"use client";
import { useState } from "react";

const Loader = () => {
  return (
    <div className="flex flex-1 flex-col justify-center items-center min-h-screen">
      <span className="loading loading-spinner loading-lg"></span>
      <h1 className="font-mono mt-5 animate-text font-black">
        Fetching your NFTs
      </h1>
    </div>
  );
};

export default function WalletDisplay() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="mt-14 md:mt-32 md:mb-16 mx-20">
      <div className="mb-6 font-mono text-3xl font-bold">Your Wallet</div>
      {isLoading ? (
        <div className="flex items-center justify-center mt-[-320px] mb-16 md:mt-[-350px] md:mb-0">
          <Loader />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
