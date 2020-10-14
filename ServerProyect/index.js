const express = require('express');
const app = express();
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const mysql = require('mysql');
var ubi;
require('dotenv').config();
console.log(process.env)

const database = mysql.createConnection({
	host: process.env.HO,
	user: process.env.A,
	password: process.env.PA,
	database: process.env.B
	//el endpoint y la contraseña de la base de datos se añaden en un archivo .env
});

// Establish connection
database.connect((err) => {
	if (err) {
		throw err;
	}
	console.log('Connected to DDBB');

});


socket.on('error', (err) => {
	console.log(`server error:\n${err.stack}`);
	socket.close();
});

socket.on('message', (msg, rinfo) => {
	msg = msg.toString().split(',');
	time = msg[2]
	console.log(msg)
	console.log(time)
	//time[0]:año - time[1]:mes - time[2]:dia - time[3]:hora - time[4]:minuto - time[5]:segundo
	msg = { latitude: parseFloat(msg[0]), longitude: parseFloat(msg[1]), time };
	let sql = 'INSERT INTO new_table SET ?';
	let query = database.query(sql, msg, (err, result) => {
		if (err) throw err;
	});
	ubi = msg;

});

socket.bind(47625); //puerto socket

app.listen(3000, () => console.log('Servidor ejecutandose en el puerto 3000')); //puerto server
app.use(express.static('public'));

app.get('/', function (req, res) {
	res.render('index', {
		msg: ubi,
	});
});

app.get('/ruta', function (req, res) {
	console.log(ubi);
	res.json(ubi);
});

app.get('/baseDeDatos', function (req, res) {
	
	let sql = 'SELECT * FROM new_table'
	let query = database.query(sql, (err, result) => {
		if (err) throw err;
		res.end(JSON.stringify(result))
	})
})