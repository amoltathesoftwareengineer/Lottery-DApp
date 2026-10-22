
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lottery", function () {
  async function deployLottery() {
    const [owner, player1, player2] = await ethers.getSigners();
    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy();
    await lottery.waitForDeployment();

    return { lottery, owner, player1, player2 };
  }

  it("should set the deployer as owner", async function () {
    const { lottery, owner } = await deployLottery();
    expect(await lottery.owner()).to.equal(owner.address);
  });

  it("should allow a participant to enter", async function () {
    const { lottery, player1 } = await deployLottery();

    await lottery.connect(player1).enter({
      value: ethers.parseEther("0.1")
    });

    expect(await lottery.participantCount()).to.equal(1);
    expect(await lottery.hasEntered(player1.address)).to.equal(true);
  });

  it("should reject an entry with no ETH", async function () {
    const { lottery, player1 } = await deployLottery();

    await expect(
      lottery.connect(player1).enter({ value: 0 })
    ).to.be.revertedWith("Send ETH to enter");
  });

  it("should reject duplicate entries", async function () {
    const { lottery, player1 } = await deployLottery();

    await lottery.connect(player1).enter({
      value: ethers.parseEther("0.1")
    });

    await expect(
      lottery.connect(player1).enter({
        value: ethers.parseEther("0.1")
      })
    ).to.be.revertedWith("Already entered");
  });

  it("should allow the owner to close and select a winner", async function () {
    const { lottery, owner, player1 } = await deployLottery();

    await lottery.connect(player1).enter({
      value: ethers.parseEther("0.1")
    });

    await lottery.connect(owner).closeLottery();
    await lottery.connect(owner).selectWinner(0);

    expect(await lottery.winner()).to.equal(player1.address);
    expect(await lottery.lotteryOpen()).to.equal(false);
  });

  it("should prevent non-owners from closing the lottery", async function () {
    const { lottery, player1 } = await deployLottery();

    await expect(
      lottery.connect(player1).closeLottery()
    ).to.be.revertedWith("Only owner");
  });
});
