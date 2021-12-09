const express = require('express')
const viewRoutes = require("../data/viewData")
const bookingData = require("../data/bookingData")
const authenticationUser = require("../data/authenticationUser")
const errorChecking = require("../errorHandling/globalErrorChecking")

const router = express.Router()

// router.use(authenticationUser.isLoggedIn)

router.get("/all-tours",authenticationUser.isLoggedIn, async(req, res)=>{
  try{
    const allTours = await viewRoutes.landingPage(req, res);
    console.log(allTours);
    res.status(200).render('overview',{
      title:"All Tours",
      tours:allTours
    })
  }catch(ex){
    res.status(500).json({
      message: ex
    });
}
})

router.get("/tour/:slug",authenticationUser.isLoggedIn, async(req, res)=>{
  try{
    errorChecking.NotStringOrEmptyString(req.params.slug);
    const singleTour = await viewRoutes.tourViewPage(req, res);
    res.status(200).render("tour",{
      title:`${singleTour.name}`,
      tour:singleTour
    })
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

router.get(
  '/my-tours', bookingData.createBookingCheckout, authenticationUser.protectedRoute, async(req, res)=>{
    try{
      const userId = req.user.id;
      errorChecking.NotStringOrEmptyString(userId, "User Id");
      const tours = await viewRoutes.getMyTours(req, res);
      res.status(200).render('overview', {
        title: 'My Tours',
        tours
      });
    }catch(ex){
      if(ex.code){
        res.status(ex.code).json({error: ex.message});
        return;
      }
      res.status(500).json({
        message: ex
    });
    }
    
  }
);
router.get("/updateTour/:slug", authenticationUser.isLoggedIn, viewRoutes.updateTour)

router.get('/signup', async (req,res)=>{
  res.status(200).render('signup', {
      title: 'Create a new account'
    });
})

router.get("/", authenticationUser.isLoggedIn, (req, res) => {
  res.status(200).render('welcome');
})


router.get('/login',authenticationUser.isLoggedIn,async (req,res)=>{
  res.status(200).render('login', {
      title: 'Log into your account'
    });
})

router.get("/me",authenticationUser.protectedRoute,async(req,res)=>{
  res.status(200).render('account', {
      title: 'Your Personal Account'
    });
})

router.get("/createTour", authenticationUser.protectedRoute,async(req,res)=>{
  res.status(200).render('createTour', {
      title: 'Create a New Tour'
    });
})


module.exports = router
