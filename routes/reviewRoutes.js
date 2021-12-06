const express = require("express")
const reviewData = require("../data/reviewData")
const authenticationUser = require("../data/authenticationUser")

const router = express.Router()

router.use(authenticationUser.isLoggedIn)
router.get("/",authenticationUser.protectedRoute,reviewData.fetchAllReviews)
router.post("/",authenticationUser.protectedRoute,authenticationUser.OnlyGiveAccessTo("user"),reviewData.createSingleReview)

//commented because causing problems for next routes
//router.get("/:id",authenticationUser.protectedRoute,reviewData.getSingleReview)

router.patch("/:id",authenticationUser.protectedRoute,authenticationUser.OnlyGiveAccessTo("user","admin"),reviewData.updateExistingReview)

router.delete("/:id",authenticationUser.protectedRoute,authenticationUser.OnlyGiveAccessTo("user","admin"),reviewData.deleteSingleReview)

router.get("/reviewsId",authenticationUser.protectedRoute, async(req, res)=>{
    try{
        const data = await reviewData.getReviewsForUserID(req, res);
        const id = data[0]._id;
        res.render('reviews', {reviews: data});

    }catch(ex){
        
    }
    
})

// router.get("/:id",tourData.getSingleTour)
// router.patch("/:id",tourData.updateExistingTour)
// router.delete("/:id",authenticationUser.protectedRoute,authenticationUser.OnlyGiveAccessTo('admin'),tourData.deleteSingleTour)

module.exports = router