//Alertas Para Rangos Temporales
function comparar() {
	console.log("holallalala")
	var fecha_inicio = document.getElementById("date01").value;
	var fecha_final = document.getElementById("date02").value;

	if (fecha_inicio > fecha_final) {
		alert("Ingrese una rango de fechas válido")

		return false

	} else if (fecha_inicio == "" && fecha_final == "") {
		alert("Rellene las fechas de inicio y fin");
	}
	else if (fecha_inicio == "" || fecha_final == "") {
		alert("Rellene la fecha faltante");
	}
	else if (document.getElementById("cr1").innerHTML == "camion1:inactivo" && document.getElementById("cr2").innerHTML == "camion2:inactivo") {
		alert("Los dos camiones están inactivos, activelos")
	}

	else {
		trazar();
	}
}

//Definición de Variables
var map;
var markernew = [];
var markers = [];
var centrar = [];
var polylinePlanCoordinates = [];
var path1;
var x = 0;
var i;
var o = 0;
var polylineLive0 = [];
var polylineLive1 = [];
var snappedPolyline;
var g = 0;
var caract0 = 0;
var caract1 = 0;
var h = 0;
var allFechas = [];
var polylinePlanCoordinates1 = [];
var allFechas1 = [];
var polylinePlanCoordinates2 = [];
var allFechas2 = [];
var InfoWindows = [];


//Inicio
function iniciarMap() {
	//Inicio del Mapa
	var coord1 = { lat: 10.972291426090106, lng: -74.40225011664694 };
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 11,
		center: coord1
	});
	//Inicio del Marker1
	marker = new google.maps.Marker({
		map: map,
		icon: 'truck.ico',
		label: 2,
		position: null,

	});
	//Inicio del Path1
	pathLive0 = new google.maps.Polyline({
		path: polylineLive0,
		geodesic: true,
		strokeColor: '#0095b6',
		strokeOpacity: 1.0,
		strokeWeight: 2
	});
	pathLive0.setMap(map);
	markers.push(marker);

	//InfoWindow1
	var mark0 = markers[0];
	mark0.setPosition(null);
	var contentString1 = '1';
	InfoWindows[0] = new google.maps.InfoWindow({
		content: contentString1,
		disableAutoPan: true

	});
	InfoWindows[0].open(map, markers[0]);
	markers[0].addListener("click", () => {
		InfoWindows[0].open(map, markers[0]);
	});
	//Inicio Marker2
	marker = new google.maps.Marker({
		map: map,
		icon: 'truck.ico',
		label: 2,
		position: null,
	});
	markers.push(marker);
	//Inicio del Path2
	pathLive1 = new google.maps.Polyline({
		path: polylineLive1,
		geodesic: true,
		strokeColor: '#0095b6',
		strokeOpacity: 1.0,
		strokeWeight: 2
	});
	pathLive1.setMap(map);
	//InfoWindow2
	var mark1 = markers[1];
	mark1.setPosition(null);
	var contentString1 = '2';
	InfoWindows[1] = new google.maps.InfoWindow({
		content: contentString1,
		disableAutoPan: true
	});
	InfoWindows[1].open(map, markers[1]);
	markers[1].addListener("click", () => {
		InfoWindows[1].open(map, markers[1]);
	});
	movimiento();


}
//Centrado1
async function center1() {
	try {
		x = markers[0].getPosition()
		map.setCenter(x);
	} catch (error) {
		console.log(error)
	}
}
//Centrado2
async function center2() {
	try {
		x = markers[1].getPosition()
		map.setCenter(x);
	} catch (error) {
		console.log(error)
	}
}
//Recibido Del último Dato
async function refresh() {
	const response = await fetch('/ruta', { method: 'GET' });
	const jsons = await response.json();
	console.log(jsons);
	return jsons;
}
//Actualización de la ubicación
async function movimiento() {
	try {
		const ubic = await refresh();
		texto(ubic);
		var strtime = ubic.time.toString().split("")
		var infowindow1 = InfoWindows[parseInt(ubic.car)];
		if (ubic.var == undefined) {
			ubic.var = "--"
		}
		infowindow1.setContent("#:" + ubic.car + " Tiempo:" + strtime[6] + strtime[7] + "-" + strtime[4] + strtime[5] + "-" + strtime[2] + strtime[3] + " hora:" + strtime[8] + strtime[9] + ":" + strtime[10] + strtime[11] + " V:" + ubic.var);
		if (document.getElementById("cr1").innerHTML == "camion1:activo" || document.getElementById("cr2").innerHTML == "camion2:activo") {
			if ((parseInt(ubic.car) == 0) && document.getElementById("cr1").innerHTML == "camion1:activo") {
				const coord = { lat: ubic.latitude, lng: ubic.longitude };
				markers[parseInt(ubic.car)].setPosition(coord);
				const path0 = pathLive0.getPath();
				path0.push(markers[parseInt(ubic.car)].getPosition());
				path0.setMap(null);
				path0.setMap(map);

			} else { }
			if ((parseInt(ubic.car) == 1) && document.getElementById("cr2").innerHTML == "camion2:activo") {
				const coord = { lat: ubic.latitude, lng: ubic.longitude };
				markers[parseInt(ubic.car)].setPosition(coord);
				const path1 = pathLive1.getPath();
				path1.push(markers[parseInt(ubic.car)].getPosition());
				path1.setMap(null);
				path1.setMap(map);
			} else {

			}
		} else {

		}

	} catch (error) { }

	setTimeout(movimiento, 3000);
}

async function texto(ubic) {
	spltime = ubic.time.toString().split('');
	año = spltime[0] + spltime[1] + spltime[2] + spltime[3];
	mes = spltime[4] + spltime[5];
	dia = spltime[6] + spltime[7];
	hora = spltime[8] + spltime[9];
	minuto = spltime[10] + spltime[11];
	timestamp = + dia + '-' + mes + '-' + spltime[2] + spltime[3] + ' hora:' + hora + ':' + minuto + ".";
	if (parseInt(ubic.car) == 0) {
		document.getElementById("timec1").innerHTML = "Visto: " + timestamp;
		document.getElementById("varhis1").innerHTML = "Variable: "+ ubic.var;

	} else {
		document.getElementById("timec2").innerHTML = "Visto: " + timestamp;
		document.getElementById("varhis2").innerHTML =  "Variable: "+ubic.var
	}

}
refresh();
async function c1() {
	if (document.getElementById("cr1").innerHTML == "camion1:inactivo") {
		document.getElementById("cr1").innerHTML = "camion1:activo";
	} else {
		document.getElementById("cr1").innerHTML = "camion1:inactivo";
		var mark0 = markers[0];
		mark0.setPosition(null);
		pathLive0.setMap(null);
		pathLive0 = new google.maps.Polyline({
			path: polylineLive0,
			geodesic: true,
			strokeColor: '#0095b6',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});
		pathLive0.setMap(map);
	}
}
async function c2() {
	if (document.getElementById("cr2").innerHTML == "camion2:inactivo") {
		document.getElementById("cr2").innerHTML = "camion2:activo";
		
	} else {
		document.getElementById("cr2").innerHTML = "camion2:inactivo";
		var mark1 = markers[1];
		mark1.setPosition(null);
		pathLive1.setMap(null);
		pathLive1 = new google.maps.Polyline({
			path: polylineLive1,
			geodesic: true,
			strokeColor: '#0095b6',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});
		pathLive1.setMap(map);
	}
}

