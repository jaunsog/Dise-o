
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
	else if(document.getElementById("cr1").innerHTML == "camion1:inactivo" && document.getElementById("cr2").innerHTML == "camion2:inactivo"){
		alert("Los dos camiones están inactivos, activelos")
	}

	else {
		trazar();
	}
}


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

async function myFunction() {
	var coord = { lat: 10.9751485, lng: -74.8117453 };
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: coord
	});

};

function iniciarMap() {

	var coord1 = { lat: 10.972291426090106, lng: -74.40225011664694 };

	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 11,
		center: coord1,
		disableDefaultUI: true
	});
	marker = new google.maps.Marker({
		map: map,
		icon: 'truck.ico',
		label: 2,
		position: null,

	});


	pathLive0 = new google.maps.Polyline({
		path: polylineLive0,
		geodesic: true,
		strokeColor: '#0095b6',
		strokeOpacity: 1.0,
		strokeWeight: 2
	});
	pathLive0.setMap(map);
	pathLive1 = new google.maps.Polyline({
		path: polylineLive1,
		geodesic: true,
		strokeColor: '#0095b6',
		strokeOpacity: 1.0,
		strokeWeight: 2
	});
	pathLive1.setMap(map);
	markers.push(marker);
	marker = new google.maps.Marker({
		map: map,
		icon: 'truck.ico',
		label: 2,
		position: null,
	});
	markers.push(marker);
	var mark0 = markers[0];
	mark0.setPosition(null);
	var contentString1 =
		'<div id="content">' +
		'<h4 id="firstHeading" class="firstHeading">1</h4>' +
		"</div>";
	var infowindow0 = new google.maps.InfoWindow({
		content: contentString1,

	});
	mark0.addListener("click", () => {
		infowindow0.open(map, markers[0]);
	});

	var mark1 = markers[1];
	mark1.setPosition(null);
	var contentString1 =
		'<div id="content">' +
		'<h4 id="firstHeading" class="firstHeading">2</h4>' +
		"</div>";
	var infowindow1 = new google.maps.InfoWindow({
		content: contentString1,

	});
	mark1.addListener("click", () => {
		infowindow1.open(map, markers[1]);
	});
	movimiento();
}

