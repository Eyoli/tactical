import express from 'express';
import iocContainer from '../inversify.config';
import { FieldServicePort } from '../domain/port/primary/services';
import { TYPES } from '../types';
import BadRequestError from './error/bad-request-error';
import CreateFieldRequest from './request/create-field-request';
import FieldDTO from './dto/fieldDTO';
import TileBasedField from '../domain/model/tile-based-field/tile-based-field';

const fieldRouter = express.Router();

const fieldService = iocContainer.get<FieldServicePort<TileBasedField>>(TYPES.FIELD_SERVICE);

fieldRouter.get('/', function (req, res) {
	const fields = fieldService.getFields()
		.map(field => new FieldDTO(field));
	res.json(fields);
});

fieldRouter.post('/', function (req, res) {
	const data = new CreateFieldRequest(req.body);
	const errors = data.validate();	
	if (errors.length > 0) { 
        throw new BadRequestError(errors.toString());
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
	res.json(new FieldDTO(field));
});

export default fieldRouter;