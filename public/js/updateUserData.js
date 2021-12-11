const updateSettings = async (data) => {
    try {
  
      const res = await axios({
        method: 'PATCH',
        url:'/travel-bliss/users/updateMyData',
        data
      });
      // console.log(res)
      if (res.data.status === 'successful in updating the name or email') {
        alert(`successfully updated name or/and email`);
      }
    } catch (err) {
      console.log(err.response.data.message.message)
      alert(err.response.data.message.message);
    }}
const userDataForm = document.querySelector('.form-user-data')
if (userDataForm){
  userDataForm.addEventListener('submit', e => {
 e.preventDefault();
 const form = new FormData();
 form.append('name', document.getElementById('name').value);
 form.append('email', document.getElementById('email').value);
 form.append('photo', document.getElementById('photo').files[0]); 
// console.log(name,email)
updateSettings(form);

      });
}
const updatePassword = async (passwordCurrent, passwordConfirm,password) => {
  try {
    // const url =
    //   type === 'password'
    //     ? '/travel-bliss/users/updatePassword'
    //     : '/travel-bliss/users/updateMyData';

    const res = await axios({
      method: 'PATCH',
      url:'/travel-bliss/users/updatePassword',
      data:{
        passwordConfirm,passwordCurrent,password
      }
    });
    // console.log(res)
    if (res.data.status === 'Succesfully Logged In') {
      alert(`successfully updated the Password!`);
      location.reload()
    }else{
      alert(`${res.data.message}!`);

    }
    console.log(res.data.message)
  } catch (err) {
    if(err.response.data.message==="Your current password is wrong"){
      alert(err.response.data.message);
    }else{
      console.log(err.response.data.message)
      alert(err.response.data.message.message);
    }
    console.log(err.response.data.message)
  }}
  const userPasswordForm = document.querySelector('.form-user-password')
  if (userPasswordForm){
    userPasswordForm.addEventListener('submit', e => {
   e.preventDefault();
  const passwordCurrent= document.getElementById('password-current').value;
  const password = document.getElementById('password').value;

  const passwordConfirm = document.getElementById('password-confirm').value;
  // console.log(name,email)
  updatePassword( passwordCurrent,passwordConfirm,password );
        });
  }
//update PHooto











