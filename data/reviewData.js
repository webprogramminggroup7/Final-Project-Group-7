const Review = require(".././models/reviewSchemaModel")
const fetchAllReviews = async (req,res) =>{
    try{
     filter = {

     }
     if(req.params.tourId){
         filter = {tour:req.params.tourId}
     }
     const allReviews = await Review.find(filter);
 
 res.status(200).json({
     status:"successful got all the reviews",
     totalNumberofReviews:allReviews.length,
     data:allReviews
 })
    }catch(error){
     res.status(404).json({
     status:"Failed",
     message:error
     })
    }
 
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
 const createdNewReview = await Review.create(reviewBody)
 res.status(201).json({
     status:"successful created new Review",
     data:{
         review:createdNewReview
     } 
 })
 }catch(error){
     res.status(404).json({
         status:"Failed to create Review",
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
 const deleteSingleReview = async (req,res)=>{
    try {
        ID = req.params.id
        const deletedReview = await Review.findByIdAndDelete(ID);
        console.log(deletedReview)
        res.status(204).json({
          status: 'successfully deleted Review with id'+ID
        });
      } catch (error) {
        res.status(404).json({
          status: 'failed to delete Review with id'+ID,
          message: error
        });
      }
}
const updateExistingReview = async(req,res)=>{
    try {
        ID = req.params.id
        BODY = req.body
        AdditionalParamsForRunningValidators = {
            new: true,
            runValidators: true
          }
        const updateReview = await Review.findByIdAndUpdate(ID,BODY,AdditionalParamsForRunningValidators);
        if(!updateReview){
            return res.status(404).json({message:"No document Found"})
        }
        res.status(200).json({
          status: 'successfully updated the Review',
          data: {
            review:updateReview
          }
        });
      } catch (error) {
        res.status(404).json({
          status: 'failed to update Review with '+ ID,
          message: error
        });
      }

}

const getReviewsForUserID = async(req,res)=> {
  try{
    const allReviews = await Review.find({user:req.user.id});
    return allReviews;
  }catch(ex){
    console.log(ex)
  }
 
}

 module.exports = {
     fetchAllReviews,
     createSingleReview,
     deleteSingleReview,
     updateExistingReview,
     getSingleReview,
     getReviewsForUserID
 }