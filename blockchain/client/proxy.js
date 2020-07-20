const SupplyChainSimple = require('./bytecode/SupplyChainSimple.json')
const Likelib = require('./likelib')

const lk = () => new Likelib('ws://84.201.165.26:50053')

const bytecode = "60806040523480156200001157600080fd5b50604051620017c0380380620017c0833981810160405260608110156200003757600080fd5b81019080805160405193929190846401000000008211156200005857600080fd5b838201915060208201858111156200006f57600080fd5b82518660208202830111640100000000821117156200008d57600080fd5b8083526020830192505050908051906020019060200280838360005b83811015620000c6578082015181840152602081019050620000a9565b5050505090500160405260200180516040519392919084640100000000821115620000f057600080fd5b838201915060208201858111156200010757600080fd5b82518660208202830111640100000000821117156200012557600080fd5b8083526020830192505050908051906020019060200280838360005b838110156200015e57808201518184015260208101905062000141565b50505050905001604052602001805160405193929190846401000000008211156200018857600080fd5b838201915060208201858111156200019f57600080fd5b8251866020820283011164010000000082111715620001bd57600080fd5b8083526020830192505050908051906020019060200280838360005b83811015620001f6578082015181840152602081019050620001d9565b5050505090500160405250505060008351116200027b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260138152602001807f526f6c65732073686f756c64206265207365740000000000000000000000000081525060200191505060405180910390fd5b6000825111620002f3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260188152602001807f5374657020726f6c65732073686f756c6420626520736574000000000000000081525060200191505060405180910390fd5b60008151116200036b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260198152602001807f5472616e736974696f6e732073686f756c64206265207365740000000000000081525060200191505060405180910390fd5b33600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008090505b835181101562000495576000848281518110620003cb57fe5b60200260200101511162000447576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600f8152602001807f496e76616c696420726f6c65206964000000000000000000000000000000000081525060200191505060405180910390fd5b8381815181106200045457fe5b6020026020010151600860008684815181106200046d57fe5b60200260200101518152602001908152602001600020819055508080600101915050620003b2565b5060008090505b82518110156200059857600060086000858481518110620004b957fe5b60200260200101518152602001908152602001600020541162000544576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260178152602001807f496e76616c696420726f6c6520494420696e207374657000000000000000000081525060200191505060405180910390fd5b60405180602001604052808483815181106200055c57fe5b6020026020010151815250600360006001840181526020019081526020016000206000820151816000015590505080806001019150506200049c565b5060008090505b81518110156200061a5760096000836001840181518110620005bd57fe5b60200260200101518152602001908152602001600020828281518110620005e057fe5b602002602001015190806001815401808255809150506001900390600052602060002001600090919091909150556002810190506200059f565b50505050611192806200062e6000396000f3fe608060405234801561001057600080fd5b506004361061010b5760003560e01c80636f0e823d116100a25780638da5cb5b116100715780638da5cb5b146104c9578063b32c4d8d14610513578063bfda4a4914610588578063e82b8038146105ca578063f8350ed0146106b45761010b565b80636f0e823d146103bb5780637217e0b91461040157806374d5e100146104435780637bee36111461049b5761010b565b80634f00a284116100de5780634f00a2841461023557806350c0b69314610281578063664a457d1461035b57806369ff6abb1461039d5761010b565b8063017a9105146101105780630e40d888146101525780632799276d146101d55780633b37986e146101f3575b600080fd5b61013c6004803603602081101561012657600080fd5b810190808035906020019092919050505061071a565b6040518082815260200191505060405180910390f35b61017e6004803603602081101561016857600080fd5b8101908080359060200190929190505050610732565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156101c15780820151818401526020810190506101a6565b505050509050019250505060405180910390f35b6101dd6107a0565b6040518082815260200191505060405180910390f35b61021f6004803603602081101561020957600080fd5b81019080803590602001909291905050506107a6565b6040518082815260200191505060405180910390f35b61026b6004803603604081101561024b57600080fd5b8101908080359060200190929190803590602001909291905050506107be565b6040518082815260200191505060405180910390f35b6103416004803603604081101561029757600080fd5b81019080803590602001906401000000008111156102b457600080fd5b8201836020820111156102c657600080fd5b803590602001918460208302840111640100000000831117156102e857600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f820116905080830192505050505050509192919290803590602001909291905050506107ec565b604051808215151515815260200191505060405180910390f35b6103876004803603602081101561037157600080fd5b810190808035906020019092919050505061097e565b6040518082815260200191505060405180910390f35b6103a5610996565b6040518082815260200191505060405180910390f35b6103e7600480360360208110156103d157600080fd5b810190808035906020019092919050505061099c565b604051808215151515815260200191505060405180910390f35b61042d6004803603602081101561041757600080fd5b81019080803590602001909291905050506109d1565b6040518082815260200191505060405180910390f35b6104856004803603602081101561045957600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506109ef565b6040518082815260200191505060405180910390f35b6104c7600480360360208110156104b157600080fd5b8101908080359060200190929190505050610a07565b005b6104d1610ac4565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61053f6004803603602081101561052957600080fd5b8101908080359060200190929190505050610aea565b604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390f35b6105b46004803603602081101561059e57600080fd5b8101908080359060200190929190505050610b2e565b6040518082815260200191505060405180910390f35b61069e600480360360808110156105e057600080fd5b81019080803590602001909291908035906020019064010000000081111561060757600080fd5b82018360208201111561061957600080fd5b8035906020019184602083028401116401000000008311171561063b57600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019092919080359060200190929190505050610b46565b6040518082815260200191505060405180910390f35b610700600480360360408110156106ca57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610fb7565b604051808215151515815260200191505060405180910390f35b600a6020528060005260406000206000915090505481565b60606002600083815260200190815260200160002060020180548060200260200160405190810160405280929190818152602001828054801561079457602002820191906000526020600020905b815481526020019060010190808311610780575b50505050509050919050565b60005481565b60056020528060005260406000206000915090505481565b600960205281600052604060002081815481106107d757fe5b90600052602060002001600091509150505481565b600060606009600084815260200190815260200160002080548060200260200160405190810160405280929190818152602001828054801561084d57602002820191906000526020600020905b815481526020019060010190808311610839575b505050505090506000815190508085511461086d57600092505050610978565b60008090505b855181101561096e576000600a600088848151811061088e57fe5b60200260200101518152602001908152602001600020549050600081141561091e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4e6f6e206578697374696e6720737461746520666f7220707265636564656e7481525060200191505060405180910390fd5b60008090505b845181101561095f578185828151811061093a57fe5b60200260200101511415610952578380600190039450505b8080600101915050610924565b50508080600101915050610873565b5060008114925050505b92915050565b60016020528060005260406000206000915090505481565b60045481565b600081600560006002600086815260200190815260200160002060010154815260200190815260200160002054149050919050565b60036020528060005260406000206000915090508060000154905081565b60076020528060005260406000206000915090505481565b60008111610a7d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260158152602001807f526f6c65206f662030206973207265736572766564000000000000000000000081525060200191505060405180910390fd5b80600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555050565b600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60026020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010154905082565b60086020528060005260406000206000915090505481565b6000808311610ba0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260308152602001806111046030913960400191505060405180910390fd5b610baa3383610fb7565b610c1c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260118152602001807f496e76616c6964207573657220726f6c6500000000000000000000000000000081525060200191505060405180910390fd5b610c2684836107ec565b610c7b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260298152602001806111346029913960400191505060405180910390fd5b60008090505b8451811015610d0857610ca6858281518110610c9957fe5b602002602001015161099c565b610cfb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602d8152602001806110d7602d913960400191505060405180910390fd5b8080600101915050610c81565b50600080905060008090505b8551811015610d64578660026000888481518110610d2e57fe5b60200260200101518152602001908152602001600020600101541415610d575760019150610d64565b8080600101915050610d14565b5080610df4576000600560008881526020019081526020016000205414610df3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601e8152602001807f496e7374616e6365207265757365206973206e6f7420706f737369626c65000081525060200191505060405180910390fd5b5b60405180606001604052803373ffffffffffffffffffffffffffffffffffffffff1681526020018781526020018681525060026000600454815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550602082015181600101556040820151816002019080519060200190610ea7929190611064565b5090505060006004549050600160046000828254019250508190555080600560008981526020019081526020016000208190555060008090505b8651811015610f4657600060026000898481518110610efc57fe5b60200260200101518152602001908152602001600020600101549050888114610f38578260056000838152602001908152602001600020819055505b508080600101915050610ee1565b5060008090505b85811015610f915760008054905060016000808282540192505081905550886001600083815260200190815260200160002081905550508080600101915050610f4d565b5083600a6000838152602001908152602001600020819055508092505050949350505050565b600080600760008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541415801561105c5750600760008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546003600084815260200190815260200160002060000154145b905092915050565b8280548282559060005260206000209081019282156110a0579160200282015b8281111561109f578251825591602001919060010190611084565b5b5090506110ad91906110b1565b5090565b6110d391905b808211156110cf5760008160009055506001016110b7565b5090565b9056fe43616e206f6e6c7920617070656e642073746174657320746f206e6f6e20636f6e73756d656420696e707574735175616e74697479206f66206974656d7320696e2062617463682073686f756c64206265206d6f7265207468656e20305472616e736974696f6e206973206e6f7420706f737369626c65206279207374617465206d6f64656ca2646970667358221220c6b5889a73e33d33371f565281cb40c5b0162c0103c5ff59c099ea762922e9f564736f6c63430006080033"

