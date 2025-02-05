# Crowdfunding DApp

A decentralized crowdfunding application built with Solidity, Web3.js, and React. This DApp enables users to create crowdfunding projects, contribute to them, and manage fund withdrawals securely through smart contracts. The React frontend ensures a user-friendly experience.

---

## Technologies Used

- **Solidity** – Smart contract development
- **Hardhat** – Local blockchain development and testing
- **Web3.js** & **Ethers.js** – Blockchain interaction
- **React** – Frontend framework
- **Tailwind CSS** – Styling the frontend
- **MetaMask** – Wallet integration and transaction signing

---

## Features

### 1. Create a Fundraiser
Users can create a crowdfunding project by providing:
- **Title** – project name
- **Description** – Brief project overview
- **Target Contribution** – ETH amount needed
- **Minimum Contribution** – Minimum required donation
- **Deadline** – End date of the project

### 2. Contribute to a Fundraiser
- Users can contribute ETH to active projects.
- Contributions must meet or exceed the minimum amount set by the project creator.

### 3. View My Fundraisers
Users can view their projects categorized as active, expired, or successful. Each project displays:
- Title, description, target contribution, raised amount, deadline, and status.

### 4. View My Contributions
Users can track their contributions across different projects, including:
- project title, description, and contribution amount.

### 5. Withdraw Funds (For Creators)
- The creator can withdraw funds **only if** the project reaches its target contribution.

---

## Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MetaMask** (browser extension connected to a local/test network)
- **Git** (for cloning the repository)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/crowdfunding-dapp.git
cd crowdfunding-dapp
```

#### 2. Install Dependencies

##### Backend (Smart Contracts)
```bash
npm install
```

##### Frontend (React)
```bash
cd ../frontend
npm install
```

#### 3. Set Up Environment Variables
Create a `.env` file in the `hardhat` folder and add:
```plaintext
PRIVATE_KEY=your-private-key
```

#### 4. Start the backend
```bash
npx hardhat node
```

#### 5. Deploy the Smart Contract
```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
```
Copy the deployed contract address and update it in frontend pages.

#### 6. Run the Frontend
```bash
cd ../frontend
npm start
```
Open your browser and go to [http://localhost:3000](http://localhost:3000).

---

## How to Use

1. **Connect Your Wallet**
   - Click **"Connect Wallet"** to link MetaMask to the DApp.

2. **Create a Fundraiser**
   - Navigate to the **Dashboard** and fill in the required details.
   - Click **"Start Fundraiser"**.

3. **Contribute to a Fundraiser**
   - Select a project from the **Dashboard**.
   - Enter the contribution amount and confirm via MetaMask.

4. **Withdraw Funds (For Creators Only)**
   - Once the project reaches its target contribution, click **"Withdraw Funds"**.

---

## Future Improvements

1. **Withdrawal Requests (For Contributors)**
   - Contributors vote on withdrawal requests; the creator withdraws funds only if **50% approve**.


2. **Refund Mechanism**
   - Enable refunds if the project fails before the deadline.

---

## License
This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

## Project Members
- **Grasu Julia** – [@juliag03](https://github.com/juliag03)
- **Fota Stefania-Flavia** – [@flaviaf7](https://github.com/flaviaf7)

---
🚀 Happy Crowdfunding!

