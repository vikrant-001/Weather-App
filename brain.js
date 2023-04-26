const userTab = document.querySelector("[data-UserWeather]");
const searchTab = document.querySelector("[data-SearchWeather]");
const userContainer = document.querySelector(".weather-container");

const grandAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();


function swtichTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grandAccessContainer.classList.remove("active")
            searchForm.classList.add('active');
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener('click',() =>{
    swtichTab(userTab);
})

searchTab.addEventListener('click' , () =>{
    swtichTab(searchTab);
})

function getfromSessionStorage(){
    const localCordinates = sessionStorage.getItem("user-cordinates");
    if(!localCordinates){
        grandAccessContainer.classList.add("active");
    }
    else{
        const cordinates = JSON.parse(localCordinates);
        fetchUserWeatherInfo(cordinates);
    }
}

async function fetchUserWeatherInfo(cordinates){
    const {lat, lon} = cordinates;
    grandAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try{
        let result = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        
        let data = await result.json();
        
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
        
    }
    catch{
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDisc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");

    const windspeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudness = document.querySelector("[data-cloudiness]");

    // use fetched data to fill the values;

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src =`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = weatherInfo?.wind?.speed;
    humidity.innerText = weatherInfo?.main?.humidity;
    cloudness.innerText = weatherInfo?.clouds?.all;

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    else{
        alert("this is not the location");
    }
}

function showPosition(position){
    const userCordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }
    sessionStorage.setItem("user-cordinates",JSON.stringify(userCordinates));
    fetchUserWeatherInfo(userCordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput = document.querySelector("[data-searchInput]");


searchForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    let cityname = searchInput.value;
    console.log("eha tak thik ba2")
    if(cityname === "")
        return;
    else
        fetchSearchWeatherInfo(cityname);

})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grandAccessContainer.classList.remove("active");
    

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        console.log("eha tak thik ba3")
        renderWeatherInfo(data);  
    }

    catch(err) {
        loadingScreen.classList.remove("active")
    }
}


