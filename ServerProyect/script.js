function iniciarMap(){
  var coord = {lat:latitud ,lng:longitud};
  var map = new google.maps.Map(document.getElementById('map'),{
    zoom: 50,
    center: coord
  });
  var marker = new google.maps.Marker({
    position: coord,
    map: map
  });
};