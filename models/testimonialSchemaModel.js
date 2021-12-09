const mongoose = require("mongoose")
const testimoialSchemaModel = new mongoose.Schema({
    testimonial:{
        type:String
    }, 
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
    },
    name:{
        type:String,
        trim:true,
        required:[true,"The user must have a name"],
    },
    photo: {
        type: String,
        default : 'default.jpg'
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