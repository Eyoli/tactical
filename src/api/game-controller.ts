import express from 'express';
import { CreateGameRequest, StartGameRequest } from './request/requests';
import iocContainer from '../inversify.config';
import { TYPES } from '../types';
import BadRequestError from './error/bad-request-error';
import { IGameService } from '../domain/port/primary/services';

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

	const game = data.toGame();
	const id = gameService.createGame(game, data.fieldId);
	res.json(req.baseUrl + req.path + id);
});

gameRouter.get('/:id', function (req, res) {
	const id = req.params.id;
	const game = gameService.getGame(id);
	res.json(game);
});

gameRouter.post('/:id/players', function (req, res) {
	const id = req.params.id;
	const playerIds = req.body.playerIds;
	const game = gameService.addPlayers(id, playerIds);
	res.json(game);
});

gameRouter.post('/:id/start', function (req, res) {
	const id = req.params.id;
	const startGameRequest = new StartGameRequest(req.body);
	const game = gameService.startGame(id, startGameRequest.composition);
	res.json(game);
});

export default gameRouter;