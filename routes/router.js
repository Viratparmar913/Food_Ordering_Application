const express = require('express');
const cityController = require('../controllers/city');
const RestaurantController = require('../controllers/Restaurant');
const MealController = require('../controllers/mealtype');
const userController = require('../controllers/User');
const menuController = require('../controllers/Menu');
const orderController = require('../controllers/Orders');
const paymentGatewayController = require('../controllers/paymentGatewayController');

const router = express.Router();

router.get('/cityList',cityController.getCityList);
router.get('/getRestaurantsByCity/:city', cityController.getRestaurantsByCity);
router.get('/mealList',MealController.getMeals);
router.post('/restaurantFilter',RestaurantController.filter);
router.post('/signup',userController.signUp);
router.post('/login',userController.logIn);
router.get('/getRestaurantById/:id', RestaurantController.getRestaurantById);
router.get('/getMenuForRestaurant/:id', menuController.getMenuForRestaurant);
router.get('/getOrdersForUser',orderController.getOrdersForUser);
router.post('/saveOrdersForUser/:username',orderController.saveOrderForUser);
router.post('/payment', paymentGatewayController.payment);
router.post('/callback', paymentGatewayController.callback);


module.exports = router;