import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import {
  createInitializeMetadataPointerInstruction,
  createInitializeMint2Instruction,
  createInitializeMintInstruction,
  ExtensionType,
  getMinimumBalanceForRentExemptMint,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";

function LaunchPad() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const [connected, setConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setConnected(wallet.connected);
  }, [wallet]);

  const createToken = async () => {
    const keypair = Keypair.generate();

    const metadata = {
      mint: keypair.publicKey,
      name: "Token x",
      symbol: "Token x",
      uri: "https://cdn.100xdevs.com/metadata.json",
      additionalMetadata: [],
    };

    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataLen
    );

    const transaction = new Transaction().add(

      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey!,
        newAccountPubkey: keypair.publicKey,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),

      createInitializeMetadataPointerInstruction(keypair.publicKey,wallet.publicKey,keypair.publicKey,TOKEN_2022_PROGRAM_ID),

      createInitializeMintInstruction(keypair.publicKey,9,wallet.publicKey!,null,TOKEN_2022_PROGRAM_ID),

      createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        mint: keypair.publicKey,
        metadata: keypair.publicKey,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
        mintAuthority: wallet.publicKey!,
        updateAuthority: wallet.publicKey!,
      })
    );

    transaction.feePayer = wallet.publicKey!;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    transaction.partialSign(keypair);

    const transactionn = await wallet.sendTransaction(transaction, connection);
    
    console.log(transactionn);
    console.log(`Token mint created at ${keypair.publicKey.toBase58()}`);
    window.alert(
      JSON.stringify({ transactionid: transactionn, mint: keypair.publicKey })
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-gray-300">
      <header className="bg-black border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-gray-200">
              🚀 Token Launchpad
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <WalletMultiButton />
            {connected && <WalletDisconnectButton />}
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-black to-gray-950">
        <div className="w-full max-w-xl">
          <div className="bg-black rounded-xl shadow-2xl border border-gray-800 overflow-hidden transition-all duration-300 hover:border-gray-700">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Solana Token Launchpad 🚀
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Create your custom token on Solana blockchain
              </p>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-1.5">
                  Name
                  <span className="text-xs text-gray-500">(required)</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter token name"
                  className="w-full px-4 py-2.5 bg-black border border-gray-800 rounded-lg 
                  focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700 
                  text-gray-300 placeholder-gray-600 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-1.5">
                  Symbol
                  <span className="text-xs text-gray-500">(required)</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter token symbol"
                  className="w-full px-4 py-2.5 bg-black border border-gray-800 rounded-lg 
                  focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700 
                  text-gray-300 placeholder-gray-600 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Image URL
                </label>
                <input
                  type="text"
                  placeholder="Enter image URL"
                  className="w-full px-4 py-2.5 bg-black border border-gray-800 rounded-lg 
                  focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700 
                  text-gray-300 placeholder-gray-600 transition-all duration-200"
                />
                <p className="text-xs text-gray-600">
                  Optional: Add an image for your token
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-1.5">
                  Initial Supply
                  <span className="text-xs text-gray-500">(required)</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter initial supply"
                  className="w-full px-4 py-2.5 bg-black border border-gray-800 rounded-lg 
                  focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700 
                  text-gray-300 placeholder-gray-600 transition-all duration-200"
                />
              </div>

              <div className="pt-4">
                <button
                  className="w-full px-4 py-3 bg-[#3c1c9a] hover:bg-[#3c1c9a]/75
                  text-white font-medium rounded-lg transition-all duration-200 
                  focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-1 focus:ring-offset-black
                  border border-gray-700"
                  onClick={createToken}
                  disabled={loading}
                >
                  {loading ? "loading..." : "Create Token"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LaunchPad;
