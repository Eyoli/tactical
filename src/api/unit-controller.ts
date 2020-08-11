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
	const errors = data.validate();	
	if (errors.length > 0) { 
        throw new BadRequestError(errors.toString());
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