const express = require("express")
const tourData = require("../data/tourData")
const authenticationUser = require("../data/authenticationUser")
const reviewData  = require("../data/reviewData");
const reviewRoutes = require("../routes/reviewRoutes")
const router = express.Router()
router.use("/:tourId/reviews",reviewRoutes)
router.get("/top-5-mostpopular-tours",tourData.top5MostPopularTours,tourData.fetchAllTours)                    //tours which have highest ratings and are cheap
router.get("/get-tour-stats-at-glimpse",tourData.getTourStatsLikeAverageRatingsAvgPriceminPriceMaxPrice)

router.get("/",tourData.fetchAllTours)
router.post("/",authenticationUser.protectedRoute,authenticationUser.OnlyGiveAccessTo("admin","lead-guide"),  tourData.uploadTourImages, tourData.resizeTourImages, tourData.createSingleTour)

router.get("/:id",tourData.getSingleTour)
router.patch("/:id",authenticationUser.protectedRoute,authenticationUser.OnlyGiveAccessTo("admin","lead-guide"),tourData.updateExistingTour)
router.delete("/:id",authenticationUser.protectedRoute,authenticationUser.OnlyGiveAccessTo('admin',"lead-guide"),tourData.deleteSingleTour)

// router.post("/:tourId/reviews",authenticationUser.protectedRoute,authenticationUser.OnlyGiveAccessTo("user"),reviewData.createSingleReview)
module.exports = router
//,authenticationUser.OnlyGiveAccessTo('admin')