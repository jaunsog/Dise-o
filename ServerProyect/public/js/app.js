
function comparar(){
	
	var fecha_inicio = document.getElementById("date01").value;
    var fecha_final = document.getElementById("date02").value;
    const parrafo=document.getElementById("alerta")
    console.log(fecha_inicio);
    
	if (fecha_inicio > fecha_final){
        alert("Ingrese una rango de fechas válido")
        
        return false

	}else if (fecha_inicio=="" && fecha_final=="") { 
        alert("Rellene las fechas de inicio y fin");
    }
    else if (fecha_inicio=="" || fecha_final=="" ) { 
    alert("Rellene la fecha faltante");
    }
    
else{
    trazar();
}
}


var map;
var markers = [];
var centrar = [];
var polylinePlanCoordinates = [];
var path1;
var x = 0;
var i;
var o = 0;
var polylineLive = [];
var snappedPolyline

async function myFunction() {
	var coord = { lat: 10.9751485, lng: -74.8117453 };
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: coord
	});
	var marker = new google.maps.Marker({
		position: coord,
		map: map
	});
};

function iniciarMap() {
	let str;
	var coord1 = { lat: 10.972291426090106, lng: -74.40225011664694 };
	let latitud;
	let longitud;
	let time;
	var image = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Delivery-truck.svg/512px-Delivery-truck.svg.png"


	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 11,
		center: coord1
	});
	marker = new google.maps.Marker({
		map: map,
		icon: 'truck.ico',
		label: 2,

	});
	pathLive = new google.maps.Polyline({
		path: polylineLive,
		geodesic: true,
		strokeColor: '#0095b6',
		strokeOpacity: 1.0,
		strokeWeight: 2
	});
	pathLive.setMap(map);
	markers.push(marker);
	movimiento();
}

async function Centrado() {
	try {
		const ubic = await refresh();
		const coord = { lat: ubic.latitude, lng: ubic.longitude };
		map.setCenter(coord);
	} catch (error) { }
}

async function refresh() {
	const response = await fetch('/ruta', { method: 'GET' });
	const jsons = await response.json();
	console.log(jsons);
	return jsons;
}
async function movimiento() {
	try {
		const ubic = await refresh();
		const coord = { lat: ubic.latitude, lng: ubic.longitude };
		const i = 0;
		texto(ubic);
		markers[0].setPosition(coord);

		const path = pathLive.getPath();
		path.push(markers[0].getPosition());
		path.setMap(null);
		path.setMap(map);


	} catch (error) { }

	setTimeout(movimiento, 3000);
}

async function texto(ubic) {
	var ñ=ubic.latitude.toString().split('');
	var ññ=ubic.longitude.toString().split('');
	document.getElementById('latitude').innerHTML = "Latitud: " + ñ[0]+ñ[1]+ñ[2]+ñ[3]+ñ[4]+ñ[5];
	document.getElementById('longitude').innerHTML = "Longitud: " + ññ[0]+ññ[1]+ññ[2]+ññ[3]+ññ[4]+ññ[5];
	spltime = ubic.time.toString().split('');
	console.log(spltime)
	año = spltime[0] + spltime[1] + spltime[2] + spltime[3];
	mes = spltime[4] + spltime[5];
	dia = spltime[6] + spltime[7];
	hora = spltime[8] + spltime[9];
	minuto = spltime[10] + spltime[11];
	timestamp = + año + '-' + mes + '-' + dia + '. hora:' + hora + '-' + minuto + ".";
	document.getElementById("time").innerHTML = "Fecha: " + timestamp;


}
refresh();

async function trazar() {
	if (o == 1) {
		path1.setMap(null);
	}
	o=1;
	var d1 = document.getElementById("date01").value;
	d11 = d1.toString().split('-');
	var d1array = [];
	d1array[0] = d11[0];
	d1array[1] = d11[1];
	d111 = d11[2].split('T');
	d1array[2] = d111[0];
	d1111 = d111[1].split(':');
	d1array[3] = d1111[0];
	d1array[4] = d1111[1];

	var d2 = document.getElementById("date02").value;
	d22 = d2.toString().split('-');
	var d2array = [];
	d2array[0] = d22[0];
	d2array[1] = d22[1];
	d222 = d22[2].split('T');
	d2array[2] = d222[0];
	d2222 = d222[1].split(':');
	d2array[3] = d2222[0];
	d2array[4] = d2222[1];

	var totald1 = d1array[0] + '' + d1array[1] + '' + d1array[2] + '' + d1array[3] + '' + d1array[4];
	var totald2 = d2array[0] + '' + d2array[1] + '' + d2array[2] + '' + d2array[3] + '' + d2array[4];
	console.log(parseInt(totald1));
	console.log(totald2);
	polylinePlanCoordinates = [];
	total = { f: parseInt(totald1), l:parseInt(totald2)};
	const options ={
		method: "POST",
		body: JSON.stringify(total),
		headers: {
            "Content-Type": "application/json"
        }
	}
	console.log(options.body.f)
	console.log(options.body.l)
	const response = await fetch('/rango', options);
	const data = await response.json();
	data.forEach((object) => {
		var totalobject = object.time
		polylinePlanCoordinates.push({ lat: parseFloat(object.latitude), lng: parseFloat(object.longitude) });
	});

	// const response = await fetch('/baseDeDatos', { method: 'GET' });
	// const data = await response.json();
	
	// });
	path1 = new google.maps.Polyline({
		path: polylinePlanCoordinates,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 2
	});
	console.log(polylinePlanCoordinates);
	path1.setMap(map)
	
}



function limpiar() {
	path1.setMap(null);
	o=0;
}





