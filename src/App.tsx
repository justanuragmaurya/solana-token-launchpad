import './App.css'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import {WalletModalProvider} from '@solana/wallet-adapter-react-ui'
import LaunchPad from './components/launchpad';

import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
    return (
      <ConnectionProvider endpoint={import.meta.env.VITE_PUBLIC_RPC_URL}>
          <WalletProvider wallets={[]} autoConnect>
              <WalletModalProvider>
                  <LaunchPad/>
              </WalletModalProvider>
          </WalletProvider>
      </ConnectionProvider>
  );
}

export default App