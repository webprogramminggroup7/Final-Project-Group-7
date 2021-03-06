const User =  require("./../models/userSchemaModel")
const multer = require("multer");
const errorChecking = require('../errorHandling/globalErrorChecking')
let { ObjectId } = require('mongodb');


const multerStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename : (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    }
})

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb('Not an image', false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadUserPhoto = upload.single('photo');

const fetchAllUsers = async(req,res)=>{
    try{
    
        const allUsers = await User.find();
        
        res.status(200).json({
            status:"successfully got all users",
            totalNumberofUsers:allUsers.length,
            data:allUsers
        })
      }catch(error){
            res.status(500).json({
            status:"Failed to get all users",
            message:error
            })
      }
}

const createSingleUser = async(req,res)=>{
      res.status(500).json({
          status:"Error",
          message:"This Route is not yet implemented .use Signup route to createUser"
      })
}

const getSingleUser = async(req,res)=>{
    try {
        ID = req.params.id
        try{
          errorChecking.NotStringOrEmptyString(req.params.id, "User Id");
          ObjectId(req.params.id);
        }
        catch(ex){
            res.status(400).json({
                message: 'Invalid User Id'
            })
            return;
        }

        const SingleUser = await User.findById(ID)
        console.log(SingleUser)
        if(!SingleUser){
            res.status(404).json({
              message: 'No user found for the Id'
            })
            return;
        }

        res.status(200).json({
          status: 'successful in getting single user',
          data: {
            user:SingleUser
          }
        });
      } catch (ex) {
        res.status(500).json({
          message: ex
        });
      }
}

const updateExistingUser = async(req,res)=>{

}

const getMe = (req,res,next)=>{
    req.params.id = req.user.id
    next()
}

const deleteUser = async(req,res)=>{
    try{
        try{
          errorChecking.NotStringOrEmptyString(req.params.id, "User Id");
          ObjectId(req.params.id);
        }
        catch(ex){
            res.status(400).json({
                message: 'Invalid User Id'
            })
            return;
        }
        const UserFromDatabase =  await User.findByIdAndUpdate(req.params.id, { active: false });
        if(!UserFromDatabase){
        return res.status(404).json({message:"No document found with that id"})

        }
        res.status(204).json({
         status: 'successful in Making user inactive data',
         data: null
        })
     }catch(ex){
      res.status(500).json({
        message: ex
      });
     }
}

const filterBodyObject = (object, ...specifiedFields) => {
    const newObject = {};
    Object.keys(object).forEach(element => {
      if (specifiedFields.includes(element)) newObject[element] = object[element];
    });
    return newObject;
};

const updateMyData = async(req,res)=>{

  console.log(req.file);
  console.log(req.body);
    try{
          if (req.body.password || req.body.passwordConfirm) {
            return res.status(400).json({message:"This Route is Not for Updating Password.Use /updatePassword for doing so"})
          }
          if(!req.body.name || !req.body.email ){
            return res.status(400).json({message:"Please provide a valid name and email"})
          }
          const filteredBody = filterBodyObject(req.body, 'name', 'email');
          if(req.file) filteredBody.photo = req.file.filename;
          console.log(filteredBody);
          const updatedUserFromDatabase = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true
          });
        
          res.status(200).json({
            status: 'successful in updating the name or email',
            data: {
              user: updatedUserFromDatabase
            }
          });
    }catch(err){
         return res.status(500).json({message:err})
    }
}
const deleteMyData = async (req,res) =>{
    try{
        try{
          errorChecking.NotStringOrEmptyString(req.user.id, "User Id");
          ObjectId(req.user.id);
        }
        catch(ex){
            res.status(400).json({
                message: 'Invalid User Id'
            })
            return;
        }
        const UserFromDatabase =  await User.findByIdAndUpdate(req.user.id, { active: false });
        res.status(204).json({
          status: 'successful in Making user inactive data',
          data: null
        })
    }catch (ex) {
      res.status(500).json({
        message: ex
      });
    }
}
module.exports = {
    fetchAllUsers,
    createSingleUser,
    getSingleUser,
    updateExistingUser,
    deleteUser,
    updateMyData,
    deleteMyData,
    getMe
}
