const loginFunction = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/travel-bliss/users/login',
      data: {
        email,
        password
      }
    });
    console.log(res)
    if (res.data.status === 'Succesfully Logged In') {
        alert('Logged in successfully!')
    //   showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/all-tours');
      }, 1500);
    }
  } catch (err) {
      // console.log(err.response)
      alert(err.response.data.message)
    // showAlert('error', err.response.data.message);
  }
};

const signup = async (data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/travel-bliss/users/signup',
      data
    });
    console.log(res.data)
    if (res.data.status === 'Successfully signed up New User') {
      alert('Succesfully created user')
  //   showAlert('success', 'Logged in successfully!');
    window.setTimeout(() => {
      location.assign('/all-tours');
    }, 1500);
  }
} catch (err) {
  if(err.response.data.message.name==="ValidationError"){
    alert(err.response.data.message.message)

  }else{
    alert(err.response.data.message)

  }
  console.log(err.response)
  // showAlert('error', err.response.data.message);
}
};

const logout = async () => {
  try{
    const res = await axios({
      method: 'GET',
      url: 'http://localhost:3000/travel-bliss/users/logout'
    });
    console.log(res.data);
    if ((res.data.status = 'successfully logged out')){
      alert('Logged out successfully!')
      location.assign('/all-tours');
    } //location.reload(true);
  } catch(err){
    console.log(err.response.data);
    alert(`${err.response.data}`, 'Error logging out! Try again.');
  }
}

const create = async (data) => {
  try{
    const res = await axios({
      method: 'POST',
      url: '/travel-bliss/tours',
      data
    });
    console.log(res.data)
    if (res.data.status === 'successful created new tour') {
        alert('New tour has been created!')
    //   showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/all-tours');
      }, 1500);
    }
  } catch (err) {
    console.log(err.response)
  }
};

const deleteTour = async (id)=> {
  try{
    const res = await axios({
      method: 'DELETE',
      url: `/travel-bliss/tours/${id}`,
    });
    if(res.data.status === 'successfully deleted Tour with id'){
      alert('Tour has successfully been deleted')
    }
    alert('Tour has successfully been deleted')
    window.location.assign('/all-tours')
  }
  catch (err){
    console.log(err.response.data.message)
    alert(err.response.data.message)
    
  }
};


const update = async (data,id) => {
  try{
    const res = await axios({
      method: 'PATCH',
      url: `/travel-bliss/tours/${id}`,
      data
    });
    console.log(res.data)
    if (res.data.status === 'successfully updated the tour') {
        alert('Tour has been updated!')
    //   showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/all-tours');
      }, 1500);
    }
  } catch (err) {
    console.log(err.response)
  }
};


const createReview = async(review,rating,idReview) => {
  try{
    let reviewCheck = review.match(/^[0-9]+$/) != null
    if(reviewCheck == true){
      return alert('Review cannot contain only numbers')
    }
    if(rating<=0 || rating>5){
      return alert('Rating must be between 1 to 5 inclusive')
    }
    const res = await axios({
      method: 'POST',
      url: `/travel-bliss/reviews/reviews/${idReview}`,
      data: {review,rating}
    });
  if (res.data.status === 'successful created new Review') {
        alert('New review has been created!')
    //   showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/all-tours');
      }, 1500);
    }
  }
  catch(err){
    if(err.response.data.message.keyPattern={tour: 1, user: 1}){
      alert("User Has Already Given A Review For This Tour.No duplicate Allowed")
    }
  }
}


const loginForm = document.querySelector('.form--login');

const logOutBtn = document.querySelector('.nav__el--logout');

const SignUpForm = document.querySelector('.form--signup');

const deleteBtn = document.querySelector('.nav__el--delete')

const addReviewBtn = document.querySelector('.nav__el--addReview')

const closeReviewBtn = document.querySelector('.close')

const reviewFormBtn = document.querySelector('.abc')

if (logOutBtn) logOutBtn.addEventListener('click', logout);

const createForm = document.querySelector('.form--create');

const reviewForm = document.querySelector('.form--review');


if(addReviewBtn)
  addReviewBtn.addEventListener("click",function(){
    document.querySelector('.bg_modal').style.display = 'flex';
  });


if(closeReviewBtn)
  closeReviewBtn.addEventListener("click",function(){
    document.querySelector('.bg_modal').style.display = 'none'
  });

  if(reviewFormBtn)
  reviewFormBtn.addEventListener("click", function(){
    idReview = this.getAttribute("a")
  })


if(deleteBtn)
  deleteBtn.addEventListener("click", function(){
    const id = this.getAttribute("idForTour");
    deleteTour(id)
  })

const updateForm = document.querySelector('.form--update')

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // console.log(email)
    // console.log(password)

    loginFunction(email, password);
  });

if (SignUpForm)
  SignUpForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name',document.getElementById('name').value);
    form.append('email',document.getElementById('email').value);
    form.append('photo',document.getElementById('photo').files[0]);
    form.append('password',document.getElementById('password').value);
    form.append('passwordConfirm',document.getElementById('passwordConfirm').value);

    signup(form);
  });

  if(createForm)
  createForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('startDates', document.getElementById('startDates').value)
    form.append('name', document.getElementById('name').value)
    form.append('duration', document.getElementById('duration').value)
    form.append('maxGroupSize', document.getElementById('maxGroupSize').value)
    form.append('difficulty', document.getElementById('difficulty').value)
    form.append('price', document.getElementById('price').value)
    form.append('summary', document.getElementById('summary').value)
    form.append('description', document.getElementById('description').value)
    form.append('locationInfo', document.getElementById('locationInfo').value)
    form.append('imageCover', document.getElementById('imageCover').files[0])
    let files = document.getElementById('images').files;
    for (var i=0; i < files.length; i++) {
      form.append('images', files[i]);
    }
    form.append('locationImage', document.getElementById('locationImage').files[0])
    console.log(form);
    create(form);
  });

  if(updateForm)
  updateForm.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('tourId').value
    const form = new FormData();
    form.append('startDates', document.getElementById('startDates').value)
    form.append('name', document.getElementById('name').value)
    form.append('duration', document.getElementById('duration').value)
    form.append('maxGroupSize', document.getElementById('maxGroupSize').value)
    form.append('difficulty', document.getElementById('difficulty').value)
    form.append('price', document.getElementById('price').value)
    form.append('summary', document.getElementById('summary').value)
    form.append('description', document.getElementById('description').value)
    form.append('locationInfo', document.getElementById('locationInfo').value)
    form.append('imageCover', document.getElementById('imageCover').files[0])
    let files = document.getElementById('images').files;
    for (var i=0; i < files.length; i++) {
      form.append('images', files[i]);
    }
    form.append('locationImage', document.getElementById('locationImage').files[0])
    console.log(form);
    update(form, id);
  });


if(reviewForm)
  reviewForm.addEventListener('submit', e=>{
    e.preventDefault();
    const review = document.getElementById('review').value
    const rating = document.getElementById('rating').value
    createReview(review,rating,idReview)
  })