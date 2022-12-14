 var map;
 var ramaiah = {lat: 13.0306, lng: 77.5649};
 var infoWindow ;
 var markers = [];
 var fStations = [];
 const date = new Date();
 var currDate = date.getDate();
function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
         center: ramaiah,
        zoom: 9
    });
    var marker = new google.maps.Marker({
        position: ramaiah,
         map: map,
         label: '$'
        });
        infoWindow = new google.maps.InfoWindow();
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
 }

 const onEnter = (e)=> {
    if(e.key == "Enter"){
        getStations();
    }
 }

 const getStations = ()=>{
    const zipCode = document.getElementById("zip-code").value;
    if(!zipCode){
        return;
    }
    const API_URL = 'https://evlocation.herokuapp.com/api/stations';
    const fullUrl = `${API_URL}?zip_code=${zipCode}`;
    fetch(fullUrl).then((response)=>{
        if(response.status == 200){
            return response.json();
        }
        else
            throw new Error(response.status);
    }).then((data)=>{
        if(data.length> 0){
            fStations= data;
            clearLocations();
            searchLocationNear(data);
            setStoreList(data);
            setOnClickListener();
        }
        else{
            clearLocations();
            noStationsFound();
        }
        
    })
 }

 const currStations = ()=>{
    const API_URL = 'https://evlocation.herokuapp.com/api/currStations';
    let coordinates = ramaiah;
    const fullUrl = `${API_URL}?longitude=${coordinates.lng}&latitude=${coordinates.lat}`;
    fetch(fullUrl).then((response)=>{
        if(response.status == 200)
            return response.json();
        else
            throw new Error(response.status);
    }).then((data)=>{
        if(data.length> 0){
            fStations=data;
            clearLocations();
            searchLocationNear(data);
            setStoreList(data);
            setOnClickListener();
        }
        else{
            clearLocations();
            noStationsFound();
        }
        
    })
 };

 const distRange = () => {
    let dist = document.getElementById("quantity").value * 1000;
    let coordinates = ramaiah;
    const API_URL = 'https://evlocation.herokuapp.com/api/distRange';
    const fullUrl = `${API_URL}?range=${dist}&longitude=${coordinates.lng}&latitude=${coordinates.lat}`;
    fetch(fullUrl).then((response)=>{
        if(response.status == 200)
            return response.json();
        else
            throw new Error(response.status);
    }).then((data)=>{
        if(data.length> 0){
            fStations=data;
            clearLocations();
            searchLocationNear(data);
            setStoreList(data);
            setOnClickListener();
        }
        else{
            clearLocations();
            noStationsFound();
        }
    })
 };

const reserve = () => {
    let n = document.getElementById("slotid").innerText;  
    if(n>0){
        n = n-1;
        document.getElementById("slotid").innerText = n;
        currDate=date.getDate;
        generate(n+currDate);
    }
    else{
        if(currDate<date.getDate())
            document.getElementById("slotid").innerText=4;
    }
       
}

const generate= (x)=>{
    document.querySelector("#qr-image").style.display = "block";
    document.querySelector("#img").style.display="block";
    document.querySelector("#qr-image .error").innerHTML="";
    document.querySelector("#img").src="https://api.qrserver.com/v1/create-qr-code/?size=100*100&data="+x;
}

const clearLocations = () =>{
    infoWindow.close();
    for(var i =0;i<markers.length;i++){
        markers[i].setMap(null);
    }
    markers.length = 0;
    var marker = new google.maps.Marker({
        position: ramaiah,
         map: map,
         label: '$'
        });
        infoWindow = new google.maps.InfoWindow();
}

const noStationsFound = () => {
    const html = `
        <div class= "no-stations-found">No Stations Found
        </div>
    `
    document.querySelector('.stations-list').innerHTML = html;
}

 const setOnClickListener = ()=>{
    let storeElements = document.querySelectorAll('.container');
    storeElements.forEach((elem, index)=>{
        elem.addEventListener('click',()=>{
            google.maps.event.trigger(markers[index],'click');
        })
    })
 }

 const setStoreList = (stations) => {
    let stationsHtml = '';
    stations.forEach((station, index)=>{
        stationsHtml +=`
        <div class="container">
            <div class="container-bg">
                <div class="info">
                    <div class="address">
                        <span>${station.addressLines[0]}</span>
                    </div>
                    <div class="phone">${station.phoneNumber}</div>
                </div>
                <div class="num-container">
                <div class="number">${index+1}</div>
                </div>
            </div>
         </div>
        `
    })
    document.querySelector('.stations-list').innerHTML = stationsHtml;
 }
 const searchLocationNear = (stations) => {
    let bounds  = new google.maps.LatLngBounds();
    stations.forEach((station,index) => {
        let latlng = new google.maps.LatLng(
            station.location.coordinates[1],
            station.location.coordinates[0]);
        let name = station.stationName;
        let address = station.addressLines[0];
        let phone = station.phoneNumber;
        let openStatusText = station.openStatusText;
        let lng1 =station.location.coordinates[1];
        let lat1=station.location.coordinates[0];
        let slot = station.slots;
        bounds.extend(latlng);
        createMarker(latlng, name, address, openStatusText, phone, lng1,lat1,slot,index+1);
    });
    map.fitBounds(bounds);
 }

 const createMarker = (latlng, name, address,openStatusText, phone,lng1,lat1,slot,stationNumber) =>{
    let html = `
        <div class="info-window">
            <div class="station-name">${name}</div>
            <div class="open-status">${openStatusText}</div>
            <div class="stations-address">
            <div class="icon"><i class="fa-solid fa-location-crosshairs"></i></div>
            <span><a href="https://www.google.com/maps/dir/?api=1&origin=${ramaiah.lat},${ramaiah.lng}&destination=${lng1},${lat1}" target="_blank">${address}</a></span>
            </div>
            <div class="stations-phone">
            <div class="icon"><i class="fa-solid fa-phone"></i></div>
            <span><a href="tel:${phone}">${phone}</span>
            </div>
            <div class="stations-reserve">
            <div class="icon"><i class="fas fa-shuttle-van"></i></div>
            <span><a href ="#">Slots available-<span id="slotid"> ${slot}</span></a></span>
        </div>
        <button class="reserveBtn" onclick="reserve()">reserve slot</button>
        <div id="qr-image"><span class="error"></span><br/>
        <img src="" id="img"/></div>
    `;
  var marker = new google.maps.Marker({
        position: latlng,
         map: map,
         label: `${stationNumber}`
        });
    google.maps.event.addListener(marker,'click',function(){
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    })
    markers.push(marker);
 };

const currLocation = ()=> {
    if(navigator.geolocation)
                navigator.geolocation.getCurrentPosition(function(position){
                    let curr = {lat:position.coords.latitude,lng:position.coords.longitude}
                    ramaiah = curr;
                    currStations();
                    initMap();
                });
};

const currRange = ()=> {
    if(navigator.geolocation)
                navigator.geolocation.getCurrentPosition(function(position){
                    let curr = {lat:position.coords.latitude,lng:position.coords.longitude}
                    ramaiah = curr;
                    distRange();
                    initMap();
                });
};

const captype=() => {
    var e = document.getElementById("capId");
    var opt = e.options[e.selectedIndex].value;
    var arrayStation = [];
    fStations.forEach((station)=>{
        if(station.type[0] == opt){
            console.log("inside catype")
            arrayStation.push(station);
        }
        clearLocations();
        searchLocationNear(arrayStation);
        setStoreList(arrayStation);
        setOnClickListener();
    });
};
 

 