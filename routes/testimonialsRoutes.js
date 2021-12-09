const express = require("express")

const authenticationUser = require("../data/authenticationUser")
const testimonialData = require("../data/testimonialData.js")
const router = express.Router()



router.get("/",testimonialData.fetchAllTestimonials)
router.post("/",authenticationUser.protectedRoute,authenticationUser.OnlyGiveAccessTo("user"),testimonialData.createSingleTestimonial)



module.exports = router
