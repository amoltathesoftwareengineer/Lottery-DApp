
import { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "";
const ABI = [
  "function enter() external payable",
  "function owner() view returns (address)",
  "function participantCount() view returns (uint256)",
  "function lotteryOpen() view returns (bool)",
  "function winner() view returns (address)",
  "function closeLottery() external",
  "function selectWinner(uint256 index) external"
];

export default function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [count, setCount] = useState("0");
  const [winner, setWinner] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [status, setStatus] = useState("Connect MetaMask to begin.");
  const [busy, setBusy] = useState(false);

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask.");
      }
      if (!ethers.isAddress(CONTRACT_ADDRESS)) {
        throw new Error("Contract address is not configured yet.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const lottery = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      setAccount(address);
      setContract(lottery);
      await refresh(lottery);
      setStatus("Wallet connected successfully.");
    } catch (error) {
      setStatus(error.shortMessage || error.message);
    }
  }

  async function refresh(lottery = contract) {
    if (!lottery) return;

    try {
      const [total, currentWinner, open] = await Promise.all([
        lottery.participantCount(),
        lottery.winner(),
        lottery.lotteryOpen()
      ]);

      setCount(total.toString());
      setWinner(
        currentWinner === ethers.ZeroAddress ? "" : currentWinner
      );
      setIsOpen(open);
    } catch (error) {
      setStatus(error.shortMessage || error.message);
    }
  }

  async function enterLottery() {
    if (!contract || busy) return;

    setBusy(true);
    try {
      setStatus("Confirm the entry transaction in MetaMask...");
      const tx = await contract.enter({
        value: ethers.parseEther("0.01")
      });
      await tx.wait();
      await refresh();
      setStatus("Entry confirmed successfully.");
    } catch (error) {
      setStatus(error.shortMessage || error.message);
    } finally {
      setBusy(false);
    }
  }

  async function closeLottery() {
    if (!contract || busy) return;

    setBusy(true);
    try {
      setStatus("Confirm the transaction in MetaMask...");
      const tx = await contract.closeLottery();
      await tx.wait();
      await refresh();
      setStatus("Lottery closed.");
    } catch (error) {
      setStatus(error.shortMessage || error.message);
    } finally {
      setBusy(false);
    }
  }

  async function selectWinner() {
    if (!contract || busy || Number(count) === 0) return;

    setBusy(true);
    try {
      setStatus("Confirm winner selection in MetaMask...");
      const randomIndex = Math.floor(Math.random() * Number(count));
      const tx = await contract.selectWinner(randomIndex);
      await tx.wait();
      await refresh();
      setStatus("Winner selected. This demo does not use secure randomness.");
    } catch (error) {
      setStatus(error.shortMessage || error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page">
      <nav className="navbar">
        <div className="brand">🎰 Lottery<span>DApp</span></div>
        <button className="connect-btn" onClick={connectWallet} disabled={busy}>
          {account
            ? `${account.slice(0, 6)}...${account.slice(-4)}`
            : "Connect MetaMask"}
        </button>
      </nav>

      <section className="hero">
        <div className="eyebrow">ETHEREUM · SMART CONTRACT DEMO</div>
        <h1>One entry.<br /><span>One chance to win.</span></h1>
        <p>
          Explore transparent, blockchain-based lottery interactions
          on a local Ethereum development network.
        </p>
        <div className="actions">
          <button
            className="primary-btn"
            onClick={enterLottery}
            disabled={!contract || busy || !isOpen}
          >
            Enter with 0.01 ETH
          </button>
          <button
            className="secondary-btn"
            onClick={() => refresh()}
            disabled={!contract || busy}
          >
            Refresh status
          </button>
        </div>
      </section>

      <section className="stats">
        <article className="stat-card">
          <span>Participants</span>
          <strong>{count}</strong>
          <small>Unique wallet addresses</small>
        </article>
        <article className="stat-card">
          <span>Lottery status</span>
          <strong className={isOpen ? "open" : "closed"}>
            {isOpen ? "Open" : "Closed"}
          </strong>
          <small>Read from the smart contract</small>
        </article>
        <article className="stat-card">
          <span>Entry amount</span>
          <strong>0.01 ETH</strong>
          <small>Per wallet entry</small>
        </article>
      </section>

      <section className="winner-card">
        <div>
          <div className="eyebrow">LOTTERY RESULT</div>
          <h2>{winner ? "Winner selected" : "Awaiting winner"}</h2>
          <p className="winner-address">
            {winner || "The winner address will appear here."}
          </p>
        </div>
        {account && (
          <div className="admin-actions">
            <button
              className="secondary-btn"
              onClick={closeLottery}
              disabled={busy || !isOpen}
            >
              Close lottery
            </button>
            <button
              className="primary-btn"
              onClick={selectWinner}
              disabled={busy || isOpen || !!winner || Number(count) === 0}
            >
              Select winner
            </button>
          </div>
        )}
      </section>

      <div className="status" role="status">{status}</div>

      <footer>
        Educational test-network project · Never use real funds.
        Winner selection in this demo is not cryptographically secure.
      </footer>
    </main>
  );
}
