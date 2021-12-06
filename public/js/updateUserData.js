const updateSettings = async (name, email) => {
    try {
  
      const res = await axios({
        method: 'PATCH',
        url:'/travel-bliss/users/updateMyData',
        data:{
          name,email
        }
      });
      // console.log(res)
      if (res.data.status === 'successful in updating the name or email') {
        alert(`successfully updated updated successfully!`);
      }
    } catch (err) {
      console.log(err.response.data.message.message)
      alert(err.response.data.message.message);
    }}
const userDataForm = document.querySelector('.form-user-data')
if (userDataForm){
  userDataForm.addEventListener('submit', e => {
 e.preventDefault();
const name = document.getElementById('name').value;
const email = document.getElementById('email').value;
// console.log(name,email)
updateSettings( name, email);

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
    }else{
      alert(`${res.data.message}!`);

    }
    console.log(res.data.message)
  } catch (err) {
    if(err.response.data.message==="Your current password is wrong"){
      alert(err.response.data.message);

    }else{
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











