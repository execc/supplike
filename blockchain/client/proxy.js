const SupplyChainSimple = require('./bytecode/SupplyChainSimple.json')
const Likelib = require('./likelib')

const lk = () => new Likelib('ws://84.201.165.26:50053')

const admin = new Likelib.Account('2aef91bc6d2df7c41bd605caa267e8d357e18b741c4a785e06650d649d650409')

/// Internal functions
const lastBlockInfo = () => new Promise ((resolve, reject) => {
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

const fullBlockInfo = (height) => new Promise ((resolve, reject) => {
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

const deploySupplyChain = async () => {
    const contract = Likelib.Contract.nondeployed(
        lk(),
        admin,
        SupplyChainSimple.abi,
        SupplyChainSimple.deployedBytecode.substring(2)
    )
    
    const deployPromise = () => {
        return new Promise ((resolve, reject) => {
            const cb = (err, result) => {
                if (err) {
                    return reject(err)
                } else {
                    resolve(result)
                }
            }
            contract.deploy([1, 2, 3], [1, 2, 3], [1, 3, 2, 3], 0, 10000, cb)
        })
      }
    
      const result = await deployPromise()
      console.log(`Result: ${result}`)

      const lastBlock = await lastBlockInfo()
      console.log(`Last block: ${JSON.stringify(lastBlock)} @ ${lastBlock.top_block_number}`)
      const block = await fullBlockInfo(lastBlock.top_block_number)
      console.log(`Full last block: ${JSON.stringify(block)}`)

      block.transactions[0]
}

deploySupplyChain()