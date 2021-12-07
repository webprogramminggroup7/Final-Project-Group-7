/* eslint-disable */

import { login} from './login';

const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');



if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });



const logout = async () => {
    try{
      const res = await axios({
        method: 'GET',
        url: 'travel-bliss/users/logout'
      });
      if ((res.data.status = 'success')){
        location.assign('/all-tours');
      } //location.reload(true);
    } catch(err){
      showAlert('error', 'Error logging out! Try again.');
    }
}