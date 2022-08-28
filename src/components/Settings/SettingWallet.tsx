import React from "react";
import { useAppSelector } from "../../app/hooks";

const SettingWallet = () => {
  const wallets = useAppSelector((state) => state.walletState.wallets);
  return (
    <div>
      <ul>
        {wallets.map((wallet) => (
          <li key={wallet.id}>{wallet.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SettingWallet;
