const Likelib = require('./likelib')
const { abi, bytecode } = require('./simpleSupplyChain')

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


///

const deploySupplyChain = async (roles, steps, transitions, account) => {
    const contract = Likelib.Contract.nondeployed(
        lk(),
        accounts[account],
        abi,
        bytecode
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
    console.log(`Result: ${result}`)

    //const lastBlock = await lastBlockInfo()
    //console.log(`Last block: ${JSON.stringify(lastBlock)} @ ${lastBlock.top_block_number}`)
    //const block = await fullBlockInfo(lastBlock.top_block_number)
    //console.log(`Full last block: ${JSON.stringify(block)}`)

    //block.transactions[0]
    return result;
}


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
        .status(result.success ? 201 : 500)
        .send(JSON.stringify(result));
});


app.listen(3000, function () {
    console.log('Supplike listening on port 3000!');
});