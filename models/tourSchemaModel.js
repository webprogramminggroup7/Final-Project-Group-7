const mongoose = require("mongoose")
const slugify = require('slugify');
const validator = require("validator")
const tourSchemaModel = new mongoose.Schema({
    name:{
        type: String,
        required:[true,"A tour must have a name"],
        unique:true,
        trim:true,
        minlength:[10,"The tour name must be atleast 10 character long "],
        maxlength:[45,"The tour name must be less than 40 character long "],
        // validate:[validator.isAlpha,"The Tour Name must Only have characters"]

      },
    price:{
    type:Number,
    required:[true,"A tour must have a price"],
    validate:{       //this validator only runs when new docs are being created not works on update.
      validator:function(val){
        return val>0
      },
      message:"Price  should be greater than zero"
    }
    },
    duration:{
    type:Number,
    required:[true,"A tour must have a duration as Number"],
    validate:{       //this validator only runs when new docs are being created not works on update.
      validator:function(val){
        return val>0
      },
      message:"Duration should be greater than zero"
    }
    },
    maxGroupSize:{
    type:Number,
    required:[true,"A tour must have a  GroupSize "]
    },
    difficulty:{
    type:String,
    required:[true,"A tour must have a difficulty field"],
    enum:{
      values:["difficult","easy","medium"],
      message:"difficulty should be either difficult,easy or medium"
    }
    },
    ratingsAverage:{
    type:Number,
    default:4,
    max:[5,"rating must be below 5.0"],
    min:[1,"rating must be above 1.0"],
    set:value=> Math.round(value * 10) / 10
    },
    ratingsQuantity:{
    type:Number,
    default:0,
    },
    summary:{
    type:String,
    required:[true,"A tour must have a summary field"],
    trim:true
    },
    description:{
    type:String,
    trim:true
    },
    imageCover:{
    type:String,
    required:[false,"A tour must have acover image field"]
    },
    startDates:[Date],
    createdAt:{
    type:Date,
    default:Date.now(),
    select:false
    },
    images:[String],
    slug:String,
    guides:[
      {
        type:mongoose.Schema.ObjectId,
        ref:'User'
      }
    ]
},{
  toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

tourSchemaModel.virtual('reviews',{
  ref:"Review",
  foreignField:"tour",
  localField:"_id"
})
const presavefunction = function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
}
tourSchemaModel.pre('save',function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
const populatingFeilds = function(next){
  this.populate({
    path: "guides",
    select : "-passwordChangedAt -__v"
     
   }
     );
     next()
}
tourSchemaModel.pre(/^find/,populatingFeilds)
const Tour = mongoose.model('Tour', tourSchemaModel);

module.exports = Tour;