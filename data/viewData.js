const Tour = require("../models/tourSchemaModel");
const Booking = require("../models/bookingSchemaModel");
const errorChecking = require("../errorHandling/globalErrorChecking");
let { ObjectId } = require('mongodb');


const landingPage = async (req,res)=>{
    try{
        const allTours = await Tour.find()

        res.status(200).render('overview',{
            title:"All Tours",
            tours:allTours
        })
        }
    catch(e){
      res.status(404).render('error',{error:"Page NOT FOUND"})
}}

const tourViewPage = async (req,res)=>{
    try{
    const singleTour = await Tour.findOne({slug:req.params.slug}).populate({path:"reviews",fields:"review rating user"})
    if(!singleTour){
        res.status(404).render('error',{error:"'There is no tour with that name."}) 
    }
    res.status(200).render("tour",{
        title:`${singleTour.name}`,
        tour:singleTour
    })
    }catch(e){
        res.status(404).render('error',{error:e})
    
    }
}

const updateTour = async (req,res)=>{
    try{
        errorChecking.NotStringOrEmptyString(req.params.slug);    
        const singleTour = await Tour.findOne({slug:req.params.slug}).populate({path:"reviews",fields:"review rating user"})
        if(!singleTour){
            res.status(404).render('error',{error:"'There is no tour with that name."}) 
        }
        res.status(200).render("updateTour",{
            title:`${singleTour.name}`,
            tour:singleTour
        })
    }catch(e){
        res.status(404).render('error',{error:"Page NOT FOUND"})
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
        res.status(404).render('error',{error:"Page NOT FOUND"})
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