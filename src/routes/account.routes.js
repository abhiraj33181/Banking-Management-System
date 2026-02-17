const express = require('express')
const {authMiddleware} = require('../middleware/auth.middleware')
const accountController = require('../controllers/account.controller')

const router = express.Router()

/* 
* - POST /api/accounts
*/

router.post('/', authMiddleware, accountController.createAccountController)

/*
* Get account details
*/

router.get('/', authMiddleware, accountController.getAccountDetailsController)

/*
* - Get api/accounts/balance/:accountId
* - Get balance of a specific account
*/

router.get('/balance/:accountId', authMiddleware, accountController.getAccountBalanceController)

module.exports = router