const transactionModel = require('../models/transaction.model')
const ledgerModel = require('../models/ledger.model')
const accountModel = require('../models/account.model')
const emailService = require('../services/email.service')
const mongoose = require('mongoose')


/**
 * 
 * - Creates a new Transaction
 * The 10 STEP transfer flow:
    * 1. Validate Request
    * 2. Validate Idempotency Key
    * 3. Check Account Status
    * 4. Derive sender balance from Leder
    * 5. Create transaction (PENDING)
    * 6. Create DEBIT ledger entry
    * 7. Create CREDIT ledger entry
    * 8. Mark transaction as COMPLETED
    * 9. Commit MongoDB session
    * 10. Send Email notification 
 */


async function createTransaction(req, res) {

    /**
     * Validate Request
     */
    const {fromAccount, toAccount, amount, idempotencyKey} = req.body

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message : "From account, to account, amount and idempotency key are required for creating a transaction."
        })
    }

    const fromUserAccount = await accountModel.findOne({_id : fromAccount})

    const toUserAccount = await accountModel.findOne({_id : toAccount})

    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({
            message : "Both from account and to account must be valid accounts."
        })
    }

    /**
     * Validate Idempotency Key
     */

    const isTransactionExists = await transactionModel.findOne({idempotencyKey})

    if (isTransactionExists){
        if (isTransactionExists.status === 'COMPLETED') {
            return res.status(200).json({
                message : "Transaction already processed.",
                transaction : isTransactionExists
            })
        }

        if (isTransactionExists.status === 'PENDING') {
            return res.status(400).json({
                message : "Trsnsaction is still processing."
            })
        }
        if (isTransactionExists.status === 'FAILED') {
            return res.status(500).json({
                message : "Transaction processing failed, Please retry."
            })
        }
    }

    /**
     * Create Account Status
     */

    if (fromUserAccount.status !== 'ACTIVE' || toUserAccount.status !== 'ACTIVE') {
        return res.status(400).json({
            message : "Both from account and to account must be active for processing the transaction."
        })
    }

    /**
     * Derive sender balance from Leder
    */

    const balance = await fromUserAccount.getBalance()
    if (balance < amount) {
        return res.status(400).json({
            message : `Insufficient balance. Current balance is ${balance} and Requested amount is ${amount}`
        })
    }

    let transaction;
    try{

    /**
     * Create transaction (PENDING)
     */

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = (await transactionModel.create([{
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status : 'PENDING'
    }], {session}))[0]

    const debitLedgerEntry = await ledgerModel.create([{
        account : fromAccount,
        transaction : transaction._id,
        type : 'DEBIT',
        amount
    }], {session})

    await (() => {
        return new Promise((resolve) => setTimeout(() => resolve(), 100 * 1000))
    })()

    const creditLedgerEntry = await ledgerModel.create([{
        account : toAccount,
        transaction : transaction._id,
        type : 'CREDIT',
        amount
    }], {session})

    await transactionModel.findOneAndUpdate(
        {_id : transaction._id},
        {status : 'COMPLETED'},
        {session}
    )

    await session.commitTransaction()
    session.endSession()
    } catch (error) {
        return res.status(400).json({
            message : "Transaction is Pending due to some error, Please retry."
        })
    }

    /**
     * Send Email notification
     */

    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toUserAccount._id)

    return res.status(200).json({
        message : "Transaction completed successfully.",
        transaction
    })


}

async function createInitialFundsTransaction(req, res) {
    const {toAccount, amount, idempotencyKey} = req.body

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message : "To account, amount and idempotency key are required for creating a transaction."
        })
    }


    const toUserAccount = await accountModel.findOne({_id : toAccount})
    if (!toUserAccount) {
        return res.status(400).json({
            message : "To account must be valid account."
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user : req.user._id
    })

    if (!fromUserAccount) {
        return res.status(400).json({
            message : "System account for the user not found."
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount : fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status : 'PENDING'
    })

    const debitledgerEntry = await ledgerModel.create([{
        account : fromUserAccount._id,
        transaction : transaction._id,
        type : 'DEBIT',
        amount
    }], {session})

    const creditLedgerEntry = await ledgerModel.create([{
        account : toUserAccount._id,
        transaction : transaction._id,
        type : 'CREDIT',
        amount
    }], {session})

    transaction.status = 'COMPLETED'
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({
        message : "Initial funds transaction completed successfully.",
        transaction
    })

}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}