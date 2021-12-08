const Tour = require("../models/tourSchemaModel");
const Booking = require("../models/bookingSchemaModel");
const errorChecking = require("../errorHandling/globalErrorChecking");

const landingPage = async (req,res)=>{
    const allTours = await Tour.find()
    return allTours;
}

const tourViewPage = async (req,res)=>{
    errorChecking.NotStringOrEmptyString(req.params.slug);
    const singleTour = await Tour.findOne({slug:req.params.slug}).populate({path:"reviews",fields:"review rating user"})
    if(!singleTour){
        throw "There is no tour with that name." 
    }
    return singleTour;
}

const getMyTours=async (req,res)=>{
    const userId = req.user.id;
    errorChecking.NotStringOrEmptyString(userId, "User Id");
    const bookings = await Booking.find({ user: req.user.id });

    // 2) Find tours with the returned IDs
    const tourIDs = bookings.map(el => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });
    return tours;
}

module.exports = {
    landingPage,
    tourViewPage,
    getMyTours
}