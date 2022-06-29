const router = require('express').Router();

const { authN } = require('../../middlewares/authN');
const { isAdmin } = require('../../middlewares/authZ');
const { imageUpload } = require('../../config/multer');
const { getUsers, getUser, addUser, updateUser, deleteUser } = require('../user/user.controllers');
const { addCourse, updateCourse, deleteCourse } = require('../course/course.controllers');
const { addLesson, updateLesson, deleteLesson } = require('../lesson/lesson.controllers');
const { addQuiz, updateQuiz, deleteQuiz, adminGetQuiz } = require('../quiz/quiz.controllers');
// const { addReading, updateReading, deleteReading } = require('../reading/reading.controllers');

//Users
router.get('/users', authN, isAdmin, getUsers);
router.get('/user/:id', authN, isAdmin, getUser);
router.post('/user', authN, isAdmin, imageUpload.single('photo'), addUser);
router.put('/user/:id', authN, isAdmin, imageUpload.single('photo'), updateUser);
router.delete('/user/:id', authN, isAdmin, deleteUser);

//Courses
// router.post('/course', authN, isAdmin, addCourse);
router.post('/courses', addCourse);
router.put('/courses/:id', authN, isAdmin, imageUpload.single('photo'), updateCourse);
router.delete('/courses/:id', authN, isAdmin, deleteCourse);

//Lessons
router.post('/lessons/:course_id', addLesson);
router.put('/lessons/:id/course/:course_id', authN, isAdmin, updateLesson);
router.delete('/lessons/:id/course/:course_id', authN, isAdmin, deleteLesson);

//Quizzes
router.get('/quiz/:id', authN, isAdmin, adminGetQuiz);
router.post('/quiz', authN, isAdmin, addQuiz);
router.put('/quiz/:id', authN, isAdmin, updateQuiz);
router.delete('/quiz/:id', authN, isAdmin, deleteQuiz);

// //Reading
// router.post('/read', authN, isAdmin, addReading);
// router.put('/read/:id', authN, isAdmin, updateReading);
// router.delete('/read/:id', authN, isAdmin, deleteReading);

module.exports = router;
