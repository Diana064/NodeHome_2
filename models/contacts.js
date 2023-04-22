const fs = require('fs/promises');
const path = require('path');
const { nanoid } = require('nanoid');
const contactsPath = path.join(__dirname, 'contacts.json');

// TODO: задокументувати кожну функцію
const updateContacts = async (books) =>
	fs.writeFile(contactsPath, JSON.stringify(books, null, 2));

const listContacts = async () => {
	const data = await fs.readFile(contactsPath);
	return JSON.parse(data);
};
const getContactById = async (contactId) => {
	const contacts = await listContacts();
	const result = contacts.find((contact) => contact.id === contactId);
	return result || null;
};
const removeContact = async (contactId) => {
	const contacts = await listContacts();
	const index = contacts.findIndex((contact) => contact.id === contactId);
	if (index === -1) {
		return null;
	}
	const [result] = contacts.splice(index, 1);
	fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
	return result;
};

const addContact = async ({ name, email, phone }) => {
	const contacts = await listContacts();
	const newContact = {
		id: nanoid(),
		name,
		email,
		phone,
	};
	contacts.push(newContact);
	await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
	return newContact;
};

const updateById = async (id, { name, email, phone }) => {
	const contacts = await listContacts();
	const index = contacts.findIndex((item) => item.id === id);
	if (index === -1) return null;
	contacts[index] = { id, name, email, phone };
	await updateContacts(contacts);
	return contacts[index];
};
module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContacts,
	updateById,
};
