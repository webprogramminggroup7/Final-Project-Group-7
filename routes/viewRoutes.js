const express = require('express')
const viewRoutes = require("../data/viewData")
const authenticationUser = require("../data/authenticationUser")

const router = express.Router()

router.use(authenticationUser.isLoggedIn)
router.get('/signup',viewRoutes.SignUpForm)
router.get("/",viewRoutes.landingPage)
router.get("/tour/:slug",viewRoutes.tourViewPage)
router.get('/login',viewRoutes.LoginForm)

module.exports = router
