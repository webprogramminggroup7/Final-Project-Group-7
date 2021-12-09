const mongoose = require("mongoose")
const testimoialSchemaModel = new mongoose.Schema({
    testimonial:{
        type:String
    }, 
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
    }

})

const populatingFeilds = function(next){
  
    this.populate({
          path: "user",
          select : "name photo"  
       });
         next()
  }
testimoialSchemaModel.pre(/^find/,populatingFeilds)


const Testimonial = mongoose.model("Testimonial",testimoialSchemaModel)
module.exports = Testimonial;