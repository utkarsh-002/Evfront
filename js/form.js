function collect() {
    let name = document.getElementById('station').value.trim();
    let phNo = document.getElementById('phNo').value.trim();
    let openstatus = document.getElementById('openstatus').value.trim();
    let slot = document.getElementById('slot').value.trim();
    let addressLine = document.getElementById('addressLine').value.trim();
    let postalCode = document.getElementById('postalCode').value.trim();
    let city = document.getElementById('city').value.trim();
    let state = document.getElementById('state').value.trim();
    let latitude = document.getElementById('lat').value.trim();
    let longitude = document.getElementById('lng').value.trim();
    let type = document.getElementById('type').value.trim();
    const API_URL = "https://evlocation.herokuapp.com/api/stations';
    // let add = {"streetAddressLine": name,
    // "city": city,
    // "State": state,
    // "countryCode": "India",
    // "postalCode": postalCode}
    // console.log(add);

    const fullUrl = `${API_URL}?name=${name}&phno=${phNo}&openstatus=${openstatus}&slot=${slot}&state=${state}&postalCode=${postalCode}&streetAddressLine=${name}&city=${city}&addressLine=${addressLine}&latitude=${latitude}&longitude=${longitude}&type=${type}`;
    console.log(fullUrl);
    fetch(fullUrl,{
        method:"POST"
    }).then((response)=>{
        if(response.status == 200){
            console.log(response.json);
            return response.json();
        }
        else
            throw new Error(response.status);
    }).then((json=>console.log(json)));

    
}