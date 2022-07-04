const router = require('express').Router();

const { authN } = require('../../middlewares/authN');
const { isInstructor } = require('../../middlewares/authZ');
const { getQuiz, getQuizzes, adminGetQuiz, addQuiz, updateQuiz, deleteQuiz } = require('./quiz.controllers');

router.get('/quizzes', authN, getQuizzes);
router.get('/quiz/:id', authN, getQuiz);

//Quizzes
router.get('/quiz/:id', authN, isInstructor, adminGetQuiz);
router.post('/quiz', authN, isInstructor, addQuiz);
router.put('/quiz/:id', authN, isInstructor, updateQuiz);
router.delete('/quiz/:id', authN, isInstructor, deleteQuiz);

module.exports = router;
