var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0 so need to add 1 to make it 1!
var yyyy = today.getFullYear();
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


const createReview = async(data) => {
  try{
    const res = await axios({
      method: 'POST',
      url: `/travel-bliss/reviews/reviews/${idReview}`,
      data
    });
    console.log(res.data)
  if (res.data.status === 'successful created new Review') {
        alert('New review has been created!')
    //   showAlert('success', 'Logged in successfully!');
      // window.setTimeout(() => {
      //   location.assign('/all-tours');
      // }, 1500);

      location.reload('/')
    }
  }
  catch(err){
    if(err.response.data.message.keyPattern={tour: 1, user: 1}){
      alert("You have already given a review for this tour. No duplicates allowed!")
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

const createForm = document.querySelector('#form--create');

const reviewForm = document.querySelector('#form--review');


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
{
  if(dd<10){
    dd='0'+dd
  } 
  if(mm<10){
    mm='0'+mm
  } 

  var today1 = yyyy+'-'+mm+'-'+dd;
  var dd = document.getElementById("startDates");
  document.getElementById("startDates").setAttribute("min", today1);

  createForm.addEventListener('submit', e => {
    e.preventDefault();

    const startDates = document.getElementById('startDates').value
    console.log(startDates)
    const name = document.getElementById('name').value
    const duration = document.getElementById('duration').value
    const maxGroupSize = document.getElementById('maxGroupSize').value
    const difficulty = document.getElementById('difficulty').value
    const price = document.getElementById('price').value
    const summary = document.getElementById('summary').value
    const description = document.getElementById('description').value
    const locationInfo = document.getElementById('locationInfo').value
    const imageCover = document.getElementById('imageCover').files[0]
    const files = document.getElementById('images').files;
    const locationImage = document.getElementById('locationImage').files[0];
    
    try {
      if(!startDates || !name || !duration || !maxGroupSize || !difficulty || !price || !summary || !description || !locationImage || !locationInfo ||!files || !imageCover) throw "One of the form field is not provided";
      //if((startDates - current) < 0) throw "Provide a proper date";
      console.log(startDates)
      if(typeof name !== "string") throw "Provide a proper name";
      if(typeof duration !== "string") throw "Provide a proper duration";
      if(typeof maxGroupSize !== "string") throw "Provide a proper max group size";
      if(typeof difficulty !== "string") throw "Provide a proper difficulty";
      if(typeof price !== "string") throw "Provide a proper price";
      if(typeof summary !== "string") throw "Provide a proper summary";
      if(typeof description !== "string") throw "Provide a proper description";
      if(typeof locationInfo !== "string") throw "Provide a proper location";

      // if(startDates < current) throw "Date should be after the current date";
      if(name.trim().length === 0) throw "Name should not be empty";
      if(summary.trim().length === 0) throw "Summary should not be empty";
      if(description.trim().length === 0) throw "Description should not be empty";
      if(locationInfo.trim().length === 0) throw "Location should not be empty";

      if(!(name.length >= 10 && name.length <= 45)) throw "Name must be between length 10 and 45";
      if(duration <= 0) throw "Duration should be greater than 0";
      if(maxGroupSize <= 0) throw "Max Group Size should be greater than 0";
      if(!(difficulty === "easy" || difficulty === "medium" || difficulty === "difficult")) throw "Difficulty should be either difficult,easy or medium";
      if(price <= 0) throw "Price should be greater than 0";
      if(!(files.length >= 1 && files.length <= 3)) throw "Your can provide minimum 1 and maximum 3 images";

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
    for (var i=0; i < files.length; i++) {
      form.append('images', files[i]);
    }
    form.append('locationImage', document.getElementById('locationImage').files[0])
    console.log(form);
    create(form);
    }
    catch(e) {
      alert(e)
    }
  });
}
  
  

if(updateForm){
  dd = today.getDate();
  mm = today.getMonth()+1; //January is 0 so need to add 1 to make it 1!
  yyyy = today.getFullYear();
  if(dd<10){
    dd='0'+dd
  } 
  if(mm<10){
    mm='0'+mm
  } 

  today1 = yyyy+'-'+mm+'-'+dd;
  document.getElementById("startDates").setAttribute("min", today1);
  updateForm.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('tourId').value
    const startDates = document.getElementById('startDates').value
    const name = document.getElementById('name').value
    const duration = document.getElementById('duration').value
    const maxGroupSize = document.getElementById('maxGroupSize').value
    const difficulty = document.getElementById('difficulty').value
    const price = document.getElementById('price').value
    const summary = document.getElementById('summary').value
    const description = document.getElementById('description').value
    const locationInfo = document.getElementById('locationInfo').value
    const imageCover = document.getElementById('imageCover').files[0]
    const files = document.getElementById('images').files;
    const locationImage = document.getElementById('locationImage').files[0];
    const form = new FormData();
    try {
      if(!startDates || !name || !duration || !maxGroupSize || !difficulty || !price || !summary || !description || !locationImage || !locationInfo ||!files || !imageCover) throw "One of the form field is not provided";
      const current = new Date();
      // if(!(startDates instanceof Date)) throw "Provide a proper date";
      if(typeof name !== "string") throw "Provide a proper name";
      if(typeof duration !== "string") throw "Provide a proper duration";
      if(typeof maxGroupSize !== "string") throw "Provide a proper max group size";
      if(typeof difficulty !== "string") throw "Provide a proper difficulty";
      if(typeof price !== "string") throw "Provide a proper price";
      if(typeof summary !== "string") throw "Provide a proper summary";
      if(typeof description !== "string") throw "Provide a proper description";
      if(typeof locationInfo !== "string") throw "Provide a proper location";

      // if(startDates < current) throw "Date should be after the current date";
      if(name.trim().length === 0) throw "Name should not be empty";
      if(summary.trim().length === 0) throw "Summary should not be empty";
      if(description.trim().length === 0) throw "Description should not be empty";
      if(locationInfo.trim().length === 0) throw "Location should not be empty";

      if(!(name.length >= 10 && name.length <= 45)) throw "Name must be between length 10 and 45";
      if(duration <= 0) throw "Duration should be greater than 0";
      if(maxGroupSize <= 0) throw "Max Group Size should be greater than 0";
      if(!(difficulty === "easy" || difficulty === "medium" || difficulty === "difficult")) throw "Difficulty should be either difficult,easy or medium";
      if(price <= 0) throw "Price should be greater than 0";
      if(!(files.length >= 1 && files.length <= 3)) throw "Your can provide minimum 1 and maximum 3 images";

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
      for (var i=0; i < files.length; i++) {
        form.append('images', files[i]);
      }
      form.append('locationImage', document.getElementById('locationImage').files[0])
      console.log(form);
      update(form, id);
    }
    catch(e) {
      alert(e);
    }
  });
}
  
  //var today = new Date();
  

  


if(reviewForm){
  reviewForm.addEventListener('submit', e=>{
    e.preventDefault();
    try {
      const review = document.getElementById('review').value
      const rating = document.getElementById('rating').value
      let reviewCheck = review.match(/^[0-9]+$/) != null
      if (!review.replace(/\s/g, '').length) {throw 'Review should not contain only spaces'}
      if(reviewCheck == true){
        throw 'Review cannot contain only numbers'
      }
      if(rating<=0 || rating>5){
        throw 'Rating must be between 1 to 5 inclusive'
      }
      const form = new FormData();
      form.append('review', document.getElementById('review').value)
      form.append('rating', document.getElementById('rating').value)
      const files = document.getElementById('reviewImage').files
      for (var i=0; i < files.length; i++) {
        form.append('reviewImage', files[i]);
      }
      console.log(form)
      createReview(form)
    }
    catch(e) {
      alert(e)
    }
  })
}
  