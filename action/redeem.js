import util from '../lib/util.js'
import conf from '../conf.js'
import log from "../lib/log.js";

async function redeemDeposit(tbtc, depositAddress, ridderAddress) {
    return new Promise(async (resolve, reject) => {
        try {
            const deposit = await tbtc.Deposit.withAddress(depositAddress)
            const redemption = await deposit.requestRedemption(ridderAddress)
            redemption.autoSubmit()

            redemption.onWithdrawn(transactionID => {
                resolve(
                    `Redeemed deposit ${deposit.address} with Bitcoin transaction ` +
                    `${transactionID}.`
                )
            })
        } catch (err) {
            reject(err)
        }
    })
}

async function redeem(priKey, depositAddress) {
    const web3 = await util.newWeb3(priKey, conf.ethRpcUrl)
    const tbtc = await util.newTbtc(web3)
    log.info(`try redeem for depositAddress ${depositAddress} to ${conf.ridderAddress}`)
    await redeemDeposit(tbtc, depositAddress, conf.ridderAddress)
}

export default redeem
