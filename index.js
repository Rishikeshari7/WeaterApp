
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
async function showWeather(){
    try {
        let city="goa";
    const response = await fetch (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await  response.json();
    console.log("Response->",response);
    console.log("Data->",data);

    // let newPara = document.createElement('p');
    // newPara.textContent=`Temperature= ${data.main.temp}°C`;
    // document.body.appendChild(newPara);
    // console.log(data.main.temp)
    renderData(data,city);
    }
    catch(error){
        console.log("error in fetching",error);  
    }
}
showWeather();
async function  renderData (dta,cty){
    let tempHead=document.createElement('h3');
    tempHead.textContent=`Temperature at ${cty} is ${dta.main.temp}°C`;
    document.body.appendChild(tempHead);
}
 function myPosition (position){
    let lat=position.coords.latitude;
    let longi=position.coords.longitude;
    console.log(lat);
    console.log(longi);
}
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
}