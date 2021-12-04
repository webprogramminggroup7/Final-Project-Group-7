const express = require('express')
const viewRoutes = require("../data/viewData")
const authenticationUser = require("../data/authenticationUser")

const router = express.Router()

router.use(authenticationUser.isLoggedIn)
router.get("/",viewRoutes.landingPage)
router.get("/tour/:slug",viewRoutes.tourViewPage)
router.get('/login',viewRoutes.LoginForm)
router.get("/me",authenticationUser.protectedRoute,viewRoutes.getAccountDetails)
router.get("/createTour", authenticationUser.protectedRoute,viewRoutes.createNewTour)
module.exports = router
