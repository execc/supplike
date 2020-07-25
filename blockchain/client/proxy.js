const SupplyChainSimple = require('./bytecode/SupplyChainSimple.json')
const Likelib = require('./likelib')
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient('/ip4/84.201.165.26/tcp/5001')


const env = {
    yc: {
        url: 'ws://84.201.165.26:50053',
        user1: '6d3e6bb8ffaff80ce4270f3db91bbfd6fc13efe095754bb492c82ab4a15c184d',
        user2: '52af23d8909acc73ac127bdd8581c4272980504cc932195c336dfcfc320b1459',
        user3: 'a770305ea6c6066cbfa2fe4616cfb9d659efe9c21fd58845b9eac420278405df'
    },
    debug: {
        url: 'ws://86.57.193.146:5050',
        user1: '8215192a2a3e07fdde156c4e752b550d067d39e9aca2446e6367b15c8dbdb75e',
        user2: '4405613e8c855dca75b8fa608d44bb08db1260970dd4a8309e723761c98f2baf',
        user3: '273839f82b2d94e1b557304423ab9115137db822a40ec0b72b196b968fdc72e1'
    }
}

const currentEnv = 'yc'

var _lk = null;
const lk = () => {
    if (!_lk) {
        _lk = new Likelib(env[currentEnv].url);
    }
    return _lk;
}

var express = require('express');
var bodyParser = require('body-parser')

// Db emulation
const db = {

}
//
var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  

const accounts = {
    admin: new Likelib.Account('2aef91bc6d2df7c41bd605caa267e8d357e18b741c4a785e06650d649d650409'),
    user1: new Likelib.Account(env[currentEnv].user1),
    user2: new Likelib.Account(env[currentEnv].user2),
    user3: new Likelib.Account(env[currentEnv].user3)
}

Object.entries(accounts).forEach(([key, value]) => {
    console.log(`Address [${key}] = ${value._address}`)
})

const accountByAddress = (address) => {
    if (accounts.user1._address === address) {
        return 'user1'
    }
    if (accounts.user2._address === address) {
        return 'user2'
    }
    if (accounts.user3._address === address) {
        return 'user3'
    }
}


/// Internal functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

const lastBlockInfo = () => new Promise((resolve, reject) => {
    console.log(`DEBUG: Call lastBlockInfo`)
    const cb = (err, result) => {
        console.log(`DEBUG: Response lastBlockInfo err: ${JSON.stringify(err)}, result: ${JSON.stringify(result)}`)
        if (err) {
            return reject(err)
        } else {
            resolve(result)
        }
    }
    lk().lastBlockInfo(cb)
})


const findTransaction = (id) => new Promise((resolve, reject) => {
    console.log(`DEBUG: Call findTransaction`)
    const cb = (err, result) => {
        console.log(`DEBUG: Response findTransaction err: ${JSON.stringify(err)}, result: ${JSON.stringify(result)}`)
        if (err) {
            return reject(err)
        } else {
            resolve(result)
        }
    }
    lk().findTransaction(id, cb)
})

const fullBlockInfo = (height) => new Promise((resolve, reject) => {
    console.log(`DEBUG: Call fullBlockInfo`)
    const cb = (err, result) => {
        console.log(`DEBUG: Response fullBlockInfo err: ${JSON.stringify(err)}, result: ${JSON.stringify(result)}`)
        if (err) {
            return reject(err)
        } else {
            resolve(result)
        }
    }
    lk().findBlock(Number.parseInt(height), cb)
})

/// End internal 

/// Service methods
const deploySupplyChain = async (roles, steps, transitions, account) => {
    const contract = Likelib.Contract.nondeployed(
        lk(),
        accounts[account],
        SupplyChainSimple.abi,
        SupplyChainSimple.bytecode.substr(2)
    )

    const deployPromise = () => {
        return new Promise((resolve, reject) => {
            const cb = (err, result) => {
                if (err) {
                    return reject(err)
                } else {
                    resolve(result)
                }
            }
            contract.deploy(roles, steps, transitions, 0, 1000000, cb)
        })
    }

    const result = await deployPromise()
    await sleep(2000)
    console.log(`[deploySupplyChain] Result: ${JSON.stringify(result)}`)

    return result;
}

const addUserToRole = async (role, account, address) => {
    console.log(`[addUserToRole] Input: ${JSON.stringify({role, account, address})}`)
    const contract = Likelib.Contract.deployed(
        lk(),
        accounts[account],
        SupplyChainSimple.abi,
        address
    )

    const addUserToRolePromise = () => {
        return new Promise((resolve, reject) => {
            const cb = (err, result) => {
                if (err) {
                    return reject(err)
                } else {
                    resolve(result)
                }
            }
            contract.addUserToRole(role, 0, 1000000, cb)
        })
    }

    const result = await addUserToRolePromise()
    await sleep(2000)
    console.log(`[addUserToRole] Result: ${JSON.stringify(result)}`)
    return result;
}

