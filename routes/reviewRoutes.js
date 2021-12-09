const express = require("express")
const reviewData = require("../data/reviewData")
const authenticationUser = require("../data/authenticationUser");
const reviewChecking = require("../errorHandling/review");
let { ObjectId } = require('mongodb');
const router = express.Router()

router.use(authenticationUser.isLoggedIn)

//fetch all reviews
router.get("/",authenticationUser.protectedRoute, async(req, res)=>{
    try{
        const tourId = req.params.tourId;
        reviewChecking.NotStringOrEmptyString(tourId, "Tour Id");

        const allReviews = await reviewData.fetchAllReviews(req, res);
        res.status(200).json({
            status:"successful got all the reviews",
            totalNumberofReviews:allReviews.length,
            data:allReviews
        })
    }catch(ex){
        if(ex.code){
            res.status(ex.code).json({error: ex.message});
            return;
        }
        res.status(500).json({
            status:"Failed",
            message: ex
        })
    }
    
})

//create single review
router.post("/",authenticationUser.protectedRoute,authenticationUser.OnlyGiveAccessTo("user"), async(req, res)=>{
    try{
        const user = req.user.id;
        const tour = req.params.tourId
        const { review, rating, createdAt} = req.body;

        reviewChecking.NotStringOrEmptyString(review, "Review");
        reviewChecking.NotStringOrEmptyString(user, "User Id");
        reviewChecking.NotStringOrEmptyString(tour, "Tour Id");
        reviewChecking.checkInt(rating, "Rating");
        try{
            ObjectId(user);
            ObjectId(tour);
        }catch(ex){
            res.status(400).json({
                message: 'Invalid ObjectId'
            })
            return;
        }

        const createdNewReview = await reviewData.createSingleReview(req, res);
        res.status(201).json({
            status:"successful created new Review",
            data:{
                review:createdNewReview
            } 
        })
    }
    catch(ex){
        if(ex.code){
            res.status(ex.code).json({error: ex.message});
            return;
        }
        res.status(500).json({
            message: ex
        });
    }
    
})

// commented because causing problems for next routes
// router.get("/:id",authenticationUser.protectedRoute,reviewData.getSingleReview)


//update existing review
router.patch("/:id",authenticationUser.protectedRoute,authenticationUser.OnlyGiveAccessTo("user","admin"), async(req, res)=>{
    try{
        const {rating, review} = req.body;
        const reviewId = req.params.id;
        reviewChecking.checkInt(rating, "Rating");
        reviewChecking.checkRating(rating);
        reviewChecking.NotStringOrEmptyString(review, "Review");
        reviewChecking.NotStringOrEmptyString(reviewId, "Review Id");
        try{
            ObjectId(reviewId);
        }
        catch(ex){
            res.status(400).json({
                message: 'Invalid ObjectId for ReviewId'
            })
            return;
        }

        const updateReview = await reviewData.updateExistingReview(req, res);
        res.status(200).json({
            status: 'successfully updated the Review',
            data: {
              review:updateReview
            }
        });

    }catch(ex){
        if(ex.code){
            res.status(ex.code).json({error: ex.message});
            return;
        }
        res.status(500).json({
            message: ex
        });
    }
})

router.delete("/:id",authenticationUser.protectedRoute,authenticationUser.OnlyGiveAccessTo("user","admin"), async(req, res)=>{
    try{
        const id = req.params.id;
        reviewChecking.checkInt(id, "Review Id");

        const deletedReview = await reviewData.deleteSingleReview(req, res);
        res.status(200).json({
            status: 'successfully deleted Review with id'+ID
        });

    }catch(ex){
        if(ex.code){
            res.status(ex.code).json({error: ex.message});
            return;
        }
        res.status(500).json({
            message: ex
        });
    }
    
})

router.get("/user",authenticationUser.protectedRoute, async(req, res)=>{
    try{
        const data = await reviewData.getReviewsForUserID(req, res);
        res.status(200).json({reviews: data});
    }catch(ex){
        res.status(500).json({
            message: ex
        });
    }
});

router.get("/reviewsId",authenticationUser.protectedRoute, async(req, res)=>{
    try{
        const data = await reviewData.getReviewsForUserID(req, res);
        res.status(200).render('reviews', {reviews: data});
    }catch(ex){
        if(ex.code){
            res.status(ex.code).json({error: ex.message});
            return;
        }
        res.status(500).json({
            message: ex
        });
    }
    
})

// router.get("/:id",tourData.getSingleTour)
// router.patch("/:id",tourData.updateExistingTour)
// router.delete("/:id",authenticationUser.protectedRoute,authenticationUser.OnlyGiveAccessTo('admin'),tourData.deleteSingleTour)

module.exports = router