const Review = require(".././models/reviewSchemaModel");
const Tour = require(".././models/tourSchemaModel")

let { ObjectId } = require('mongodb');
const reviewChecking = require('../errorHandling/review');
const sharp = require('sharp');
const multer = require("multer");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Not an image', false);
  }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

const uploadTourImages = upload.fields([
  {name : 'reviewImage', maxCount : 2}
]);
// const apiFilterSortLimitPaginate = require("./apiFilterSortLimitPaginate");

const resizeTourImages = async(req, res, next) => {
  console.log(req.files);
  if(!req.files.reviewImage) return next();

  req.body.reviewImage = [];

  await Promise.all(
    req.files.reviewImage.map(async(file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
      .resize(200,133)
      .toFormat('jpeg')
      .jpeg({quality: 90})
      .toFile(`public/img/reviews/${filename}`);

      req.body.reviewImage.push(filename);
    })
  );
  next();
};


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
   try{
    if(!req.body.tour){
      req.body.tour = req.params.tourId
    }
    if(!req.body.user){
        req.body.user = req.user.id
    }
    reviewBody = req.body
    const createdNewReview = await Review.create(reviewBody);
    res.status(201).json({
      status:"successful created new Review",
      data:{
          review:createdNewReview
      } 
  })
}catch(error){
  res.status(404).json({
    status: "Failed to create review",
    message:error
  })
}
    
    
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

const getSingleReviewForTourId = async (tourId) =>{
      ID = tourId
      const tour = await Tour.findById(ObjectId(tourId)).populate("reviews")
      return tour;
}

 module.exports = {
     fetchAllReviews,
     createSingleReview,
     deleteSingleReview,
     updateExistingReview,
     getSingleReview,
     getReviewsForUserID,
     uploadTourImages,
     resizeTourImages,
     getSingleReviewForTourId
 }