const abi =  [
    {
        "inputs": [
            {
                "internalType": "uint256[]",
                "name": "_roles",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "_stepRoles",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "_transitions",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_role",
                "type": "uint256"
            }
        ],
        "name": "addUserToRole",
        "outputs": "",
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "batches",
        "outputs": [
            {
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_step",
                "type": "uint256"
            }
        ],
        "name": "getDirectPrecedents",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_sid",
                "type": "uint256"
            }
        ],
        "name": "isAllowed",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_step",
                "type": "uint256"
            }
        ],
        "name": "isLastStep",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256[]",
                "name": "_precedents",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256",
                "name": "_sid",
                "type": "uint256"
            }
        ],
        "name": "isTransitionPossible",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "itemsToBatches",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "lastSteps",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            },
            {
                "internalType": "uint256[]",
                "name": "_precedents",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256",
                "name": "_quantity",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_sid",
                "type": "uint256"
            }
        ],
        "name": "newBatch",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": "",
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "roles",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "states",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "steps",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "role",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": "",
        "name": "totalBatches",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": "",
        "name": "totalItems",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "transitions",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "userRoles",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

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
        abi,
        bytecode
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
            contract.deploy([1, 2, 3], [1, 2, 3], [1, 3, 2, 3], 0, 1000000, cb)
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