const Tour = require("../models/tourSchemaModel")
const apiFilterSortLimitPaginate = require("./apiFilterSortLimitPaginate");
// const apiFilterSortLimitPaginate = require("./apiFilterSortLimitPaginate");

const fetchAllTours = async (req,res) =>{
   try{
// console.log(req.query)
const features = new apiFilterSortLimitPaginate(Tour.find(), req.query).filter().sort().limitFields().paginate()
    const allTours = await features.query;

res.status(200).json({
    status:"successful",
    totalNumberofTours:allTours.length,
    data:allTours
})
   }catch(error){
    res.status(404).json({
    status:"Failed",
    message:error
    })
   }

}
const createSingleTour = async (req,res) => {
try{
tourBody = req.body
const createdNewTour = await Tour.create(tourBody)
res.status(201).json({
    status:"successful created new tour",
    data:{
        tour:createdNewTour
    } 
})
}catch(error){
    res.status(404).json({
        status:"Failed to create review",
        message:error
        })
}
}
const getSingleTour = async (req,res) =>{
    try {
        ID = req.params.id
        const SingleTour = await Tour.findById(ID).populate("reviews")
    
        res.status(200).json({
          status: 'successful in getting single tour',
          data: {
            tour:SingleTour
          }
        });
      } catch (error) {
        res.status(404).json({
          status: 'fail to get single tour',
          message: error
        });
      }

}
const updateExistingTour = async (req,res)=>{
    try {
        ID = req.params.id
        BODY = req.body
        AdditionalParamsForRunningValidators = {
            new: true,
            runValidators: true
          }
        const updatetour = await Tour.findByIdAndUpdate(ID,BODY,AdditionalParamsForRunningValidators);
    
        res.status(200).json({
          status: 'successfully updated the tour',
          data: {
            tour:updatetour
          }
        });
      } catch (error) {
        res.status(404).json({
          status: 'failed to update tour with '+ ID,
          message: error
        });
      }

}


const deleteSingleTour = async (req,res)=>{
    try {
        ID = req.params.id
        const deletedTour = await Tour.findByIdAndDelete(ID);
        console.log(deletedTour)
        res.status(204).json({
          status: 'successfully deleted Tour with id'+ID
        });
      } catch (error) {
        res.status(404).json({
          status: 'failed to delete tour with id'+ID,
          message: error
        });
      }


}
const top5MostPopularTours = async (req,res,next)=>{
  req.query.sort = '-ratingsAverage,price';
//   req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  req.query.limit = '5';
  next();

}
const getTourStatsLikeAverageRatingsAvgPriceminPriceMaxPrice = async(req,res)=>{
    try {
        const TourStatsLikeAverageRatingsAvgPriceminPriceMaxPrice = await Tour.aggregate([
          {
            $match: { ratingsAverage: { $gte: 4.5 } }
          },
          {
            $group: {
              _id: { $toUpper: '$difficulty' },
            //   _id: null,

              Total_Number_Of_Tours: { $sum: 1 },
              Total_Number_Of_Ratings: { $sum: '$ratingsQuantity' },
              Average_Of_Ratings: { $avg: '$ratingsAverage' },
              Average_Of_Prices: { $avg: '$price' },
              Minimum_Price: { $min: '$price' },
              Maximum_Price: { $max: '$price' }
            }
          },
          {
            $sort: { Average_Of_Prices: 1 }
          }
        ]);
    
        res.status(200).json({
          status: 'successfully get tours numbers like average of ratings , average of price ,min price and max price',
          data: {
            TourNumbers : TourStatsLikeAverageRatingsAvgPriceminPriceMaxPrice
          }
        });
      } catch (error) {
        res.status(404).json({
          status: 'failed to get tour numbers',
          message: error
        });
    }
}

module.exports = {
    fetchAllTours,
    createSingleTour,
    getSingleTour,
    updateExistingTour,
    deleteSingleTour,
    top5MostPopularTours,
    getTourStatsLikeAverageRatingsAvgPriceminPriceMaxPrice
}
