const SupplyChainSimple = require('./bytecode/SupplyChainSimple.json')
const Likelib = require('./likelib')

const lk = () => new Likelib('ws://84.201.165.26:50053')
var express = require('express');
var bodyParser = require('body-parser')


const accounts = {
    admin: new Likelib.Account('2aef91bc6d2df7c41bd605caa267e8d357e18b741c4a785e06650d649d650409'),
    user1: new Likelib.Account('708b65da771d698f5e618bf22adbf3330bf9bf9351a9f0027912502c4f6141d3'),
    user2: new Likelib.Account('e951e2e13b03bb15b947d70e8f1c5977b67f5d1ca6753c514ed4e12b6d07c1ef'),
    user3: new Likelib.Account('6e7382e4eaf8af6533a5716f03f41ff63b464e396c27ea435590335973492a5f'),
    user4: new Likelib.Account('04a0d27d928ee70d949cb15c2dc483f24e300a4881c56226e14dd60589f204a6'),
    user5: new Likelib.Account('535683fc7f3592a720230b455d734f647745007e3732c13f6c2c07e909547070'),
    user6: new Likelib.Account('7428682a82c6765750dc98f0c41b205812ec5e33759b3307101a25b293f2986d'),
    user7: new Likelib.Account('fdc45afd62cc529b9b92bb52c5d1f4fa0ddf071ee9d25786c0452b8bc3bc498a'),
    user8: new Likelib.Account('d92332ddba068b77dcb7000a02e010f9310570dec3a7b21196f634e5b9905ac4'),
    user9: new Likelib.Account('4a70d00b825df48c921e29e96d0b457889101f18dd669276766d9755112d4549'),
}

/// Internal functions
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
    console.log(`[deploySupplyChain] Result: ${JSON.stringify(result)}`)

    return result;
}

const addUserToRole = async (role, account, address) => {
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
    console.log(`[newBatch] Result: ${JSON.stringify(result)}`)
    return result;
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

// See example in examples/add_user_to_role.json
app.post('/chain/:chainId/roles', json, async function (req, res) {
    const address = req.params.chainId
    const account = req.get('X-Account');

    const { role } = req.body;

    const result = await addUserToRole(
        role, 
        account, 
        address
    )
        .then(result => {
            return {
                success: true,
                result
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
            return {
                success: true,
                id: result["0"]
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

app.listen(3000, function () {
    console.log('Supplike listening on port 3000!');
});