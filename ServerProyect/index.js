const express = require('express');
const app = express();
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const mysql = require('mysql');
var ubi;




// Credentials for connecting the database
const database = mysql.createConnection({
    host: 
    user: 'admin',
    password: 
    database: 'sys'
});

// Establish connection
database.connect((err) => {
    if (err) {
        throw err;
    }
	console.log('Connected to DB');
	
});

	



socket.on('error', (err) => {
	console.log(`server error:\n${err.stack}`);
	socket.close();
});

socket.on('message', (msg, rinfo) => {
	console.log(`El servidor recibió: ${msg} de ${rinfo.address}:${rinfo.port}`);
	msg = msg.toString().split(',');
	msg = {latitude: parseFloat(msg[0]), longitude: parseFloat(msg[1]), timestamp: msg[2] };
	let sql = 'INSERT INTO new_table SET ?';
    let query = database.query(sql, msg, (err, result) => {
        if (err) throw err;
	});
	console.log(msg);
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

