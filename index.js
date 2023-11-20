const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector(".form-container");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const errorFound =document.querySelector(".error");
// ------------------variables-----------------------------
let oldTab=userTab;

const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getFromSessionStorage();

userTab.addEventListener("click",()=>{
    switchTab(userTab)
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});
async function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");
    
        if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
        }
        else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getFromSessionStorage(); 
        }
    }
}
function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
    const {lati,longi}=coordinates;  //this method is called obj. destructing
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    errorFound.classList.remove("active");

    try{
        const response = await fetch (`https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${longi}&appid=${API_KEY}&units=metric`);
        const data = await response.json ();
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        console.log("error in fetch user weather",err);
    }
    finally{
        loadingScreen.classList.remove("active");
    }
}
function renderWeatherInfo(data){
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon =document.querySelector("[data-countryIcon]");
    const description =document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temperature= document.querySelector("[data-temp]");
    const windSpeed= document.querySelector("[data-windSpeed]");
    const humidity= document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    cityName.innerHTML=data?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    description.innerHTML=data?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temperature.innerHTML=`${data?.main?.temp}°C`;
    windSpeed.innerHTML=`${data?.wind?.speed} m/s`;
    humidity.innerHTML=`${data?.main?.humidity}%`;
    cloudiness.innerHTML=`${data?.clouds?.all}%`;
}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert('No geolocation support available');
    }
}
function showPosition(position){
    const userCoordinates={
        lati:position.coords.latitude,
        longi:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
     fetchUserWeatherInfo(userCoordinates);
}

const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    // let cityName=e.target.value;
    let city=searchInput.value;
    console.log(city);
    if(city===""){
        return;
    }
    else{
        fetchSearchWeatherInfo(city);
    }
})
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        userInfoContainer.classList.add("active");
        errorFound.classList.remove("active");
        console.log(data);
        if(!response.ok){
            userInfoContainer.classList.remove("active");
            errorFound.classList.add("active");
            console.log("error aa gya re baba");
        }
        else{
            errorFound.classList.remove("active");
        }
        renderWeatherInfo(data);
    }
    catch(err){
        console.log("error in fetchsearcg weather",err);
    }
    finally{
        loadingScreen.classList.remove("active");
    }
}