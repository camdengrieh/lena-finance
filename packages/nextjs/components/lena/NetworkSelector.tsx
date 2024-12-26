import { FC } from "react";

interface NetworkSelectorProps {
  selectedNetwork: string;
  networks: string[];
  onChange: (network: string) => void;
}

export const NetworkSelector: FC<NetworkSelectorProps> = ({ selectedNetwork, networks, onChange }) => {
  return (
    <select value={selectedNetwork} onChange={e => onChange(e.target.value)} className="px-4 py-2 rounded bg-base-200">
      {networks.map(network => (
        <option key={network} value={network}>
          {network.charAt(0).toUpperCase() + network.slice(1)}
        </option>
      ))}
    </select>
  );
};
