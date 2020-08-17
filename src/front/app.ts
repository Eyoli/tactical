import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import config from 'config';
import axios from 'axios';

process.title = config.get("process.title");

const app = express();
const server = new http.Server(app);

const EXPRESS_PORT_NUMBER = config.get("front.port");
const API_HOST: string = config.get("front.api-host");

// static resources
// app.use('/static', express.static(__dirname + '/../public'));
// support json encoded bodies
app.use(bodyParser.json());
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// redirect some URLs to tactic API
app.get('/api/**', function (req, res) {
	const url: string = API_HOST + req.path.split("/api")[1];
	axios.get(url)
		.then((resp) => res.json(resp.data))
		.catch((error) => {
			console.log(error.response.status);
			res.json(error.response.status);
		});
});

server.listen(EXPRESS_PORT_NUMBER, function () {
	console.log('TRPG listening on port ' + EXPRESS_PORT_NUMBER);
});
