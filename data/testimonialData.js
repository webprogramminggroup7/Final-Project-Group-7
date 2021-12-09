const Testimonial = require("../models/testimonialSchemaModel")


const fetchAllTestimonials =async (req,res)=> {
    try{
       const Alltestimonials  = await Testimonial.find() 
        
        res.status(200).json({
            status:"successful",
            totalNumberofTestimonials:Alltestimonials.length,
            data:Alltestimonials
        })
           }catch(error){
            res.status(500).json({
            status:"Failed",
            message:error
            })
           }
}


const createSingleTestimonial = async (req,res)=>{
    try{
        // console.log(req.user)
        testimonial = req.body.testimonial
        user = req.user._id
        const newTestimonial = await Testimonial.create({testimonial,user})
        res.status(201).json({status:"success",message:"New Testimonial Added Successfully",testimonial:newTestimonial})
    }catch(e){
        res.status(401).json({status:"fail",message:"cannot add testimonial",error:e})
     }


}


module.exports = {
    fetchAllTestimonials,
    createSingleTestimonial
}