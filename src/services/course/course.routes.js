const router = require('express').Router();

const { authN } = require('../../middlewares/authN');
const { isInstructor } = require('../../middlewares/authZ');
const { getCourses, getCourse, getCourseDetails, addCourse, updateCourse, deleteCourse } = require('./course.controllers');

router.get('/courses', getCourses);
router.get('/course/:id', getCourse);
router.get('/course/details/:id', getCourseDetails);

//Courses
router.post('/courses', autN, isInstructor, addCourse);
router.put('/courses/:id', authN, isAdmin, updateCourse);
router.delete('/courses/:id', authN, isAdmin, deleteCourse);

module.exports = router;
