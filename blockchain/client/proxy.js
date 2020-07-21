const SupplyChainSimple = require('./bytecode/SupplyChainSimple.json')
const Likelib = require('./likelib')

const lk = () => new Likelib('ws://84.201.165.26:50053')
var express = require('express');
var bodyParser = require('body-parser')


const accounts = {
    admin: new Likelib.Account('2aef91bc6d2df7c41bd605caa267e8d357e18b741c4a785e06650d649d650409')
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

// See example in examples/add-user-to-role.json
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

app.listen(3000, function () {
    console.log('Supplike listening on port 3000!');
});