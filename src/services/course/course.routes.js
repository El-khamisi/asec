const router = require('express').Router();

const { getCourses, getCourse, getCourseDetails } = require('./course.controllers');

router.get('/courses', getCourses);
router.get('/course/:id', getCourse);
router.get('/course/details/:id', getCourseDetails);

module.exports = router;
