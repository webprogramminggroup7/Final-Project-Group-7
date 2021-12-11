const express = require('express')
const viewRoutes = require("../data/viewData")
const bookingData = require("../data/bookingData")
const authenticationUser = require("../data/authenticationUser")
const errorChecking = require("../errorHandling/globalErrorChecking")

const router = express.Router()

router.get('/signup',viewRoutes.SignUpForm)
router.get("/all-tours",authenticationUser.isLoggedIn,viewRoutes.landingPage)
router.get("/", (req, res) => {
  if(!req.cookies.jwt) {
    res.status(200).render('welcome');
  }
  else {
    res.status(200).redirect('/all-tours');
  }
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
router.get("/updateTour/:slug", authenticationUser.isLoggedIn,viewRoutes.updateTour)
module.exports = router
