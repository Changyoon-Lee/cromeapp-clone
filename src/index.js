

const divTime = document.querySelector("#time");
const divDate = document.querySelector("#date");

function updateTime() {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString();
  const date = now.getDate().toString();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  divDate.innerText = `${year}년 ${month}월 ${date}일`;
  divTime.innerText = `${hours}:${minutes}:${seconds}`;
}

// 시간을 매분 바뀌게 해야 되기때문에 setInterval 기능을 활용해야한다
updateTime();
setInterval(updateTime, 1000);


// geolocation, weather
const weather = document.querySelector("#weather span:first-child");
const city = document.querySelector("#weather span:last-child");
const API_KEY = "409e8c18a45b452d7f7c87669236940c";

function onGeoOk(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      city.innerText = data.name;
      weather.innerText = `${data.weather[0].main} / ${Math.round(data.main.temp, 1)}˚C`;
    });
}
function onGeoError() {
  alert("Can't find you. No weather for you.");
}


navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);