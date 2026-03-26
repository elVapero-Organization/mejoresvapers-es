
const city = document.getElementById("city");
const cont = document.querySelectorAll(".foot-cont-three a");
city.addEventListener("click", toggleCont);
function toggleCont() {
  city.classList.toggle("active");
  Array.from(cont).forEach((el) => {
    el.style.display = el.style.display === "block" ? "none" : "block";
  });
}

const yearSpan = document.querySelector('#year');
if (yearSpan) {
    yearSpan.innerText = new Date().getFullYear();
}