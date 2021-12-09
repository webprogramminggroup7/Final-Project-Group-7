const mongoose = require("mongoose")
const validator = require("validator")
const bcryptjs = require("bcryptjs")
const crypto = require("crypto")
const userSchemaModel = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"A user must enter the email"],
        trim:true,
        lowercase:true,
        unique:true,
        validate:[validator.isEmail,"Enter the Valid Email Address"]
    },
    name:{
        type:String,
        trim:true,
        required:[true,"The user must have a name"]
    },
    role:{
        type:String,
        enum:['user','admin','guide','lead-guide'],
        default: 'user'
    },
    photo: {
        type: String,
        default : 'default.jpg'
    },
    password:{
        type:String,
        required:[true,"Please Provide Password"],
        trim:true,
        minlength:[8,"the length of password should be minimum 8"],
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,"Please Confirm Your Password"],
        validate:{
            validator:function(string){
                return string === this.password
            },
            message:"The passwords do not match"
        }
    },
    active:{
        type:Boolean,
        default:true,
        select:false
    },
    passwordChangedAt : Date,
    passwordResetToken : String,
    passwordResetExpires:Date

})


const encryptPassword = async function(next){
if(!this.isModified('password')){
    return next()
}
saltRounds = 10
this.password = await bcryptjs.hash(this.password,saltRounds)
this.passwordConfirm = undefined
next()
}
userSchemaModel.pre("save",encryptPassword)

userSchemaModel.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passwordChangedAt = Date.now() - 1000;
    next();
  });

  userSchemaModel.pre(/^find/, function(next) {
    this.find({ active: { $ne: false } });
    next();
  });
userSchemaModel.methods.comparePassword = async function(UserEnteredPasssword,PasswordInDatabase){
    return await bcryptjs.compare(UserEnteredPasssword,PasswordInDatabase)
}


userSchemaModel.methods.changedPasswordAfter = function(jwttimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
        return jwttimestamp < changedTimeStamp
    }
    return false

}


userSchemaModel.methods.generatePasswordResetToken = function(){
const generateToken = crypto.randomBytes(32).toString('hex')
this.passwordResetToken = crypto.createHash('sha256').update(generateToken).digest('hex')
this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
console.log({generateToken},this.passwordResetToken)
return generateToken
}
const User = mongoose.model("User",userSchemaModel)
module.exports = User;