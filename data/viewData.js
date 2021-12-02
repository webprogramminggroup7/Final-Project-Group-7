const Tour = require("../models/tourSchemaModel")
const landingPage = async (req,res)=>{
    try{
        const allTours = await Tour.find()

        res.status(200).render('overview',{
            title:"All Tours",
            tours:allTours
        })
        }
    catch(e){
      res.status(404).json({message:"Page NOT FOUND"})
    }}

const tourViewPage = async (req,res)=>{
try{
const singleTour = await Tour.findOne({slug:req.params.slug}).populate({path:"reviews",fields:"review rating user"})
if(!singleTour){
    res.status(404).json({message:"'There is no tour with that name."}) 
}
res.status(200).render("tour",{
    title:`${singleTour.name}`,
    tour:singleTour
})
}catch(e){
    res.status(404).json({message:"Page NOT FOUND"})

}
}
const LoginForm = async (req,res)=>{
    res.status(200).render('login', {
        title: 'Log into your account'
      });
}
module.exports = {
    landingPage,
    tourViewPage,
    LoginForm
}