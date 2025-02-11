"use client";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
} from "wagmi";
import networks from "../../utils/networks.json";

import { switchNetwork } from "../../utils/switchNetwork";

const ConnectWalletBtn = () => {
  const { address } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: dataAccount } = useAccount();
  const { switchChain } = useSwitchChain;

  const chainId = useChainId();
  const selectedNetwork = networks[chainId] || {};
  const selectedChainName = selectedNetwork.chainName || "Unknown Network";

  const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;
  const truncateEthAddress = address => {
    const match = address.match(truncateRegex);
    if (!match) return address;
    return `${match[1]}...${match[2]}`;
  };

  if (!dataAccount?.address) {
    return (
      <button
        className="text-lg font-medium rounded-md px-5 py-3 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500"
        onClick={() => {
          connect(connectors.Injected);
        }}
      >
        <span>Connect Wallet</span>
      </button>
    );
  } else if (dataAccount?.address) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-300">
            {truncateEthAddress(dataAccount.address)}
          </span>
          <span
            className="text-xs font-medium text-slate-300"
            onClick={() => {
              disconnect();
            }}
          >
            Disconnect
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-300">
            {selectedChainName}
          </span>
          <span
            className="text-xs font-medium text-slate-300"
            onClick={() => {
              switchNetwork();
            }}
          >
            Switch Network
          </span>
        </div>
      </div>
    );
  }
};

export default ConnectWalletBtn;
