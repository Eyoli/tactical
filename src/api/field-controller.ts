import express from 'express';
import { CreateFieldRequest } from './request/requests';
import iocContainer from '../inversify.config';
import { IFieldService } from '../domain/port/primary/services';
import { TYPES } from '../types';
import BadRequestError from './error/bad-request-error';

const fieldRouter = express.Router();

const fieldService = iocContainer.get<IFieldService>(TYPES.FIELD_SERVICE);

fieldRouter.get('/', function (req, res) {
	const map = fieldService.getFields();
	res.json(map);
});

fieldRouter.post('/', function (req, res) {
	const data = new CreateFieldRequest(req.body);

	try {
		data.validate();	
	} catch(error) {
        throw new BadRequestError(error.message);
	}

	const field = data.toField();
	const id = fieldService.createField(field);
	res.json({
		id: id,
		path: req.baseUrl + req.path + id
	});
});

fieldRouter.get('/:id', function (req, res) {
	const id = req.params.id;
	const field = fieldService.getField(id);
	res.json(field);
});

export default fieldRouter;