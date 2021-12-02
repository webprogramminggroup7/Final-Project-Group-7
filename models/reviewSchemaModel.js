const mongoose = require("mongoose")
const Tour = require("./tourSchemaModel")
const reviewSchemaModel = new mongoose.Schema({
    review:{
        type:String,
        required:[true,"A user must enter the review"],
        trim:true,
        lowercase:true,
    },
    rating:{
        type:Number,
        max:[5,"rating must be below 5.0"],
        min:[1,"rating must be above 1.0"]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:[true,"A review must belong to the user"]
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:"Tour",
        required:[true,"A review must belong to the tour"]
    }

},{
    toJSON: { virtuals: true },
      toObject: { virtuals: true }
  })
reviewSchemaModel.index({tour:1,user:1},{unique:true})
  const populatingFeilds = function(next){
    // this.populate({
    //   path: "tour",
    //   select : "name"
       
    //  }).populate({
    //     path: "user",
    //     select : "name"  
    //  });
    //    next()
    this.populate({
          path: "user",
          select : "name photo"  
       });
         next()
  }

reviewSchemaModel.statics.calculateAverageForRatings = async function(tourIDFromDatabase){
    const Statistics = await this.aggregate([
        {
            $match:{tour:tourIDFromDatabase}
        },
        {
            $group:{
                _id:"$tour",
                numberOfRatings:{$sum:1},
                averageOfRatings:{$avg:"$rating"}
            }
        }
    ])
    if(Statistics.length > 0){
        updateObject = {
            ratingsQuantity:Statistics[0].numberOfRatings,
            ratingsAverage:Statistics[0].averageOfRatings
          
      } 
      await Tour.findByIdAndUpdate(tourIDFromDatabase,updateObject)  
    }else{
        updateObject = {
            ratingsQuantity:0,
            ratingsAverage:4
          
      }  
      await Tour.findByIdAndUpdate(tourIDFromDatabase,updateObject)
    }
    
}
reviewSchemaModel.post('save',function(){
    this.constructor.calculateAverageForRatings(this.tour)
})
reviewSchemaModel.pre(/^findOneAnd/,async function(next){
    this.REVIEW = await this.findOne()
    next() 
})
reviewSchemaModel.post(/^findOneAnd/,async function(){
    await this.REVIEW.constructor.calculateAverageForRatings(this.REVIEW.tour)
    
})
reviewSchemaModel.pre(/^find/,populatingFeilds)

const Review = mongoose.model("Review",reviewSchemaModel)
module.exports = Review;