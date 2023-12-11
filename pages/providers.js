import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { sepolia, mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

export const chains = [mainnet, sepolia];
const { publicClient } = configureChains(chains, [publicProvider()]);

const { connectors } = getDefaultWallets({

  projectId: '40475ffd1b8b425f921bff712d680c8b',
  appName: 'ENS App',
  chains,
});
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
