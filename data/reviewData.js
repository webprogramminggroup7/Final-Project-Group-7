const Review = require(".././models/reviewSchemaModel");
let { ObjectId } = require('mongodb');
const reviewChecking = require('../errorHandling/review');

const fetchAllReviews = async (req,res) =>{
    const tourId = req.params.tourId;
    ObjectId(tourId);
    reviewChecking.NotStringOrEmptyString(tourId); 
     filter = {}
     if(req.params.tourId){
         filter = {tour:req.params.tourId}
     }
     const allReviews = await Review.find(filter);
     return allReviews;
 }

 const createSingleReview = async (req,res) => {
    const user = req.user.id;
    const tour = req.params.tourId
    const { review, rating, createdAt} = req.body;

    reviewChecking.NotStringOrEmptyString(review, "Review");
    reviewChecking.NotStringOrEmptyString(user, "User Id");
    reviewChecking.NotStringOrEmptyString(tour, "Tour Id");
    reviewChecking.checkInt(rating, "Rating");
    reviewChecking.checkRating(rating);

    ObjectId(user);
    ObjectId(tour);

    if(!req.body.tour){
        req.body.tour = req.params.tourId
    }
    if(!req.body.user){
        req.body.user = req.user.id
    }
    reviewBody = req.body
    const createdNewReview = await Review.create(reviewBody)
    return createdNewReview;
}

 const getSingleReview = async (req,res) =>{
    try {
        ID = req.params.id
        const SingleReview = await Review.findById(ID)
    
        res.status(200).json({
          status: 'successful in getting single Review',
          data: {
            review:SingleReview
          }
        });
      } catch (error) {
        res.status(404).json({
          status: 'fail to get single Review',
          message: error
        });
      }

}
 
const updateExistingReview = async(req,res)=>{
    const {rating, review} = req.body;
    const reviewId = req.params.id;

    reviewChecking.checkInt(rating, "Rating");
    reviewChecking.checkRating(rating);
    reviewChecking.NotStringOrEmptyString(review, "Review");
    reviewChecking.NotStringOrEmptyString(reviewId, "Review Id");
    ObjectId(reviewId);
    
    ID = req.params.id
    BODY = req.body
    AdditionalParamsForRunningValidators = {
        new: true,
        runValidators: true
      }
    const updateReview = await Review.findByIdAndUpdate(ID,BODY,AdditionalParamsForRunningValidators);
    if(!updateReview){
        throw 'failed to update Review with '+ ID ;
    }
    return updateReview;
}

const deleteSingleReview = async (req,res)=>{
    ID = req.params.id
    reviewChecking.checkInt(req.params.id, "Review Id");
    const deletedReview = await Review.findByIdAndDelete(ID);
    console.log(deletedReview);
    return deletedReview;
    
}

const getReviewsForUserID = async(req,res)=> {
    ObjectId(req.user.id);
    const allReviews = await Review.find({user:req.user.id});
    return allReviews;
}

 module.exports = {
     fetchAllReviews,
     createSingleReview,
     deleteSingleReview,
     updateExistingReview,
     getSingleReview,
     getReviewsForUserID
 }