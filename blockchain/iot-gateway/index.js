const SDK = require('@wiotp/sdk')
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient('/ip4/84.201.165.26/tcp/5001')
const fetch = require('node-fetch')

const { ApplicationClient, ApplicationConfig } = SDK

process.env.WIOTP_AUTH_TOKEN='QGTf0gXNjUJ&JHYoB8'
process.env.WIOTP_AUTH_KEY='a-zbh1l9-p3qbmf1poq'

let appConfig = ApplicationConfig.parseEnvVars();
let appClient = new ApplicationClient(appConfig);

const readFromIpfs = async (path) => {
    console.log(`Reading from ipfs ${path}`)
    const chunks = []
    for await (const chunk of ipfs.files.read(path)) {
        chunks.push(chunk)
    }
    return Buffer.concat(chunks).toString()
}

const cb = async (type, id, event, format, data) => {
    // Store sensor data in IPFS
    const dataId = new Date().getTime().toString()
    console.log(`Got measurement ${dataId}`)

    // Get product tracking information for this sensor in IPFS
    //
    try {
        const info = readFromIpfs(`/${type}/${id}`)
        const infoJson = JSON.stringify(info)
        if (infoJson.chainId && infoJson.productId) {
            console.log(`Got device binging in IPFS to ${infoJson.chainId} ${infoJson.productId}`)
            const sensorData = {
                ...JSON.parse(data.toString()),
                type,
                id,
                event,
                format
            }
            console.log(`Adding content to IPFS: ${JSON.stringify(sensorData)}`)
            const resultipfs = await ipfs.files.write(
                `/${type}/${id}/${dataId}.dat`,
                JSON.stringify(sensorData),
                {
                    create: true,
                    parents: true
                }
            )
            console.log(`Success adding content to IPFS ${JSON.stringify(resultipfs)}`)
        } else {
            console.log(`No device binging in IPFS`)
        }
    } catch (e) {
        // No data in ipfs
        console.log(`No device binging in IPFS`)
    }
}

appClient.connect();
setTimeout(() => {
    // Subscribe to events from all devices
    //
    appClient.addListener('deviceEvent', cb); 
    appClient.subscribeToEvents();
}, 2000)
