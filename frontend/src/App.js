import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails"; // Assuming ProjectDetails exists
import Contribution from "./pages/Contribution";
import Fundraising from "./pages/Fundraising";

import { ethers } from "ethers"; // Make sure ethers is imported

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize Web3 provider and MetaMask connection
  const initWeb3 = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      let userAddress = accounts.length > 0 ? accounts[0] : null;

      if (!userAddress) {
        const requestedAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        userAddress = requestedAccounts[0];
      }

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);
      const web3Signer = await web3Provider.getSigner();
      setSigner(web3Signer);

      userAddress = await web3Signer.getAddress();
      setAccount(userAddress);

      const userBalance = await web3Provider.getBalance(userAddress);
      setBalance(ethers.formatEther(userBalance));

      console.log("Connected to MetaMask:", userAddress);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert("Connection to MetaMask failed.");
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle account changes in MetaMask
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          initWeb3(); // Reinitialize for the new account
        } else {
          setAccount(null);
          setProvider(null);
          setSigner(null);
          setBalance("0");
        }
      });
    }
  }, []);

  return (
    <Router>
      <div className="flex h-screen">
        {/* Connect Wallet Button */}
        {!account ? (
           <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
           {/* Heading */}
           <h1 className="text-3xl font-bold text-gray-800 mb-4">
             Connect Your Wallet
           </h1>
       
           {/* Error Message */}
           {error && (
             <p className="text-red-500 bg-red-50 px-4 py-2 rounded-lg mb-4">
               {error}
             </p>
           )}
       
           {/* Connect Button */}
           <button
             onClick={initWeb3}
             disabled={loading}
             className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
               loading
                 ? "bg-gray-400 cursor-not-allowed"
                 : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
             }`}
           >
             {loading ? (
               <>
                 {/* Loading Spinner */}
                 <svg
                   className="animate-spin h-5 w-5 mr-3 text-white"
                   xmlns="http://www.w3.org/2000/svg"
                   fill="none"
                   viewBox="0 0 24 24"
                 >
                   <circle
                     className="opacity-25"
                     cx="12"
                     cy="12"
                     r="10"
                     stroke="currentColor"
                     strokeWidth="4"
                   ></circle>
                   <path
                     className="opacity-75"
                     fill="currentColor"
                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                   ></path>
                 </svg>
                 Connecting...
               </>
             ) : (
               "Connect with MetaMask"
             )}
           </button>
         </div>
        ) : (
          <>
            {/* Sidebar */}
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              setIsCollapsed={setIsSidebarCollapsed}
              account={account} // Pass account to Sidebar
              balance={balance} // Pass balance to Sidebar
            />
            {/* Main Content Area */}
            <div
              className={`flex-1 transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? "ml-20" : "ml-64"
              }`}
            >
              {/* Routes */}
              <Routes>
                <Route path="/" element={<Dashboard 
                provider={provider}/>} />
                <Route path="/project-details/:projectAddress" element={<ProjectDetails provider={provider}/>} />
                <Route path="/contribution" element={<Contribution
                provider={provider} />} />
                <Route path="/fundraising" element={<Fundraising  provider={provider}/>} />
                <Route path="*" element={<h1>Not Found</h1>} />
               
              </Routes>
            </div>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
