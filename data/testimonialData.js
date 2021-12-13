const Testimonial = require("../models/testimonialSchemaModel")
const User =  require("./../models/userSchemaModel")
const errorChecking = require("../errorHandling/globalErrorChecking");
let { ObjectId } = require('mongodb');

const fetchAllTestimonials =async (req,res)=> {
    const allTestimonials  = await Testimonial.find()
    return allTestimonials;
}


const createSingleTestimonial = async (req,res)=>{
    const testimonial = req.body.testimonial
    const user = req.user._id
    errorChecking.NotStringOrEmptyString(testimonial);
    ObjectId(user);

    const currentUser = await User.findById(req.user._id);
    const name = currentUser.name;
    const photo = currentUser.photo;

    const newTestimonial = await Testimonial.create({testimonial,user,name,photo});
    return newTestimonial;
}


module.exports = {
    fetchAllTestimonials,
    createSingleTestimonial
}