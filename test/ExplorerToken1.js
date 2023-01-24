const { expect } = require('chai');
const hre = require('hardhat');

describe('ExplorerToken1 contract', function () {
  let Token;
  let explorerToken;
  let owner;
  let addr1;
  let addr2;
  // let tokenCap = 2000;
  // let initialSupply = 500;

  beforeEach(async function () {
    Token = await ethers.getContractFactory('ExplorerToken1');
    [owner, addr1, addr2] = await hre.ethers.getSigners();
    explorerToken = await Token.deploy();
  });

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(await explorerToken.owner()).to.equal(owner.address);
    });

    // it('Should set the maxSupply to correct value', async function () {
    //   expect(await explorerToken.maxSupply()).to.equal(2000);
    // });

    it('Should set the mint windows to false', async function () {
      expect(await explorerToken.publicMintOpen()).to.equal(false);
      expect(await explorerToken.allowListMintOpen()).to.equal(false);
    });

    it('Should set the total supply to zero', async function () {
      expect(await explorerToken.totalSupply()).to.equal(0);
    });
  });

  describe('Transactions', function () {
    it('Should fail if public/allowlist mint is not open', async function () {
      expect(await explorerToken.publicMintOpen()).to.be.revertedWith(
        'Public mint closed'
      );
      expect(await explorerToken.allowListMintOpen()).to.be.revertedWith(
        'Allowlist mint closed'
      );
    });

    it('Should open public & allowlist mint', async function () {
      await explorerToken.editMintWindows(true, true);
      expect(await explorerToken.publicMintOpen()).to.equal(true);
      expect(await explorerToken.allowListMintOpen()).to.equal(true);
    });

    it('Should mint(public) an NFT', async function () {
      await explorerToken.editMintWindows(true, false);
      await explorerToken.publicMint({
        value: hre.ethers.utils.parseEther('0.01'),
      });
      expect(await explorerToken.totalSupply()).to.equal(1);
    });

    it('Should mint(allow list) an NFT', async function () {
      await explorerToken.editMintWindows(false, true);
      await explorerToken.setAllowList([addr1.address]);
      await explorerToken.allowListMint({
        from: addr1.address,
        value: hre.ethers.utils.parseEther('0.001'),
      });
      expect(await explorerToken.totalSupply()).to.equal(1);
    });

    // Set Allowlist

    // Rejections
  });
});
