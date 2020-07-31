import express from 'express';
import http from 'http';
import iocContainer from './inversify.config';
import { IFieldService, IGameService } from './domain/port/primary/interfaces';
import Field from './domain/model/field';
import { TYPES } from './types';

const app = express();
const server = new http.Server(app);
const fieldService = iocContainer.get<IFieldService>(TYPES.FIELD_SERVICE);
const gameService = iocContainer.get<IGameService>(TYPES.GAME_SERVICE);

const EXPRESS_PORT_NUMBER = 3000;

app.use('/static', express.static(__dirname + '/../public'));

server.listen(EXPRESS_PORT_NUMBER, function () {
	console.log('TRPG listening on port 3000!')
});

// Fields routes
app.get('/fields', function (req, res) {
	const map = fieldService.getFields();
	res.json(map);
});

app.post('/fields', function (req, res) {
	const field = new Field("New field");
	const id = fieldService.createField(field);
	res.json(id);
});

app.get('/fields/:key', function (req, res) {
	const key = req.params.key;
	const map = fieldService.getField(key);
	res.json(map);
});

