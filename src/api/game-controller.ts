import express from 'express';
import { CreateGameRequest } from '../domain/port/primary/requests';
import iocContainer from '../inversify.config';
import { TYPES } from '../types';
import BadRequestError from './error/bad-request-error';
import { IGameService } from '../domain/port/primary/services';
import Game from '../domain/model/game';

const gameRouter = express.Router();

const gameService = iocContainer.get<IGameService>(TYPES.GAME_SERVICE);

gameRouter.get('/', function (req, res) {
	const map = gameService.getGames();
	res.json(map);
});

gameRouter.post('/', function (req, res) {
	const data = new CreateGameRequest(req.body);

	try {
		data.validate();
	} catch(error) {
        throw new BadRequestError(error.message);
	}

	const game = Game.fromCreateRequest(data);
	const id = gameService.createGame(game, data.fieldId);
	res.json(req.baseUrl + req.path + id);
});

gameRouter.get('/:id', function (req, res) {
	const id = req.params.id;
	const game = gameService.getGame(id);
	res.json(game);
});

gameRouter.post('/:id/addPlayer', function (req, res) {
	const id = req.params.id;
	const playerId = req.body.playerId;
	const game = gameService.addPlayer(id, playerId);
	res.json(game);
});

gameRouter.post('/:id/start', function (req, res) {
	const id = req.params.id;
	const game = gameService.startGame(id);
	res.json(game);
});

export default gameRouter;