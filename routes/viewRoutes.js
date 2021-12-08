const express = require('express')
const viewRoutes = require("../data/viewData")
const bookingData = require("../data/bookingData")
const authenticationUser = require("../data/authenticationUser")

const router = express.Router()

// router.use(authenticationUser.isLoggedIn)
router.get('/signup',viewRoutes.SignUpForm)
router.get("/all-tours",authenticationUser.isLoggedIn,viewRoutes.landingPage)
router.get("/", (req, res) => {
  res.render('welcome');
})
router.get("/tour/:slug",authenticationUser.isLoggedIn,viewRoutes.tourViewPage)
router.get('/login',authenticationUser.isLoggedIn,viewRoutes.LoginForm)
router.get("/me",authenticationUser.protectedRoute,viewRoutes.getAccountDetails)
router.get(
  '/my-tours',
  bookingData.createBookingCheckout,
  authenticationUser.protectedRoute,
  viewRoutes.getMyTours
);
router.get("/createTour", authenticationUser.protectedRoute,viewRoutes.createNewTour)
router.get("/updateTour", (req, res) => {
  res.render('updateTour')
})
module.exports = router
