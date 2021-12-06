const updateSettings = async (data, type) => {
    try {
      const url =
        type === 'password'
          ? '/travel-bliss/users/updatePassword'
          : '/travel-bliss/users/updateMyData';
  
      const res = await axios({
        method: 'PATCH',
        url,
        data
      });
      console.log(res);
      if (res.data.status === 'success') {
        alert(`success'${type.toUpperCase()} updated successfully!`);
      }
    } catch (err) {
      alert(err.response.data.message);
    }}
if (userDataForm){
  userDataForm.addEventListener('submit', e => {
 e.preventDefault();
const name = document.getElementById('name').value;
const email = document.getElementById('email').value;
const photo = document.getElementsById('photo').file;
console.log(name);
console.log(email);
console.log(photo);
updateSettings({ name, email, photo}, 'data');
});
}
