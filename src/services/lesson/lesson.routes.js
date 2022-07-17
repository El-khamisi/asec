const router = require('express').Router();

const { authN } = require('../../middlewares/authN');
const { isInstructor, isEnrolledCourse } = require('../../middlewares/authZ');
const { getLesson, addLesson, updateLesson, deleteLesson, commentLesson, getLessonDetails, replyComment, reactComment} = require('./lesson.controllers');

router.get('/lessons/:lesson_id/course/:course_id', authN, isEnrolledCourse, getLesson);
router.get('/lessons/details/:lesson_id', getLessonDetails);


//Lessons
router.post('/lessons/:course_id', authN, isInstructor, addLesson);
router.put('/lessons/:lesson_id/course/:course_id', authN, isInstructor, updateLesson);
router.delete('/lessons/:lesson_id/course/:course_id', authN, isInstructor, deleteLesson);

//Reacting
router.post('/lessons/:course_id/comment/:lesson_id', authN, isEnrolledCourse, commentLesson);
router.post('/comments/:course_id/reply/:comment_id', authN, isEnrolledCourse, replyComment);
router.post('/comments/:course_id/react/:comment_id', authN, isEnrolledCourse, reactComment);
module.exports = router;
