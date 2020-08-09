import express from 'express';
import { CreateGameRequest, StartGameRequest } from './request/requests';
import iocContainer from '../inversify.config';
import { TYPES } from '../types';
import BadRequestError from './error/bad-request-error';
import { IGameService } from '../domain/port/primary/services';
import GameDTO from './dto/gameDTO';

const gameRouter = express.Router();

const gameService = iocContainer.get<IGameService>(TYPES.GAME_SERVICE);

gameRouter.get('/', function (req, res) {
	const games = gameService.getGames();
	res.json(games.map(game =>new GameDTO(game)));
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
	res.json({
		id: id,
		path: req.baseUrl + req.path + id
	});
});

gameRouter.get('/:id', function (req, res) {
	const id = req.params.id;
	const game = gameService.getGame(id);
	res.json(new GameDTO(game));
});

gameRouter.post('/:id/players', function (req, res) {
	const id = req.params.id;
	const playerIds = req.body.playerIds;
	const game = gameService.addPlayers(id, playerIds);
	res.json(new GameDTO(game));
});

gameRouter.post('/:id/start', function (req, res) {
	const id = req.params.id;
	const startGameRequest = new StartGameRequest(req.body);
	const game = gameService.startGame(id, startGameRequest.composition);
	res.json(new GameDTO(game));
});

export default gameRouter;