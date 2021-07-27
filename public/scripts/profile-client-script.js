  
  var navbar = document.getElementById('nav-bar');
  
  //Sticky Navbar
  var sticky = navbar.offsetTop;

  window.onscroll = () => {
    if (window.pageYOffset >= sticky) {
      navbar.classList.add("sticky");
    } else {
      navbar.classList.remove("sticky");
    }
  }

 //Background Music Toggle
 var musicbtn = document.getElementById("bgmusicbtn");
 var bgmusic = document.getElementById("bgmusic");

 musicbtn.onclick = () => {
   bgmusic.play();
 }  

 //Modal box for profile pic change
 var profilemodal = document.getElementById("profilemodal");
 var changedp = document.getElementById("changedp");
 var span = document.getElementsByClassName("closeprofile")[0];
 var dp0 = document.getElementsByClassName("profileimg")[0];
 var dp1 = document.getElementsByClassName("profileimg")[1];
 var dp2 = document.getElementsByClassName("profileimg")[2];
 var dp3 = document.getElementsByClassName("profileimg")[3];
 var dp4 = document.getElementsByClassName("profileimg")[4];
 var dp5 = document.getElementsByClassName("profileimg")[5];
 var dp6 = document.getElementsByClassName("profileimg")[6];
 var profilepic = document.getElementById("profile-pic");
 var profilepicheader = document.getElementById("profile-pic-header");


changedp.onclick = () => {
  profilemodal.style.display = "block";
}

span.onclick = () => {
  profilemodal.style.display = "none";
}

window.onclick = (event) => {
  if (event.target == profilemodal) {
    profilemodal.style.display = "none";
  }
}