
// Age verification modal
const ageModal = document.getElementById("ageModal");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

window.addEventListener("load", () => {
  if (localStorage.getItem("ageConfirmed") != "true") {
    ageModal.style.display = "flex";
  } else {
    ageModal.style.display = "none";
  }
});

yesBtn.addEventListener("click", () => {
  localStorage.setItem("ageConfirmed", "true");
  ageModal.style.display = "none";
});

noBtn.addEventListener("click", () => {
  alert("Acceso prohibido. Esta página es solo para mayores de 18 años.");
  window.close();
  window.location.href = "https://www.google.es";
});

// Hide the top warning when the page is scrolled
const navBar = document.querySelector(".navbar");
if (navBar) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 14) {
      navBar.style.top = "0";
    } else {
      navBar.style.top = "40px";
    }
  });
}