const newBatch = async (id, precedents, quantity, sid, account, address) => {
    const contract = Likelib.Contract.deployed(
        lk(),
        accounts[account],
        SupplyChainSimple.abi,
        address
    )

    const newBatchPromise = () => {
        return new Promise((resolve, reject) => {
            const cb = (err, result) => {
                if (err) {
                    return reject(err)
                } else {
                    resolve(result)
                }
            }
            contract.newBatch(id, precedents, quantity, sid, 0, 1000000, cb)
        })
    }

    const result = await newBatchPromise()
    await sleep(1000)
    console.log(`[newBatch] Result: ${JSON.stringify(result)}`)
    return result;
}

const getBatch = async (step, account, address) => {
    const contract = Likelib.Contract.deployed(
        lk(),
        accounts[account],
        SupplyChainSimple.abi,
        address
    )

    const getBatchPromise = () => {
        return new Promise((resolve, reject) => {
            const cb = (err, result) => {
                if (err) {
                    return reject(err)
                } else {
                    resolve(result)
                }
            }
            contract.getBatch(step, 0, 10000, cb)
        })
    }

    const getPrecedentsPromise = () => {
        return new Promise((resolve, reject) => {
            const cb = (err, result) => {
                if (err) {
                    return reject(err)
                } else {
                    resolve(result)
                }
            }
            contract.getPrecedents(step, 0, 10000, cb)
        })
    }

    const result1 = await getBatchPromise()
    await sleep(2000)
    const result2 = await getPrecedentsPromise()
    await sleep(2000)
    //console.log(`[getBatch] Result: ${JSON.stringify(result1)}`)
    console.log(`[getBatch] Result: ${JSON.stringify(result2)}`)
    return {
        result1,
        result2
    };
}

const getLastStep = async (id, account, address) => {
    const contract = Likelib.Contract.deployed(
        lk(),
        accounts[account],
        SupplyChainSimple.abi,
        address
    )

    const getLastStepPromise = () => {
        return new Promise((resolve, reject) => {
            const cb = (err, result) => {
                if (err) {
                    return reject(err)
                } else {
                    resolve(result)
                }
            }
            contract.getLastStep(id, 0, 10000, cb)
        })
    }

    const result = await getLastStepPromise()
    await sleep(2000)
    console.log(`[getLastStep] Result: ${JSON.stringify(result)}`)
    return result
}
/// End service methods

/// Http API
var app = express();
// parse various different custom JSON types as JSON
var json = bodyParser.json()

// See example in examples/yogurt_chain.json
app.post('/chain', json, async function (req, res) {
    const account = req.get('X-Account');

    const { roles, steps, transitions } = req.body;
    const contractRoles = roles.map(role => role.id)
    const contractSteps = steps.map(step => step.role)
    const contractTransitions = transitions.flatMap(tr => [tr.from, tr.to])

    const result = await deploySupplyChain(
        contractRoles, 
        contractSteps, 
        contractTransitions, 
        account
    )
        .then(result => {
            if (!db.contracts) {
                db.contracts = {}
            }
            if (!db.contracts[account]) {
                db.contracts[account] = []
            }
            db.contracts[account].push(result.message)
            if (!db.chains) {
                db.chains = {}
            }
            db.chains[result.message] = req.body
            return result
        })
        .then(result => {
            return {
                success: true,
                address: result.message
            }
        })
        .catch(reason => {
            return {
                success: false,
                reason
            }
        });

    res
        .status(result.success ? 201 : 500)
        .send(JSON.stringify(result));
});

app.get('/chain', json, async function (req, res) {
    const account = req.get('X-Account');

    if (db.contracts && db.contracts[account]) {
        res.send(JSON.stringify(db.contracts[account]))
    } else {
        res.send(JSON.stringify([]))
    }
});

app.get('/chain/:chainId', json, async function (req, res) {
    const address = req.params.chainId

    if (db.chains && db.chains[address]) {
        res.send(JSON.stringify(db.chains[address]))
    } else {
        res.status(404).send(JSON.stringify({success: false, reason: 'Not Found'}))
    }
});

app.get('/chain/:chainId/step', json, async function (req, res) {
    const address = req.params.chainId
    const id = req.query.id

    if (id) {
        const result = await getLastStep(id, 'admin', address)
        .then(result => {
            return {
                success: true,
                step: result["0"]
            }
        })
        .catch(reason => {
            return {
                success: false,
                reason
            }
        });

        res
            .status(result.success ? 200 : 500)
            .send(JSON.stringify(result));
    } else {
        if (db.steps && db.steps[address]) {
            res.send(JSON.stringify(db.steps[address]))
        } else {
            res.send(JSON.stringify([]))
        }
    }
});

