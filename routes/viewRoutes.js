const express = require('express')
const viewRoutes = require("../data/viewData")
const authenticationUser = require("../data/authenticationUser")

const router = express.Router()

router.use(authenticationUser.isLoggedIn)
router.get('/signup',viewRoutes.SignUpForm)
router.get("/",viewRoutes.landingPage)
router.get("/tour/:slug",viewRoutes.tourViewPage)
router.get('/login',viewRoutes.LoginForm)
router.get("/me",authenticationUser.protectedRoute,viewRoutes.getAccountDetails)
router.get("/createTour", authenticationUser.protectedRoute,viewRoutes.createNewTour)
<<<<<<< HEAD
=======

>>>>>>> 66500cf5f873e4a2942e7fc765c0929d6a20b7a8
module.exports = router
