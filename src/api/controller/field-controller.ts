import express from 'express';
import iocContainer from '../../inversify.config';
import { FieldServicePort } from '../../tactical/domain/port/primary/services';
import { TYPES } from '../../types';
import BadRequestError from '../error/bad-request-error';
import CreateFieldRequest from '../request/create-field-request';
import FieldDTO from '../dto/field-dto';
import Position from '../../tactical/domain/model/position';

const fieldRouter = express.Router();

const fieldService = iocContainer.get<FieldServicePort<Position>>(TYPES.FIELD_SERVICE);

fieldRouter.get('/', function (req, res) {
	const fields : any[] = fieldService.getFields();
	res.json(fields.map(field => new FieldDTO(field)));
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

fieldRouter.put('/:id', function (req, res) {
	const data = new CreateFieldRequest(req.body);
	const id = req.params.id;
	const errors = data.validate();	
	if (errors.length > 0) { 
        throw new BadRequestError(errors.toString());
	}

	const field = data.toField().withId(id);
	fieldService.updateField(field, id);

	res.send();
});

fieldRouter.get('/:id', function (req, res) {
	const id = req.params.id;
	const field: any = fieldService.getField(id);
	res.json(new FieldDTO(field));
});

export default fieldRouter;