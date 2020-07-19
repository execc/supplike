const SupplyChainFactory = artifacts.require("./SupplyChainFactory.sol");
const SupplyChain = artifacts.require("./SupplyChain.sol");

const addr = (fullAddr) => fullAddr.toString()

const ROLE_MILK    = 1
const ROLE_BERRY   = 2
const ROLE_YORGURT = 3

const STEP_PRODUCE_MILK   = 0;
const STEP_PRODUCE_BERRY  = 1;
const STEP_PRODUCE_YOGURT = 2;

const roles = [ ROLE_MILK, ROLE_BERRY, ROLE_YORGURT ] // Roles are given id from 1 to 3
const steps = [ ROLE_MILK, ROLE_BERRY, ROLE_YORGURT ] // Steps are given id from 0 to 2
const transition = [
  0, 2,   // Produce milk -> Produce yogurt
  1, 2    // Produce berry -> Produce yogurt
] // Transitions are set up as array of pairs

contract("SupplyChainFactory", accounts => {
  it("...should create first batch", async () => {
    const factory  = await SupplyChainFactory.new();
    // Deploy new supply chain
    await factory.deployChain(roles, steps, { from: accounts[0] })

    // Get supply chain address
    const chainAddress = await factory.getOwnedChains.call(accounts[0])
    console.log(`Deployed new SC contract at ${chainAddress}`)
    
    // Get shpply chain contract at address
    const instance = await SupplyChain.at(addr(chainAddress));

    // Add myself to role 'PRODUCER'
    await instance.addUserToRole(accounts[0], ROLE_MILK, { from: accounts[0] });

    // Create new batch
    await instance.newBatch(1, [], 1, STEP_PRODUCE_MILK, { from: accounts[0] });

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
    await factory.deployChain(roles, steps, { from: accounts[0] })

    // Get supply chain address
    const chainAddress = await factory.getOwnedChains.call(accounts[0])
    console.log(`Deployed new SC contract at ${chainAddress}`)
    
    // Get shpply chain contract at address
    const instance = await SupplyChain.at(addr(chainAddress));
    
    await instance.addUserToRole(accounts[1], ROLE_MILK, { from: accounts[0] });
    await instance.addUserToRole(accounts[2], ROLE_BERRY, { from: accounts[0] });

    // Create new batch
    await instance.newBatch(1, [],  1, STEP_PRODUCE_MILK , { from: accounts[1] });
    console.log(`Done STEP_PRODUCE_MILK`)
    // Actual batch id on blockchain is 0
    await instance.newBatch(2, [0], 1, STEP_PRODUCE_BERRY, { from: accounts[2] }); 
    console.log(`Done STEP_PRODUCE_BERRY`)

    // Get direct precedents for batch (expected empty)
    const storedData = await instance.getDirectPrecedents.call(1);
    console.log(`sotredData = ${storedData}`)
    console.log(JSON.stringify(`storedData = ${storedData}`))
    assert.equal(storedData, 0, "Direct precedents is not 1");
  });

  
  it("...should create batch based on two prev batches", async () => {
    const factory  = await SupplyChainFactory.new();
    // Deploy new supply chain
    await factory.deployChain(roles, steps, { from: accounts[0] })

    // Get supply chain address
    const chainAddress = await factory.getOwnedChains.call(accounts[0])
    console.log(`Deployed new SC contract at ${chainAddress}`)
    
    // Get shpply chain contract at address
    const instance = await SupplyChain.at(addr(chainAddress));
 
    // Add users to roles by admin
    await instance.addUserToRole(accounts[1], ROLE_MILK,    { from: accounts[0] });
    await instance.addUserToRole(accounts[2], ROLE_BERRY,   { from: accounts[0] });
    await instance.addUserToRole(accounts[3], ROLE_YORGURT, { from: accounts[0] });

    // Create new batch
    await instance.newBatch(1, [], 1,     STEP_PRODUCE_MILK,   { from: accounts[1] });
    await instance.newBatch(2, [], 1,     STEP_PRODUCE_BERRY,  { from: accounts[2] });

    // Actual batch id on blockchain is 0 and 1 correcpondingly
    await instance.newBatch(3, [0, 1], 1, STEP_PRODUCE_YOGURT, { from: accounts[3] }); 
    
    // Get direct precedents for batch (expected empty)
    const _storedData = await instance.getDirectPrecedents.call(2);
    const storedData = _storedData.map(x => x.words[0])
    console.log(`sotredData = ${storedData}`)
    console.log(JSON.stringify(`storedData = ${storedData}`))
    assert.equal(storedData, "0,1", "Direct precedents is not 0, 1");
  });

});
