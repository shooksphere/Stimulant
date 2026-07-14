const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Stimulant ERC-20 Token", function () {
  let stimulant;
  let owner;
  let addr1;
  let addr2;
  const initialSupply = ethers.parseEther("1000000");

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const Stimulant = await ethers.getContractFactory("Stimulant");
    stimulant = await Stimulant.deploy(initialSupply);
    await stimulant.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await stimulant.owner()).to.equal(owner.address);
    });

    it("Should assign the initial supply to the owner", async function () {
      const ownerBalance = await stimulant.balanceOf(owner.address);
      expect(ownerBalance).to.equal(initialSupply);
    });

    it("Should set correct token name and symbol", async function () {
      expect(await stimulant.name()).to.equal("Stimulant");
      expect(await stimulant.symbol()).to.equal("STIM");
    });

    it("Should set correct decimals", async function () {
      expect(await stimulant.decimals()).to.equal(18);
    });
  });

  describe("Token Info", function () {
    it("Should return correct token info", async function () {
      const tokenInfo = await stimulant.getTokenInfo();
      expect(tokenInfo[0]).to.equal("Stimulant");
      expect(tokenInfo[1]).to.equal("STIM");
      expect(tokenInfo[2]).to.equal(18);
      expect(tokenInfo[3]).to.equal(initialSupply);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseEther("100");

      await stimulant.transfer(addr1.address, transferAmount);
      expect(await stimulant.balanceOf(addr1.address)).to.equal(transferAmount);
      expect(await stimulant.balanceOf(owner.address)).to.equal(
        initialSupply - transferAmount
      );
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const transferAmount = ethers.parseEther("1000000000");
      await expect(
        stimulant.transfer(addr1.address, transferAmount)
      ).to.be.revertedWithCustomError(stimulant, "ERC20InsufficientBalance");
    });

    it("Should update allowances correctly", async function () {
      const approveAmount = ethers.parseEther("1000");

      await stimulant.approve(addr1.address, approveAmount);
      expect(await stimulant.allowance(owner.address, addr1.address)).to.equal(
        approveAmount
      );
    });

    it("Should transfer from with allowance", async function () {
      const transferAmount = ethers.parseEther("100");
      const approveAmount = ethers.parseEther("1000");

      await stimulant.approve(addr1.address, approveAmount);

      const stimulantAddr1 = stimulant.connect(addr1);
      await stimulantAddr1.transferFrom(
        owner.address,
        addr2.address,
        transferAmount
      );

      expect(await stimulant.balanceOf(addr2.address)).to.equal(transferAmount);
      expect(await stimulant.allowance(owner.address, addr1.address)).to.equal(
        approveAmount - transferAmount
      );
    });
  });

  describe("Minting", function () {
    it("Should mint tokens as owner", async function () {
      const mintAmount = ethers.parseEther("100000");
      await stimulant.mint(addr1.address, mintAmount);

      expect(await stimulant.balanceOf(addr1.address)).to.equal(mintAmount);
      expect(await stimulant.totalSupply()).to.equal(initialSupply + mintAmount);
    });

    it("Should fail to mint as non-owner", async function () {
      const stimulantAddr1 = stimulant.connect(addr1);
      const mintAmount = ethers.parseEther("100000");

      await expect(
        stimulantAddr1.mint(addr1.address, mintAmount)
      ).to.be.revertedWithCustomError(stimulant, "OwnableUnauthorizedAccount");
    });

    it("Should fail to mint to zero address", async function () {
      const mintAmount = ethers.parseEther("100000");
      await expect(
        stimulant.mint(ethers.ZeroAddress, mintAmount)
      ).to.be.revertedWith("Cannot mint to zero address");
    });

    it("Should fail to mint zero amount", async function () {
      await expect(
        stimulant.mint(addr1.address, 0)
      ).to.be.revertedWith("Amount must be greater than 0");
    });
  });

  describe("Burning", function () {
    it("Should burn tokens from caller", async function () {
      const burnAmount = ethers.parseEther("100");
      await stimulant.transfer(addr1.address, burnAmount);

      const stimulantAddr1 = stimulant.connect(addr1);
      await stimulantAddr1.burn(burnAmount);

      expect(await stimulant.balanceOf(addr1.address)).to.equal(0);
      expect(await stimulant.totalSupply()).to.equal(initialSupply - burnAmount);
    });

    it("Should burn tokens from other account as owner", async function () {
      const burnAmount = ethers.parseEther("100");
      await stimulant.transfer(addr1.address, burnAmount);

      await stimulant.burnFrom(addr1.address, burnAmount);

      expect(await stimulant.balanceOf(addr1.address)).to.equal(0);
      expect(await stimulant.totalSupply()).to.equal(initialSupply - burnAmount);
    });

    it("Should fail to burn as non-owner from other account", async function () {
      const burnAmount = ethers.parseEther("100");
      await stimulant.transfer(addr1.address, burnAmount);

      const stimulantAddr2 = stimulant.connect(addr2);
      await expect(
        stimulantAddr2.burnFrom(addr1.address, burnAmount)
      ).to.be.revertedWithCustomError(stimulant, "OwnableUnauthorizedAccount");
    });
  });

  describe("Pausing", function () {
    it("Should pause token transfers", async function () {
      await stimulant.pause();
      expect(await stimulant.paused()).to.be.true;

      const transferAmount = ethers.parseEther("100");
      await expect(
        stimulant.transfer(addr1.address, transferAmount)
      ).to.be.revertedWithCustomError(stimulant, "EnforcedPause");
    });

    it("Should unpause token transfers", async function () {
      await stimulant.pause();
      await stimulant.unpause();
      expect(await stimulant.paused()).to.be.false;

      const transferAmount = ethers.parseEther("100");
      await stimulant.transfer(addr1.address, transferAmount);
      expect(await stimulant.balanceOf(addr1.address)).to.equal(transferAmount);
    });

    it("Should fail to pause as non-owner", async function () {
      const stimulantAddr1 = stimulant.connect(addr1);
      await expect(stimulantAddr1.pause()).to.be.revertedWithCustomError(
        stimulant,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Should fail to unpause as non-owner", async function () {
      await stimulant.pause();
      const stimulantAddr1 = stimulant.connect(addr1);
      await expect(stimulantAddr1.unpause()).to.be.revertedWithCustomError(
        stimulant,
        "OwnableUnauthorizedAccount"
      );
    });
  });

  describe("Event Emissions", function () {
    it("Should emit TokensMinted event on deployment", async function () {
      const Stimulant = await ethers.getContractFactory("Stimulant");
      const tx = await Stimulant.deploy(initialSupply);
      expect(tx).to.emit(tx, "TokensMinted");
    });

    it("Should emit TokensMinted event on mint", async function () {
      const mintAmount = ethers.parseEther("100000");
      expect(await stimulant.mint(addr1.address, mintAmount))
        .to.emit(stimulant, "TokensMinted")
        .withArgs(addr1.address, mintAmount);
    });

    it("Should emit TokensBurned event on burn", async function () {
      const burnAmount = ethers.parseEther("100");
      await stimulant.transfer(addr1.address, burnAmount);

      expect(await stimulant.burnFrom(addr1.address, burnAmount))
        .to.emit(stimulant, "TokensBurned")
        .withArgs(addr1.address, burnAmount);
    });
  });
});
