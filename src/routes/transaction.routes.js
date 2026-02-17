const {Router} = require('express');
const {authMiddleware, authSystemUserMiddleware} = require('../middleware/auth.middleware');
const {createTransaction, createInitialFundsTransaction} = require('../controllers/transaction.controller')

const transactionRoutes = Router();

/**
 * - POST /api/transactions/
 * - Create a new transaction
 */

transactionRoutes.post('/', authMiddleware, createTransaction)

transactionRoutes.post('/system/initial-funds', authSystemUserMiddleware, createInitialFundsTransaction)

module.exports = transactionRoutes