const path = require('path')
const express = require('express');
const morgan = require('morgan');
const hpp = require("hpp")
const cors=require("cors");
const xss = require("xss-clean")
const cookieParser = require('cookie-parser')
const tourRoutes = require("./routes/tourRoutes")
const userRoutes = require("./routes/userRoutes")
const reviewRoutes = require("./routes/reviewRoutes")
const bookingRoutes = require("./routes/bookingRoutes")
const viewRoutes = require("./routes/viewRoutes")
const filterRoutes = require("./routes/filterRoutes")
const testimonialsRoutes = require("./routes/testimonialsRoutes")


const app = express();
app.enable('trust proxy');
app.set('view engine','pug')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')));

const corsOptions ={
   origin:'*', 
   credentials:true,            
   optionSuccessStatus:200,
}


app.use(cookieParser())

app.use(cors(corsOptions)) 
app.options('*', cors());
app.use(morgan('dev'));

app.use(express.json());

app.use(hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  }))
  app.use(xss());
  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.cookies);
    next();
  });
app.use('/',viewRoutes)
app.use('/travel-bliss/tours',tourRoutes);
app.use('/travel-bliss/users',userRoutes);
app.use('/travel-bliss/reviews',reviewRoutes);
app.use("/travel-bliss/bookings",bookingRoutes)
app.use('/filter', filterRoutes);
app.use("/travel-bliss/testimonials",testimonialsRoutes)



app.all("*",(req,res,next)=>{
    res.status(404).render('error',{
        error:`No such Route ${req.originalUrl} Found on server`
    })
})
module.exports = app
