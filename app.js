const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const contactsRouter = require('./routes/api/contacts');

const app = express();
app.use(express.json());
app.use('/api/contacts', contactsRouter);
app.use(cors());
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(logger('dev'));

app.use((req, res) => {
	res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
	res.status(500).json({ message: err.message });
});

module.exports = app;

// const contacts = require('./models/contacts.json');
// const moment = require('moment');
// const fs = require('fs/promises');
// app.use(async (res, req, next) => {
// 	const { method, url } = req;
// 	const date = moment().format('DD-MM-YYYY_hh:mm:ss');
// 	await fs.appendFile('server.log', `\n${method} ${url} ${date}`);
// 	next();
// });
// app.get('/', (req, res) => {
// 	res.send('<h2>home pahe<h2>');
// });
// app.get('/contacts', (req, res) => {
// 	res.json(contacts);
// });
