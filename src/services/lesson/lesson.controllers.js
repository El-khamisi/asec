const ObjectId = require('mongoose').Types.ObjectId;
const Course = require('../course/course.model');
const Lesson = require('./lesson.model');
const { Instructor } = require('../../config/roles');
const Comment = require('../comment/comment.model');
const { successfulRes, failedRes } = require('../../utils/response');
const { subscriptions } = require('../../config/public_config');
const Comment = require('../comment/comment.model');

exports.getLesson = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const lesson_id = req.params.lesson_id;
    const user = req.session.user;

    const user_course = user.courses.find((e) => e.course_id == course_id);
    const db_course = user_course ? await Course.findById(course_id).exec() : new Error('You have NOT enrolled in this course yet');
    if (!db_course) return failedRes(res, 401, db_course);

    let doc = await Lesson.findById(lesson_id).exec();
    if (user.role == Instructor) return successfulRes(res, 200, doc);

    const lessonIndex = db_course.lessons.indexOf(lesson_id);
    if (lessonIndex < 0) return failedRes(res, 404, new Error(`This lesson does NOT belong to course[${db_course.title}]`));

    if (new Date(user_course.subscription.expires_at.split('T')[0]) < new Date().toISOString().split('T')[0]) {
      return failedRes(res, 401, new Error(`Your subscription `));
    }
    if (user_course.subscription.type != subscriptions.lifeTime && user_course.length != lessonIndex) {
      return failedRes(res, 401, new Error(`You must be finsh all lessons before lesson number ${lessonIndex + 1}`));
    }

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getLessonDetials = async (req, res) => {
  try {
    const lesson_id = req.params.lesson_id;
    const response = Comment.aggregate([
      {
        $match: { _id: ObjectId(lesson_id) },
      },
      {
        $graphLookup: {
          from: 'comments',
          startWith: '$comments',
          connectFromField: 'replies',
          connectToField: '_id',
          maxDepth: 10,
          depthField: 'depthOfReplies',
          as: 'comments',
        },
      },
    ]);
    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addLesson = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    let { lessons } = req.body;

    if (typeof lessons == 'object' || lessons instanceof Object) {
      const arr = [lessons];
      lessons = arr;
    }
    if (!Array.isArray(lessons)) return failedRes(res, 400, new Error(`Can't parse body`));

    const course = await Course.findById(course_id).exec();
    if (!course) throw new Error(`Can NOT find a Course with ID-${course_id}`);

    let lessonsAdded = [];

    lessons.forEach((e) => {
      const doc = new Lesson({
        title: e.title,
        video_url: e.video_url,
        course_id: course_id,
      });
      lessonsAdded.push(doc);
      course.lessons.push(doc._id);
    });
    await course.save();

    const saved = await Lesson.insertMany(lessonsAdded);
    let response = `Number of lessons has been added: ${saved}`;
    return successfulRes(res, 201, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const _id = req.params.id;
    const { name, video } = req.body;

    const course = await Course.findById(course_id).exec();
    if (!course) throw new Error(`Can NOT find a Course with ID-${course_id}`);

    let child_id;
    course.lessons.forEach((e) => {
      if (e._id == _id) child_id = e._id;
    });

    const doc = await Lesson.findById(_id).exec();

    doc.name = name ? name : doc.name;
    doc.video = video ? video : doc.video;
    doc.course = course_id ? course_id : doc.course;

    await doc.save();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const _id = req.params.id;
    const force = req.query.force;

    let response;
    if (force == true) {
      const doc = await Lesson.findByIdAndDelete(_id).exec();
      response = { message: `Lesson[${doc.title}] has been deleted successfully with --FORCE Option` };
    } else {
      const doc = await Lesson.findByIdAndUpdate(_id, { is_deleted: true }).exec();
      response = { message: `Lesson[${doc.title}] has been deleted successfully --SOFTLY` };
    }

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.actLesson = async (req, res) => {
  try {
    const user = req.session;
    const lesson_id = req.params.lesson_id;
    const { comment } = req.body;

    const doc = new Comment({
      lesson_id,
      user: {
        _id: user._id,
        name: `${user.first_name} ${user.last_name}`,
        photo: user.photo,
      },
      text: comment,
    });
    await doc.save();
    const response = await Lesson.findByIdAndUpdate(lesson_id, { $push: { comments: doc._id } }).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
