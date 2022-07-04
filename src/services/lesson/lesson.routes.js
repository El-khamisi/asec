const router = require('express').Router();

const { authN } = require('../../middlewares/authN');
const { isInstructor } = require('../../middlewares/authZ');
const { getLesson, addLesson, updateLesson, deleteLesson } = require('./lesson.controllers');

router.get('/lesson/:lesson_id/course/:course_id', authN, getLesson);
// router.get('/loli', (req, res)=>res.json({session: req.session.user}))

//Lessons
router.post('/lessons/:course_id', authN, isInstructor, addLesson);
router.put('/lessons/:id/course/:course_id', authN, isInstructor, updateLesson);
router.delete('/lessons/:id/course/:course_id', authN, isInstructor, deleteLesson);

module.exports = router;
