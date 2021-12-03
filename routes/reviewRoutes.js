const express = require("express")
const reviewData = require("../data/reviewData")
const authenticationUser = require("../data/authenticationUser")

const router = express.Router({mergeParams:true})


router.get("/",authenticationUser.protectedRoute,reviewData.fetchAllReviews)
router.post("/",authenticationUser.protectedRoute,authenticationUser.OnlyGiveAccessTo("user"),reviewData.createSingleReview)

router.get("/:id",authenticationUser.protectedRoute,reviewData.getSingleReview)

router.patch("/:id",authenticationUser.protectedRoute,authenticationUser.OnlyGiveAccessTo("user","admin"),reviewData.updateExistingReview)

router.delete("/:id",authenticationUser.protectedRoute,authenticationUser.OnlyGiveAccessTo("user","admin"),reviewData.deleteSingleReview)

// router.get("/:id",tourData.getSingleTour)
// router.patch("/:id",tourData.updateExistingTour)
// router.delete("/:id",authenticationUser.protectedRoute,authenticationUser.OnlyGiveAccessTo('admin'),tourData.deleteSingleTour)

module.exports = router