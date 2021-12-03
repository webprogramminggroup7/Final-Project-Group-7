const User =  require("./../models/userSchemaModel")

const fetchAllUsers = async(req,res)=>{
    try{
    
        const allUsers = await User.find();
        
        res.status(200).json({
            status:"successfully got all users",
            totalNumberofUsers:allUsers.length,
            data:allUsers
        })
           }catch(error){
            res.status(404).json({
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
        const SingleUser = await User.findById(ID)
        console.log(SingleUser)
        if(!SingleUser){
            return res.status(404).json({
                status: 'fail to get single user'
              });
        }
        res.status(200).json({
          status: 'successful in getting single user',
          data: {
            user:SingleUser
          }
        });
      } catch (error) {
       return  res.status(404).json({
          status: 'fail to get single user',
          message: error
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
        const UserFromDatabase =  await User.findByIdAndUpdate(req.params.id, { active: false });
        if(!UserFromDatabase){
        return res.status(404).json({message:"No document found with that id"})

        }
        res.status(204).json({
         status: 'successful in Making user inactive data',
         data: null
        })
     }catch(err){
        return res.status(401).json({message:err})
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
    try{
        if (req.body.password || req.body.passwordConfirm) {
            return res.status(400).json({message:"This Route is Not for Updating Password.Use /updatePassword for doing so"})
          }
          const filteredBody = filterBodyObject(req.body, 'name', 'email');

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
         return res.status(400).json({message:err})
    }
}
const deleteMyData = async (req,res) =>{
try{
   const UserFromDatabase =  await User.findByIdAndUpdate(req.user.id, { active: false });
   res.status(204).json({
    status: 'successful in Making user inactive data',
    data: null
   })
}catch(err){
   res.status(401).json({message:err})
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
