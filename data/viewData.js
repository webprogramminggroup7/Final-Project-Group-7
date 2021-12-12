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
      res.status(500).render('error',{error: e})
}}

const tourViewPage = async (req,res)=>{
    try{
        const slug = req.params.slug;
        if(typeof slug !== "string" || !slug ||  slug.trim().length < 1){
            res.status(400).json({error:"Invalid Slug"}) 
        }
    
        const singleTour = await Tour.findOne({slug:req.params.slug}).populate({path:"reviews",fields:"review rating user"})
        if(!singleTour){
            res.status(404).render('error',{error:"'There is no tour with that name."}) 
        }
        res.status(200).render("tour",{
            title:`${singleTour.name}`,
            tour:singleTour
        })
    }catch(ex){
        res.status(500).json({
        error: ex
        });
        
    }
    
}

const updateTour = async (req,res)=>{
    try{
        const slug = req.params.slug;
        if(typeof slug !== "string" || !slug ||  slug.trim().length < 1){
            res.status(400).json({error:"Invalid Slug"}) 
        }   
        const singleTour = await Tour.findOne({slug:req.params.slug}).populate({path:"reviews",fields:"review rating user"})
        if(!singleTour){
            res.status(404).render('error',{error:"'There is no tour with that name."}) 
        }
        res.status(200).render("updateTour",{
            title:`${singleTour.name}`,
            tour:singleTour
        })
    }catch(ex){
        res.status(500).json({
        error: ex
        });
    }
    
}

const LoginForm = async (req,res)=>{
    if(!req.cookies.jwt) {
    res.status(200).render('login', {
        title: 'Log into your account'
      });
    }
    else {
        res.status(200).redirect('/all-tours');
    }
}

const SignUpForm = async (req,res)=>{
    if(!req.cookies.jwt) {
    res.status(200).render('signup', {
        title: 'Create a new account'
      });
    }
    else {
        res.status(200).redirect('/all-tours');
    }
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
        try{
            errorChecking.NotStringOrEmptyString(req.user.id);
            ObjectId(req.user.id);
        }
        catch(ex){
            res.status(400).json({
                message: 'Invalid ObjectId'
            })
            return;
        }
        const bookings = await Booking.find({ user: req.user.id });
        // 2) Find tours with the returned IDs
        const tourIDs = bookings.map(el => el.tour);
        const tours = await Tour.find({ _id: { $in: tourIDs } });
      
        res.status(200).render('overview', {
          title: 'My Tours',
          tours
        });
    }catch(ex){
        if(ex.statusCode === 400){
            res.status(ex.statusCode).json({error: ex.message});
            return;
        }
        res.status(500).json({
        error: ex
        });
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