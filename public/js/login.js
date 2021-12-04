// import axios from 'axios';
// const { showAlert } =require('./alerts');

const login = async (email, password) => {
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
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
      alert(err)
    // showAlert('error', err.response.data.message);
  }
};

const signup = async (email, name, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/travel-bliss/users/signup',
      data: {
        email,
        name,
        password,
        passwordConfirm
      }
    });
    console.log(res.data)
    if (res.data.status === 'Successfully signed up New User') {
      alert('Succesfully created user')
  //   showAlert('success', 'Logged in successfully!');
    window.setTimeout(() => {
      location.assign('/');
    }, 1500);
  }
} catch (err) {
    alert(err)
  // showAlert('error', err.response.data.message);
}
};

const logout = async () => {
  try{
    const res = await axios({
      method: 'GET',
      url: 'travel-bliss/users/logout'
    });
    if ((res.data.status = 'success')){
      alert('Logged out successfully!')
      location.assign('/');
    } //location.reload(true);
  } catch(err){
    showAlert('error', 'Error logging out! Try again.');
  }
}

const loginForm = document.querySelector('.form--login');

const logOutBtn = document.querySelector('.nav__el--logout');

const SignUpForm = document.querySelector('.form--signup');

if (logOutBtn) logOutBtn.addEventListener('click', logout);


if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email)
    console.log(password)
    login(email, password);
  });

if (SignUpForm)
  SignUpForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    console.log(name);
    console.log(email);
    console.log(password);
    console.log(confirmPassword);
    signup(email, name, password, confirmPassword);
  });

