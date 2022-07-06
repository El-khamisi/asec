const router = require('express').Router();

const { authN } = require('../../middlewares/authN');
const { isInstructor } = require('../../middlewares/authZ');
const { getLesson, addLesson, updateLesson, deleteLesson, actLesson } = require('./lesson.controllers');

router.get('/lesson/:lesson_id/course/:course_id', authN, getLesson);

//Lessons
router.post('/lessons/:course_id', authN, isInstructor, addLesson);
router.put('/lessons/:id/course/:course_id', authN, isInstructor, updateLesson);
router.delete('/lessons/:id/course/:course_id', authN, isInstructor, deleteLesson);

//acting
router.post('/lessons/act/:lesson_id', authN, actLesson);
module.exports = router;
