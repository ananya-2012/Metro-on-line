const imgDiv=document.querySelector('.user-img');
const img=document.querySelector('#photo');
const file=document.querySelector('#file');
const uploadbtn=document.querySelector('#uploadbtn');

file.addEventListener('change',function(){
    const chosedfile=this.file[0];
    if(chosedfile){
        const reader=new FileReader();

        reader.addEventListener('load',function(){
            img.setAttribute('src',reader.result);
        })
        reader.readAsDataURL(chosedfile);
    }
})

document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profileForm');
  
    profileForm.addEventListener('submit', function(event) {
      event.preventDefault();
      alert('Profile updated successfully!');
    });
  });
  var storedUsername = localStorage.getItem('username');
  if (storedUsername) {
    document.getElementById('username').innerText = storedUsername;
  }
  document.getElementById('profileForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    var fullName = document.getElementById('fullNameInput').value;
    document.getElementById('username').innerText = fullName;
  });