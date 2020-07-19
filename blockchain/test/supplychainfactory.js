const SupplyChainFactory = artifacts.require("./SupplyChainFactory.sol");
const SupplyChain = artifacts.require("./SupplyChain.sol");

const addr = (fullAddr) => fullAddr.toString()

const ROLE_MILK    = 1
const ROLE_BERRY   = 2
const ROLE_YORGURT = 3

const STEP_PRODUCE_MILK   = 1;
const STEP_PRODUCE_BERRY  = 2;
const STEP_PRODUCE_YOGURT = 3;

const roles = [ ROLE_MILK, ROLE_BERRY, ROLE_YORGURT ] // Roles are given id from 1 to 3
const steps = [ ROLE_MILK, ROLE_BERRY, ROLE_YORGURT ] // Steps are given id from 1 to 3
const transition = [
  1, 3,   // Produce milk -> Produce yogurt
  1, 3    // Produce berry -> Produce yogurt
] // Transitions are set up as array of pairs


contract("SupplyChainFactory", accounts => {
  it("...should create first batch", async () => {
    const factory  = await SupplyChainFactory.new();
    // Deploy new supply chain
    await factory.deployChain(roles, steps, transition, { from: accounts[0] })

    // Get supply chain address
    const chainAddress = await factory.getOwnedChains.call(accounts[0])
    console.log(`Deployed new SC contract at ${chainAddress}`)
    
    // Get shpply chain contract at address
    const instance = await SupplyChain.at(addr(chainAddress));

    // Add myself to role 'ROLE_MILK'
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

  it("...should create derived batch based on two prev batches", async () => {
    const factory  = await SupplyChainFactory.new();
    // Deploy new supply chain
    await factory.deployChain(roles, steps, transition, { from: accounts[0] })

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

  it("...should not allow to execute step by a wrong role", async () => {
    const factory  = await SupplyChainFactory.new();
    // Deploy new supply chain
    await factory.deployChain(roles, steps, transition, { from: accounts[0] })

    // Get supply chain address
    const chainAddress = await factory.getOwnedChains.call(accounts[0])
    console.log(`Deployed new SC contract at ${chainAddress}`)
    
    // Get shpply chain contract at address
    const instance = await SupplyChain.at(addr(chainAddress));

    // Add myself to role 'ROLE_BERRY'
    await instance.addUserToRole(accounts[0], ROLE_BERRY, { from: accounts[0] });

    // Create new batch
    var reason = "NO ERROR"
    try {
      await instance.newBatch(1, [], 1, STEP_PRODUCE_MILK, { from: accounts[0] });
    } catch (e) {
      reason = e.reason
    }

    assert.equal(reason, "Invalid user role", "Should fail on user role");
  });

  it("...should not allow to execute step with extra precedent", async () => {
    const factory  = await SupplyChainFactory.new();
    // Deploy new supply chain
    await factory.deployChain(roles, steps, transition, { from: accounts[0] })

    // Get supply chain address
    const chainAddress = await factory.getOwnedChains.call(accounts[0])
    console.log(`Deployed new SC contract at ${chainAddress}`)
    
    // Get shpply chain contract at address
    const instance = await SupplyChain.at(addr(chainAddress));

    // Add myself to role 'ROLE_BERRY'
    await instance.addUserToRole(accounts[1], ROLE_MILK , { from: accounts[0] });
    await instance.addUserToRole(accounts[2], ROLE_BERRY, { from: accounts[0] });

    // Create new batch
    var reason = "NO ERROR"
    try {
      await instance.newBatch(1, [], 1, STEP_PRODUCE_MILK, { from: accounts[1] });
      // 0 - is step id for milk. Let's try to produce berry using milk. 
      // Milk input is extra - and state model should fail.
      await instance.newBatch(1, [0], 1, STEP_PRODUCE_BERRY, { from: accounts[2] });
    } catch (e) {
      reason = e.reason
    }

    assert.equal(reason, "Transition is not possible by state model", "Should fail on state model");
  });

  it("...should not allow to execute step with not enought precedent", async () => {
    const factory  = await SupplyChainFactory.new();
    // Deploy new supply chain
    await factory.deployChain(roles, steps, transition, { from: accounts[0] })

    // Get supply chain address
    const chainAddress = await factory.getOwnedChains.call(accounts[0])
    console.log(`Deployed new SC contract at ${chainAddress}`)
    
    // Get shpply chain contract at address
    const instance = await SupplyChain.at(addr(chainAddress));

    // Add myself to role 'ROLE_BERRY'
    await instance.addUserToRole(accounts[1], ROLE_MILK ,  { from: accounts[0] });
    await instance.addUserToRole(accounts[2], ROLE_YORGURT, { from: accounts[0] });

    // Create new batch
    var reason = "NO ERROR"
    try {
      await instance.newBatch(1, [], 1, STEP_PRODUCE_MILK, { from: accounts[1] });
      // 0 - is step id for milk.
      // Berry input is not present - and state model should fail.
      await instance.newBatch(1, [0], 1, STEP_PRODUCE_YOGURT, { from: accounts[2] });
    } catch (e) {
      reason = e.reason
    }

    assert.equal(reason, "Transition is not possible by state model", "Should fail on state model");
  });

  it("...should not allow to reuse same asset in multiple chains", async () => {
    const factory  = await SupplyChainFactory.new();
    // Deploy new supply chain
    await factory.deployChain(roles, steps, transition, { from: accounts[0] })

    // Get supply chain address
    const chainAddress = await factory.getOwnedChains.call(accounts[0])
    console.log(`Deployed new SC contract at ${chainAddress}`)
    
    // Get shpply chain contract at address
    const instance = await SupplyChain.at(addr(chainAddress));

    // Add myself to role 'ROLE_BERRY'
    await instance.addUserToRole(accounts[1], ROLE_MILK ,    { from: accounts[0] });
    await instance.addUserToRole(accounts[2], ROLE_BERRY,    { from: accounts[0] });
    await instance.addUserToRole(accounts[3], ROLE_YORGURT,  { from: accounts[0] });

    await instance.newBatch(1, [], 1, STEP_PRODUCE_MILK,      { from: accounts[1] }); // 0
    await instance.newBatch(2, [], 1, STEP_PRODUCE_BERRY,     { from: accounts[2] }); // 1
    await instance.newBatch(3, [0,1], 1, STEP_PRODUCE_YOGURT, { from: accounts[3] }); // 2

    // Operations above are expected to succeed
    
    var reason = "NO ERROR"
    try {
      // Try to produce new yougurt using existing ingridients - this should fail
      await instance.newBatch(3, [0,1], 1, STEP_PRODUCE_YOGURT, { from: accounts[3] }); 
    } catch (e) {
      reason = e.reason
    }

    assert.equal(reason, "Can only append states to non consumed inputs", "Should fail on state model");
  });
});
