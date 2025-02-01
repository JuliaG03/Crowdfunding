import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails"; // Assuming ProjectDetails exists
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

  // Render the button to connect wallet or main content based on account
  return (
    <Router>
      <div className="flex h-screen">
        {/* Connect Wallet Button */}
        {!account ? (
          <div className="flex items-center justify-center flex-col mt-20">
            <h1>Connect Your Wallet</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={initWeb3} disabled={loading}>
              {loading ? 'Connecting...' : 'Connect with MetaMask'}
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
                <Route path="/project-details/:id" element={<ProjectDetails />} />
              </Routes>
            </div>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
