const router = require('express').Router();

const { getCourses, getCourse } = require('./course.controllers');

router.get('/courses', getCourses);
router.get('/course/:id', getCourse);

module.exports = router;
