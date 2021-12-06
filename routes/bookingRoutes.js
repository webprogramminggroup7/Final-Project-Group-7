const express = require("express")
const bookingData = require("../data/bookingData")
const authenticationUser = require("../data/authenticationUser")
const router = express.Router()
router.get('/checkout-session/:tourId',authenticationUser.protectedRoute,bookingData.getCheckoutSession);
module.exports = router