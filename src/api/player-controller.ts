import express from 'express';
import iocContainer from '../inversify.config';
import { IPlayerService } from '../domain/port/primary/services';
import { CreatePlayerRequest } from './request/requests';
import { TYPES } from '../types';
import BadRequestError from './error/bad-request-error';

const playerRouter = express.Router();

const playerService = iocContainer.get<IPlayerService>(TYPES.PLAYER_SERVICE);

playerRouter.get('/', function (req, res) {
	const map = playerService.getPlayers();
	res.json(map);
});

playerRouter.post('/', function (req, res) {
	const data = new CreatePlayerRequest(req.body);

	try {
		data.validate();	
	} catch(error) {
        throw new BadRequestError(error.message);
	}

	const player = data.toField();
	const id = playerService.createPlayer(player);
	res.json({
		id: id,
		path: req.baseUrl + req.path + id
	});
});

playerRouter.get('/:id', function (req, res) {
	const id = req.params.id;
	const field = playerService.getPlayer(id);
	res.json(field);
});

export default playerRouter;