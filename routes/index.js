const express = require('express');
const router = express.Router();

const usersRouter = require('./users.routes');
const servicesRouter = require('./services.routes');
const reviewsRouter = require('./reviews.routes');

router.use('/users', usersRouter);
router.use('/services', servicesRouter);
router.use('/reviews', reviewsRouter);

module.exports = router;
