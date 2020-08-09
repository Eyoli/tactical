import express from 'express';
import iocContainer from '../inversify.config';
import { IUnitService } from '../domain/port/primary/services';
import { CreateUnitRequest } from './request/requests';
import { TYPES } from '../types';
import BadRequestError from './error/bad-request-error';

const unitRouter = express.Router();

const unitService = iocContainer.get<IUnitService>(TYPES.UNIT_SERVICE);

unitRouter.get('/', function (req, res) {
	const map = unitService.getUnits();
	res.json(map);
});

unitRouter.post('/', function (req, res) {
	const data = new CreateUnitRequest(req.body);

	try {
		data.validate();	
	} catch(error) {
        throw new BadRequestError(error.message);
	}

	const unit = data.toUnit();
	const id = unitService.createUnit(unit);
	res.json({
		id: id,
		path: req.baseUrl + req.path + id
	});
});

unitRouter.get('/:id', function (req, res) {
	const id = req.params.id;
	const unit = unitService.getUnit(id);
	res.json(unit);
});

export default unitRouter;