function myFunction() {
  document.getElementById("demo").innerHTML = "Hello World";
}


function iniciarMap(){
  var coord = {lat:10.7961683 ,lng:-74.9156950};
  var map = new google.maps.Map(document.getElementById('map'),{
    zoom: 50,
    center: coord
  });
  var marker = new google.maps.Marker({
    position: coord,
    map: map
  });
};