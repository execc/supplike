const SupplyChainFactory = artifacts.require("./SupplyChainFactory.sol");
const SupplyChain = artifacts.require("./SupplyChain.sol");

const addr = (fullAddr) => fullAddr.toString()

contract("SupplyChainFactory", accounts => {
  it("...should create first batch", async () => {
    const factory  = await SupplyChainFactory.new();
    // Deploy new supply chain
    await factory.deployChain({ from: accounts[0] })

    // Get supply chain address
    const chainAddress = await factory.getOwnedChains.call(accounts[0])
    console.log(`Deployed new SC contract at ${chainAddress}`)
    
    // Get shpply chain contract at address
    const instance = await SupplyChain.at(addr(chainAddress));

    // Create new batch
    await instance.newBatch(1, [], 1, { from: accounts[0] });

    // Get direct precedents for batch (expected empty)
    const storedData = await instance.getDirectPrecedents.call(1);
    console.log(`sotredData = ${storedData}`)
    const isLast = await instance.isLastStep.call(0);
    console.log(JSON.stringify(`storedData = ${storedData}`))
    assert.equal(storedData, "", "Direct precedents is not empty");
    assert.equal(isLast, true, "First step in chain is not last");
  });

  it("...should create derived batch", async () => {
    const factory  = await SupplyChainFactory.new();
    // Deploy new supply chain
    await factory.deployChain({ from: accounts[0] })

    // Get supply chain address
    const chainAddress = await factory.getOwnedChains.call(accounts[0])
    console.log(`Deployed new SC contract at ${chainAddress}`)
    
    // Get shpply chain contract at address
    const instance = await SupplyChain.at(addr(chainAddress));

    // Create new batch
    await instance.newBatch(1, [], 1, { from: accounts[0] });
    await instance.newBatch(2, [0], 1, { from: accounts[0] }); // Actual batch id on blockchain

    // Get direct precedents for batch (expected empty)
    const storedData = await instance.getDirectPrecedents.call(1);
    console.log(`sotredData = ${storedData}`)
    console.log(JSON.stringify(`storedData = ${storedData}`))
    assert.equal(storedData, 0, "Direct precedents is not 1");
  });

  it("...should create batch based on two prev batches", async () => {
    const factory  = await SupplyChainFactory.new();
    // Deploy new supply chain
    await factory.deployChain({ from: accounts[0] })

    // Get supply chain address
    const chainAddress = await factory.getOwnedChains.call(accounts[0])
    console.log(`Deployed new SC contract at ${chainAddress}`)
    
    // Get shpply chain contract at address
    const instance = await SupplyChain.at(addr(chainAddress));

    // Create new batch
    await instance.newBatch(1, [], 1, { from: accounts[0] });
    await instance.newBatch(2, [], 1, { from: accounts[0] });
    await instance.newBatch(3, [0, 1], 1, { from: accounts[0] }); // Actual batch id on blockchain

    // Get direct precedents for batch (expected empty)
    const _storedData = await instance.getDirectPrecedents.call(2);
    const storedData = _storedData.map(x => x.words[0])
    console.log(`sotredData = ${storedData}`)
    console.log(JSON.stringify(`storedData = ${storedData}`))
    assert.equal(storedData, "0,1", "Direct precedents is not 0, 1");
  });
});
