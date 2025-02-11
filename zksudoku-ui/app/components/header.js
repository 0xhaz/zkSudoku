import Link from "next/link";
import dynamic from "next/dynamic";
import ConnectWalletBtn from "../components/ConnectWalletBtn";

// const ConnectWalletBtn = dynamic(
//   () => import("../components/ConnectWalletBtn"),
//   {
//     ssr: false,
//   }
// );

const Header = () => {
  return (
    <header className="flex flex-wrap justify-between p-5 mb-5">
      <Link href="/">
        <span className="text-xl md:mb-auto mb-5 font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-emerald-500">
          zkSudoku
        </span>
      </Link>
      <div className="flex justify-center items-center">
        <ConnectWalletBtn />
      </div>
    </header>
  );
};

export default Header;
