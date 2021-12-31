const express = require('express');
const router = express.Router();
const buddyAccountController = require('../controllers/BuddyAccountController');

/**
 * @swagger
 * /account:
 *   get:
 *     description: Return true or false while validating CBI user identifier. 
 *     responses:
 *       200:
 *         description: successful response.
 */
router.get('/account', buddyAccountController.lookupaccount);

/**
 * @swagger
 * /balance:
 *   get:
 *     description: Retrieve balance of Buddy Main account. 
 *     responses:
 *       200:
 *         description: successful response.
 */
router.get('/balance', buddyAccountController.lookupbalance );

/**
 * @swagger
 * /transactions:
 *   get:
 *     description: Retrieve transactions for a given time interval. 
 *     responses:
 *       200:
 *         description: successful response.
 */
router.get('/transactions', buddyAccountController.lookuptransactions);

/**
 * @swagger
 * /transfer:
 *   post:
 *     description: Transfer Buddy $miles to CBI. 
 *     responses:
 *       200:
 *         description: successful response.
 */
router.post('/transfer', buddyAccountController.eventtransfer);

module.exports = router;