const Tour = require("../models/tourSchemaModel");
const Booking = require("../models/bookingSchemaModel");
const errorChecking = require("../errorHandling/globalErrorChecking");

const landingPage = async (req,res)=>{
    const allTours = await Tour.find()
    return allTours;
}

const tourViewPage = async (req,res)=>{
try{
const singleTour = await Tour.findOne({slug:req.params.slug}).populate({path:"reviews",fields:"review rating user"})
if(!singleTour){
    res.status(404).json({message:"'There is no tour with that name."}) 
}
res.status(200).render("tour",{
    title:`${singleTour.name}`,
    tour:singleTour
})
}catch(e){
    res.status(404).json({message:"Page NOT FOUND"})

}
}

const updateTour = async (req,res)=>{
    try{
    const singleTour = await Tour.findOne({slug:req.params.slug}).populate({path:"reviews",fields:"review rating user"})
    if(!singleTour){
        res.status(404).json({message:"'There is no tour with that name."}) 
    }
    res.status(200).render("updateTour",{
        title:`${singleTour.name}`,
        tour:singleTour
    })
    }catch(e){
        res.status(404).json({message:"Page NOT FOUND"})
    
    }
    }

const LoginForm = async (req,res)=>{
    res.status(200).render('login', {
        title: 'Log into your account'
      });
}

const SignUpForm = async (req,res)=>{
    res.status(200).render('signup', {
        title: 'Create a new account'
      });
}

const createNewTour = async(req,res)=>{
    res.status(200).render('createTour', {
        title: 'Create a New Tour'
      });
}

const getAccountDetails=async(req,res)=>{
    res.status(200).render('account', {
        title: 'Your Personal Account'
      });
}
const getMyTours=async (req,res)=>{
    try{
        const bookings = await Booking.find({ user: req.user.id });

        // 2) Find tours with the returned IDs
        const tourIDs = bookings.map(el => el.tour);
        const tours = await Tour.find({ _id: { $in: tourIDs } });
      
        res.status(200).render('overview', {
          title: 'My Tours',
          tours
        });
    }catch(err){
        res.status(404).json({message:"Page NOT FOUND",error:err})
    errorChecking.NotStringOrEmptyString(req.params.slug);
    const singleTour = await Tour.findOne({slug:req.params.slug}).populate({path:"reviews",fields:"review rating user"})
    if(!singleTour){
        throw "There is no tour with that name." 
    }
    return singleTour;
}
}

module.exports = {
    landingPage,
    tourViewPage,
    LoginForm,
    SignUpForm,
    createNewTour,
    getAccountDetails,
    getMyTours,
    updateTour
}