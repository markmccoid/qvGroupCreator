const router = require('express').Router();
const variablesRouter = require('./variablesRouter');
const varAppRouter = require('./variablesAppRouter');
const settingsRouter = require('./settingsRouter');
const groupRouter = require('./groupRouter');
const groupAppRouter = require('./groupAppRouter');
const analytixFieldsRouter = require('./analytixFieldsRouter');

router.use('/api', variablesRouter);
router.use('/api', varAppRouter);
router.use('/api', settingsRouter);
router.use('/api', groupAppRouter);
router.use('/api', groupRouter);
router.use('/api', analytixFieldsRouter);

module.exports = router;
