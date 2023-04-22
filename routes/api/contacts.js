const contacts = require('../../models/contacts');
const express = require('express');
const router = express.Router();
const requestError = require('../../helpers');
const Joi = require('joi');

const contactScheme = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().required(),
	phone: Joi.number().required(),
});

router.get('', async (req, res, next) => {
	try {
		const result = await contacts.listContacts();
		res.json(result);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.get('/:contactId', async (req, res, next) => {
	try {
		console.log(req.params);
		const { contactId } = req.params;
		const result = await contacts.getContactById(contactId);
		if (!result) {
			throw requestError(404, 'Not found');
		}
		res.json(result);
	} catch (error) {
		const { status = 500, message = 'Server error' } = error;
		res.status(status).json({ message: message });
	}
});

router.post('', async (req, res, next) => {
	try {
		const { error } = contactScheme.validate(req.body);
		if (error) {
			throw requestError(400, 'missing required name field');
		}
		const result = await contacts.addContact(req.body);
		return res.status(201).json(result);
	} catch (error) {
		next(error);
	}
});

router.delete('/:contactId', async (req, res, next) => {
	try {
		const { contactId } = req.params;
		const result = await contacts.removeContact(contactId);
		if (!result) {
			throw requestError(404, 'Not found');
		}
		res.json({ message: 'contact deleted' });
	} catch (error) {
		next(error);
	}
});

router.put('/:contactId', async (req, res, next) => {
	try {
		const { error } = contactScheme.validate(req.body);
		if (error) {
			throw requestError(400, 'missing fields');
		}
		console.log(req.params);
		const { contactId } = req.params;
		const result = await contacts.updateById(contactId, req.body);
		if (!result) {
			throw requestError(404, 'Not found ');
		}
		res.json(result);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
