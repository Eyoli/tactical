import express from 'express';
import { CreateGameRequest, StartGameRequest } from '../request/requests';
import iocContainer from '../../inversify.config';
import { TYPES } from '../../types';
import BadRequestError from '../error/bad-request-error';
import { GameServicePort, ActionServicePort } from '../../tactical/domain/port/primary/services';
import GameDTO from '../dto/game-dto';
import Position from '../../tactical/domain/model/position';
import ActionInfoDTO from '../dto/action-info-dto';

const gameRouter = express.Router();

const gameService = iocContainer.get<GameServicePort>(TYPES.GAME_SERVICE);
const actionService = iocContainer.get<ActionServicePort>(TYPES.ACTION_SERVICE);

gameRouter.get('/', function (req, res) {
	const games = gameService.getGames();
	res.json(games.map(game =>new GameDTO(game)));
});

gameRouter.post('/', function (req, res) {
	const data = new CreateGameRequest(req.body);
	const errors = data.validate();	
	if (errors.length > 0) { 
        throw new BadRequestError(errors.toString());
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

gameRouter.post('/:id/endTurn', function (req, res) {
	const id = req.params.id;
	const game = gameService.finishTurn(id);
	res.json(new GameDTO(game));
});

gameRouter.post('/:id/rollback/action', function (req, res) {
	const id = req.params.id;
	const game = gameService.rollbackLastAction(id);
	res.json(new GameDTO(game));
});

gameRouter.get('/:id/units/:unitId/positions', function (req, res) {
	const id = req.params.id;
	const unitId = req.params.unitId;
	const positions = gameService.getAccessiblePositions(id, unitId);
	res.json(positions);
});

gameRouter.post('/:id/units/:unitId/move', function (req, res) {
	const id = req.params.id;
	const unitId = req.params.unitId;
	const position = new Position(req.body.position.x, req.body.position.y, req.body.position.z);
	const unitState = gameService.moveUnit(id, unitId, position);
	res.json(unitState);
});

gameRouter.get('/:id/units/:unitId/actions/:actionTypeId/info', function (req, res) {
	const id = req.params.id;
	const unitId = req.params.unitId;
	const actionTypeId = req.params.actionTypeId;
	const actionType = actionService.getActionType(actionTypeId);
	const positions = gameService.getAccessiblePositions(id, unitId);
	res.json(new ActionInfoDTO(actionType, positions));
});

export default gameRouter;