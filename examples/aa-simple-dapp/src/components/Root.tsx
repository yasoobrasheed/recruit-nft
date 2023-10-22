import Hero from "./Hero";
import Navbar from "./Navbar";
import WalletDisplay from "./WalletDisplay";

export default function Root() {
  return (
    <div className="flex flex-col text-black dark:text-white items-center justify-between p-[20px] gap-[20px]">
      <Navbar />
      <Hero />
      <WalletDisplay />
    </div>
  );
}