// See example in examples/add_user_to_role.json
app.post('/chain/:chainId/roles', json, async function (req, res) {
    const address = req.params.chainId
    var account = req.get('X-Account');

    const { role, userAddress } = req.body;

    if (userAddress) {
        account = accountByAddress(userAddress);
    }

    const result = await addUserToRole(
        role, 
        account, 
        address
    )
        .then(result => {
            if (!db.roles) {
                db.roles = {}
            }
            if (!db.roles[address]) {
                db.roles[address] = {}
            }
            db.roles[address][account] = role

            if (!db.contracts) {
                db.contracts = {}
            }
            if (!db.contracts[account]) {
                db.contracts[account] = []
            }
            if (!db.contracts[account].includes(address)) {
                db.contracts[account].push(address)
            }
            return result;
        })
        .then(result => {
            return {
                success: true,
                hash: result["hash"]
            }
        })
        .catch(reason => {
            return {
                success: false,
                reason
            }
        });

    res
        .status(result.success ? 200 : 500)
        .send(JSON.stringify(result));
});

app.get('/chain/:chainId/roles', json, async function (req, res) {
    const address = req.params.chainId

    var result = {}
    if (db.roles && db.roles[address]) {
        result = db.roles[address]
    }

    res
        .status(200)
        .send(JSON.stringify(result));
});

// See example in examples/new_batch.json
app.post('/chain/:chainId/batch', json, async function (req, res) {
    const address = req.params.chainId
    const account = req.get('X-Account');

    const { id, precedents, quantity, sid } = req.body;

    const result = await newBatch(
        id, 
        precedents, 
        quantity,
        sid,
        account,
        address
    )
        .then(result => {
            if (!db.steps) {
                db.steps = {}
            }
            if (!db.steps[address]) {
                db.steps[address] = []
            }
            db.steps[address].push({
                id,
                precedents,
                quantity,
                sid,
                tx: result["hash"],
                step: result["0"]
            })
            return result
        })
        .then(result => {
            return {
                success: true,
                id: result["0"],
                tx: result["hash"]
            }
        })
        .catch(reason => {
            return {
                success: false,
                reason
            }
        });

    res
        .status(result.success ? 200 : 500)
        .send(JSON.stringify(result));
});

app.get('/tx/:txId', json, async function (req, res) {
    const txId = req.params.txId
    const result = await findTransaction(txId)
        .then(result => {
            return {
                success: true,
                ...result
            }
        })
        .catch(err => {
            return {
                success: false,
                ...err
            }
        })

    res
        .status(result.success ? 200 : 404)
        .send(JSON.stringify(result))
})

// See example in examples/new_batch.json
app.get('/chain/:chainId/step/:stepId', json, async function (req, res) {
    const address = req.params.chainId
    const step    = req.params.stepId
    const account = req.get('X-Account');

    const result = await getBatch(
        step,
        account,
        address
    )
        .then(async result => {
            const sensors = []
            for await (const file of ipfs.files.ls(`/${address}_${step}`)) {
                const path = `/${address}_${step}/${file.name}`
                console.log(`Reading from ipfs ${path}`)
                const chunks = []
               for await (const chunk of ipfs.files.read(path)) {
                    chunks.push(chunk)
                }
                const content = Buffer.concat(chunks).toString()
                console.log(`Read ${content}`)
                sensors.push(JSON.parse(content))
              }

            return {
                success: true,
                id: result["result1"]["0"],
                precedents: result["result2"]["0"],
                sensors
            }
        })
        .catch(reason => {
            return {
                success: false,
                reason
            }
        });

    res
        .status(result.success ? 200 : 500)
        .send(JSON.stringify(result));
});

app.post('/chain/:chainId/sensor', json, async function (req, res) {
    const address = req.params.chainId
    const account = 'admin'
    const { id, sensorId, sensorType, sensorValue } = req.body
    

    // Write sensor data to IPFS
    //
    const result = await getLastStep(id, account, address)
        .then(async result => {
            const stepId = result["0"]
            // Attach sensor data to step id

            const dataId = new Date().getTime().toString()
            const data = {
                sensorId,
                sensorType,
                sensorValue,
                stepId,
                dataId,
                date: new Date()
            }

            console.log(`Adding content ${JSON.stringify(data)} to IPFS`)

            const resultipfs = await ipfs.files.write(
                `/${address}_${stepId}/${dataId}.dat`,
                JSON.stringify(data),
                {
                    create: true,
                    parents: true
                }
            )
            console.log(`Success adding content to IPFS ${JSON.stringify(resultipfs)}`)

            return {
                ...result,
                ...resultipfs
            };
        })
        .then(result => {
            return {
                success: true,
                step: result["0"],
                path: result["path"],


            }
        })
        .catch(reason => {
            return {
                success: true,
                reason
            }
        });

    res
        .status(result.success ? 200 : 500)
        .send(JSON.stringify(result));
});

app.listen(3000, function () {
    console.log('Supplike listening on port 3000!');
});