async function Centrado() {
	try {
		const ubic = await refresh();
		const coord = { lat: ubic.latitude, lng: ubic.longitude };
		map.setCenter(coord);
	} catch (error) { }
}
async function center1() {
	try {
		x = markers[0].getPosition()
		map.setCenter(x);
	} catch (error) {
		console.log(error)
	}
}
async function center2() {
	try {
		x = markers[1].getPosition()
		map.setCenter(x);
	} catch (error) {
		console.log(error)
	}
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
		texto(ubic);
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
	var ñ = ubic.latitude.toString().split('');
	var ññ = ubic.longitude.toString().split('');
	spltime = ubic.time.toString().split('');

	año = spltime[0] + spltime[1] + spltime[2] + spltime[3];
	mes = spltime[4] + spltime[5];
	dia = spltime[6] + spltime[7];
	hora = spltime[8] + spltime[9];
	minuto = spltime[10] + spltime[11];
	timestamp = + dia + '-' + mes + '-' + spltime[2] + spltime[3] + '--' + hora + ':' + minuto + ".";
	if (parseInt(ubic.car) == 0) {
		document.getElementById("timec1").innerHTML = "Visto(centrar): " + timestamp;
	} else {
		document.getElementById("timec2").innerHTML = "Visto(centrar): " + timestamp;
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
async function trazar() {
	g = 0;
	if (o == 1) {
		try {
			path1.setMap(null);
			var mark = markernew[0];
			mark.setMap(null);

		} catch (Error) { }

	
		try {
			path2.setMap(null);
			var mark = markernew[1];
			mark.setMap(null);
		} catch (Error) { }
	}

	o = 1;
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
	polylinePlanCoordinates1 = [];
	allFechas1 = [];
	polylinePlanCoordinates2 = [];
	allFechas2 = [];
	const icon = {
		url: 'camion.png', // url
		scaledSize: new google.maps.Size(40, 40), // scaled size
		origin: new google.maps.Point(5, 5), // origin
		anchor: new google.maps.Point(9, 9) // anchor
	};
	const icon1 = {
		url: 'camion1.png', // url
		scaledSize: new google.maps.Size(40, 40), // scaled size
		origin: new google.maps.Point(5, 5), // origin
		anchor: new google.maps.Point(9, 9) // anchor
	};
	const movmarker1 = new google.maps.Marker({
		position: null,                     ////ESTOOOOOOOOOO
		map: map,
		icon: icon,
	});
	const contentString1 =
		'<div id="content">' +
		'<h4 id="firstHeading" class="firstHeading">1</h4>' +
		"</div>";
	const infowindow0 = new google.maps.InfoWindow({
		content: contentString1,

	});

	movmarker1.addListener("click", () => {
		infowindow0.open(map, movmarker1);
	});
	const movmarker2 = new google.maps.Marker({
		position: null,                     ////ESTOOOOOOOOOO

		map: map,
		icon: icon1,
	});
	const contentString2 =
		'<div id="content">' +
		'<h4 id="firstHeading" class="firstHeading">2</h4>' +
		"</div>";
	const infowindow1 = new google.maps.InfoWindow({
		content: contentString2,

	});
	movmarker2.addListener("click", () => {
		infowindow1.open(map, movmarker2);
	});




	if (document.getElementById("cr1").innerHTML == "camion1:activo") {
		var car1 = 0;
		op1 = { f: parseInt(totald1), l: parseInt(totald2), c: car1 };
		const options = {
			method: "POST",
			body: JSON.stringify(op1),
			headers: {
				"Content-Type": "application/json"
			}
		}
		console.log(options.body.f)
		console.log(options.body.l)
		const response = await fetch('/rango', options);
		const data = await response.json();
		data.forEach((object) => {
			polylinePlanCoordinates1.push({ lat: parseFloat(object.latitude), lng: parseFloat(object.longitude) });
		});
		data.forEach((object) => {
			allFechas1.push(parseInt(object.time));
		});
		if (Object.keys(data).length == 0) {
			alert("No se encontraron registros para el camion 1 en las fechas seleccionadas")
		} else {

			path1 = new google.maps.Polyline({
				path: polylinePlanCoordinates1,
				geodesic: true,
				strokeColor: '#FF0000',
				strokeOpacity: 1.0,
				strokeWeight: 2
			});
			console.log(polylinePlanCoordinates1);
			path1.setMap(map)
			markernew[0] = movmarker1;
			slider = document.getElementById("myRange1");
			slider.min = `${0}`;
			slider.max = `${polylinePlanCoordinates1.length - 1}`;
			slider.oninput = function () {
				if (g == 0) {
					var index = parseInt(this.value);
					const sdate = allFechas1[index];
					markernew[0].setPosition(polylinePlanCoordinates1[index])
					console.log(allFechas1[index])
					hora = allFechas1[index].toString().split("");
					hora[0] = hora[0] + hora[1] + hora[2] + hora[3] + "-" + hora[4] + hora[5] + "-" + hora[6] + hora[7] + " hora:" + hora[8] + hora[9] + ":" + hora[10] + hora[11]
					document.getElementById('valor2').innerHTML = hora[0];
					const posicion_inicial = polylinePlanCoordinates1[index];
					LatSli = posicion_inicial['lat'];
					LatS = LatSli.toString().split("")
					longSli = posicion_inicial['lng'];
					LonS = longSli.toString().split("")
					var resultado = "Lat: " + LatS[0] + LatS[1] + LatS[2] + LatS[3] + LatS[4] + LatS[5] + " lng: " + LonS[0] + LonS[1] + LonS[2] + LonS[3] + LonS[4] + LonS[5];
					document.getElementById('valor3').innerHTML = resultado;
				}
			}
		}

	}else{
		document.getElementById('valor3').innerHTML = "";
		document.getElementById('valor2').innerHTML = "";
	}
	if (document.getElementById("cr2").innerHTML == "camion2:activo") {
		var car2 = 1;
		op2 = { f: parseInt(totald1), l: parseInt(totald2), c: car2 };
		const options = {
			method: "POST",
			body: JSON.stringify(op2),
			headers: {
				"Content-Type": "application/json"
			}
		}
		console.log(options.body.f)
		console.log(options.body.l)
		const response = await fetch('/rango', options);
		const data = await response.json();
		data.forEach((object) => {
			polylinePlanCoordinates2.push({ lat: parseFloat(object.latitude), lng: parseFloat(object.longitude) });
		});
		data.forEach((object) => {
			allFechas2.push(parseInt(object.time));
		});
		if (Object.keys(data).length == 0) {
			alert("No se encontraron registros para el camion 2 en las fechas seleccionadas")
		} else {

			path2 = new google.maps.Polyline({
				path: polylinePlanCoordinates2,
				geodesic: true,
				strokeColor: '#0000FF',
				strokeOpacity: 1.0,
				strokeWeight: 2
			});
			console.log(polylinePlanCoordinates2);
			path2.setMap(map)
			markernew[1] = movmarker2;
			slider = document.getElementById("myRange2");
			slider.min = `${0}`;
			slider.max = `${polylinePlanCoordinates2.length - 1}`;
			slider.oninput = function () {
				if (g == 0) {
					var index = parseInt(this.value);
					const sdate = allFechas2[index];
					markernew[1].setPosition(polylinePlanCoordinates2[index])
					console.log(allFechas2[index])
					hora = allFechas2[index].toString().split("");
					hora[0] = hora[0] + hora[1] + hora[2] + hora[3] + "-" + hora[4] + hora[5] + "-" + hora[6] + hora[7] + " hora:" + hora[8] + hora[9] + ":" + hora[10] + hora[11]
					document.getElementById('valor22').innerHTML = hora[0];
					const posicion_inicial = polylinePlanCoordinates2[index];
					LatSli = posicion_inicial['lat'];
					LatS = LatSli.toString().split("")
					longSli = posicion_inicial['lng'];
					LonS = longSli.toString().split("")
					var resultado = "Lat: " + LatS[0] + LatS[1] + LatS[2] + LatS[3] + LatS[4] + LatS[5] + " lng: " + LonS[0] + LonS[1] + LonS[2] + LonS[3] + LonS[4] + LonS[5];
					document.getElementById('valor23').innerHTML = resultado;
				}
			}
		}
	}else{
		document.getElementById('valor23').innerHTML = "";
		document.getElementById('valor22').innerHTML = "";
	}







	// var car2 = 1;
	// total = { f: parseInt(totald1), l: parseInt(totald2), c: car2 };
	// const option2 = {
	// 	method: "POST",
	// 	body: JSON.stringify(total),
	// 	headers: {
	// 		"Content-Type": "application/json"
	// 	}
	// }







}

async function limpiar() {
	slider.min = `${0}`;
	slider.max = `${100}`;

	document.getElementById('valor3').innerHTML = "";
	document.getElementById('valor2').innerHTML = "";
	try {
		path1.setMap(null);
		o = 0;
		g = 1;
		var mark = markernew[0];
		mark.setMap(null);

	} catch (error) { }
	try {
		path2.setMap(null);
		var mark = markernew[1];
		mark.setMap(null);
	} catch (error) { }
}


