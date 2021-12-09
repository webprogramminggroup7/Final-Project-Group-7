const stripe = require('stripe')("sk_test_51K2pNaFZd8aoQ8rCuMQhsydOIn2H11yI1QqtKj3DBlyn5WcB1d9NWqYp0xVFQIZoFqjRhE5qFwPcJuQ3Ez5T8CQd00qK5RCvhX");
const Tour = require("../models/tourSchemaModel");
const Booking = require("../models/bookingSchemaModel");
const nodemailer = require('nodemailer')
const getCheckoutSession =async (req, res) => {
    const tour = await Tour.findById(req.params.tourId);
    console.log(tour);
  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
        req.params.tourId
      }&user=${req.user.id}&price=${tour.price}`,
      cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourId,
      line_items: [
        {
          name: `${tour.name} Tour`,
          description: tour.summary,
          images: [`https://www.google.com/imgres?imgurl=http%3A%2F%2Fww1.prweb.com%2Fprfiles%2F2015%2F09%2F29%2F12992551%2FWes%2520Lavin%2520Photo%2520%252032.jpg&imgrefurl=https%3A%2F%2Fwww.prweb.com%2Freleases%2F2015%2F10%2Fprweb12992551.htm&tbnid=-UAggDvFcbCStM&vet=12ahUKEwiMvObLwMn0AhXznnIEHf3HB2oQMygEegUIARDPAQ..i&docid=ZLOWnawy5Bu7BM&w=4800&h=3429&itg=1&q=new%20hampshire%20colors&ved=2ahUKEwiMvObLwMn0AhXznnIEHf3HB2oQMygEegUIARDPAQ`],
          amount: tour.price * 100,
          currency: 'usd',
          quantity: 1
        }
      ]
    });

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  secure: true,
  service: 'Gmail',

  auth: {
    user:'webprogramminggroup7',
    pass:'WebProgramming1234!'
  }
});

var mailOptions = {
  from: 'webprogramminggroup7@gmail.com',
  to: `${req.user.email}`,
  subject: `Succesfully Booked The Tour ${tour.name} `,
  text: ` Your Payment of ${tour.price} has been successfully completed and your tour has been booked succesfully by us .Enjoy your trip`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
    res.status(200).json({
      status: 'success',
      session
  });
}

const createBookingCheckout = async (req,res,next)=>{
    const { tour, user, price } = req.query;

    if (!tour && !user && !price) return next();
    await Booking.create({ tour, user, price });
  
    res.redirect(req.originalUrl.split('?')[0]);
}

module.exports={
    getCheckoutSession,
    createBookingCheckout
}