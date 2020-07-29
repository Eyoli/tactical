import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import { iocContainer } from './inversify.config';
import { IFieldService } from './services/interfaces';

const app = express();
const server = new http.Server(app);
const mapService = iocContainer.get<IFieldService>("FieldService");

const EXPRESS_PORT_NUMBER = 3000;

app.use('/static', express.static(__dirname + '/../public'));

server.listen(EXPRESS_PORT_NUMBER, function () {
	console.log('TRPG listening on port 3000!')
});

app.get('/maps', function (req, res) {
	res.json("Get all maps");
});

app.get('/map/:key', function (req, res) {
	const key = req.params.key;
	const map = mapService.getMap(key);
	res.json(map);
});

