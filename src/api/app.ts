import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import BadRequestError from './error/bad-request-error';
import fieldRouter from './controller/field-controller';
import gameRouter from './controller/game-controller';
import playerRouter from './controller/player-controller';
import unitRouter from './controller/unit-controller';
import config from 'config';

process.title = config.get("process.title");

const app = express();
const server = new http.Server(app);

const EXPRESS_PORT_NUMBER = config.get("app.port");

const BAD_REQUEST_CODE = 400;

// static resources
// app.use('/static', express.static(__dirname + '/../public'));
// support json encoded bodies
app.use(bodyParser.json());
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// controllers
app.use('/fields', fieldRouter);
app.use('/games', gameRouter);
app.use('/players', playerRouter);
app.use('/units', unitRouter);

// error management
app.use((err: BadRequestError, req: any, res: any, next: any) => {
	res.statusCode = BAD_REQUEST_CODE;	
	res.json({
		error: new String(err.stack)
	});
})

server.listen(EXPRESS_PORT_NUMBER, function () {
	console.log('TRPG listening on port ' + EXPRESS_PORT_NUMBER);
});
