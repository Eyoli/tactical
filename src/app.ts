import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import iocContainer from './inversify.config';
import { IFieldService, IGameService } from './domain/port/primary/services';
import Field from './domain/model/field';
import { TYPES } from './types';
import { CreateFieldRequest } from './domain/port/primary/requests';

const app = express();
const server = new http.Server(app);
const fieldService = iocContainer.get<IFieldService>(TYPES.FIELD_SERVICE);
const gameService = iocContainer.get<IGameService>(TYPES.GAME_SERVICE);

const EXPRESS_PORT_NUMBER = 3000;

const BAD_REQUEST_CODE = 400;

app.use('/static', express.static(__dirname + '/../public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

server.listen(EXPRESS_PORT_NUMBER, function () {
	console.log('TRPG listening on port 3000!')
});

// Fields routes
app.get('/fields', function (req, res) {
	const map = fieldService.getFields();
	res.json(map);
});

app.post('/fields', function (req, res) {
	try {
		const data = new CreateFieldRequest(req.body);
		data.validate();
		const field = Field.fromCreateRequest(data);
		const id = fieldService.createField(field);
		res.json(id);
	} catch(error) {
		res.statusCode = BAD_REQUEST_CODE;		
		res.json({
			error: new String(error)
		});
	}
});

app.get('/fields/:id', function (req, res) {
	const id = req.params.id;
	const map = fieldService.getField(id);
	res.json(map);
});

