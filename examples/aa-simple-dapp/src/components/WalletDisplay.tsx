"use client";
import { useWalletContext } from "@/context/wallet";
import { useState } from "react";

interface Nft {
  contract: object;
  tokenId: string;
  tokenType: string;
  title: string;
  description: string;
  media: object;
}

interface Data {
  ownedNfts: Nft[];
  length: number;
}

export default function WalletDisplay() {
  const { isLoggedIn } = useWalletContext();
  const [isLoading, setIsLoading] = useState(true);
  const [ownedNftsArray, setOwnedNftsArray] = useState<Data | null>(null);

  const { scaAddress } = useWalletContext();

  async function fetchUserNfts() {
    setIsLoading(true);
    try {
      const data = { address: scaAddress || "" };
      const response = await fetch("/api/get-user-nfts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const messageResponse = await response.json();
      console.log(messageResponse.data.ownedNfts);
      setOwnedNftsArray(messageResponse.data.ownedNfts);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  }

  return (
    <div className="mt-14 md:mt-32 md:mb-16 mx-20">
      {isLoading ? (
        <button
          className="btn text-white bg-gradient-3 disabled:opacity-25 disabled:text-white transition ease-in-out duration-500 transform hover:scale-110 max-md:w-full"
          onClick={fetchUserNfts}
          disabled={!isLoggedIn}
        >
          LOAD NFTs
        </button>
      ) : (
        <NFTDisplay ownedNftsArray={ownedNftsArray} />
      )}
    </div>
  );
}

interface NFTDisplayProps {
  ownedNftsArray: Data | null;
}

const NFTDisplay: React.FC<NFTDisplayProps> = (props: NFTDisplayProps) => {
  return (
    <div className="mb-16 md:mt-[-120px]">
      <div className="mb-6 text-3xl font-bold">Your Wallet</div>
      <div className="flex flex-col justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-y-12 mb-6 mx-0">
          {props.ownedNftsArray &&
            Array.isArray(props.ownedNftsArray) &&
            props.ownedNftsArray.map((nft, index) => (
              <div
                key={index}
                className="rounded-lg shadow-xl max-w-[250px] max-h-[600px] overflow-hidden"
              >
                <figure>
                  <img
                    src={nft.rawMetadata.image}
                    alt="user nft imagee"
                    className="w-full max d-h-[300px]"
                  />
                </figure>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
