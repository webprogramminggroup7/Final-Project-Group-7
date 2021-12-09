const express = require("express");
const authenticationUser = require("../data/authenticationUser");
const testimonialData = require("../data/testimonialData.js");
const errorChecking = require("../errorHandling/globalErrorChecking");
let { ObjectId } = require('mongodb');
const router = express.Router();


router.get("/",authenticationUser.isLoggedIn, async(req, res)=>{
    try{
        const allTestimonials = await testimonialData.fetchAllTestimonials(req, res);
        res.status(200).render('testimonialsList', {testimonials : allTestimonials});
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

router.get("/addTestimonial", authenticationUser.protectedRoute, async(req,res)=>{
    try{
        res.status(200).render('addTestimonials')
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

router.post("/",authenticationUser.protectedRoute, async(req, res)=>{
    try{
        const testimonial = req.body.testimonial
        const user = req.user._id
        errorChecking.NotStringOrEmptyString(testimonial);
        ObjectId(user);

        const newTestimonial = testimonialData.createSingleTestimonial(req, res);
        res.status(200).json(newTestimonial);
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


module.exports = router
