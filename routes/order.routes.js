const express = require('express');

const ordersController = require('../controllers/orders.controller');

const router = express.Router();

router.get('/',ordersController.getOrders);
router.get('/success',ordersController.getSucess);
router.get('/faliure',ordersController.getFaliure);
router.post('/', ordersController.addOrder);


module.exports = router;