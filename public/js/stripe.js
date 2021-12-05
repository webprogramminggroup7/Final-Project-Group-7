// const Stripe = require('stripe');
const stripe = Stripe('pk_test_51K2pNaFZd8aoQ8rCCykhCK3QUNBj0tApBJ3Xhtyr61nR0027YOVg9KRBxgvCvohyM6OBOZwTgp2VQgtQq03YJSv800NDquUeTe');

const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `/travel-bliss/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err.response);
    alert('error', err);
  }
};
const bookBtn = document.getElementById('book-tour')
if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    console.log(tourId)
    bookTour(tourId);
  });
  