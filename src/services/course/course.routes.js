const router = require('express').Router();

const { authN } = require('../../middlewares/authN');
const { isInstructor } = require('../../middlewares/authZ');
const { getCourses, getCourse, getCourseDetails, addCourse, updateCourse, deleteCourse } = require('./course.controllers');

router.get('/courses', getCourses);
router.get('/courses/:id', getCourse);
router.get('/courses/details/:id', getCourseDetails);

//Courses
router.post('/courses', authN, isInstructor, addCourse);
router.put('/courses/:id', authN, isInstructor, updateCourse);
router.delete('/courses/:id', authN, isInstructor, deleteCourse);

module.exports = router;
