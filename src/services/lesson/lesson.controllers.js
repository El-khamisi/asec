const ObjectId = require('mongoose').Types.ObjectId;
const Course = require('../course/course.model');
const Lesson = require('./lesson.model');
const { Instructor, Admin } = require('../../config/roles');
const Comment = require('../comment/comment.model');
const { successfulRes, failedRes } = require('../../utils/response');
const { subscriptions } = require('../../config/public_config');


exports.getLesson = async (req, res) => {
  try {
    const course = res.locals.course;
    const lesson_id = req.params.lesson_id;
    const user = req.session.user;


    let doc = await Lesson.findById(lesson_id).select('-comments');
    if(!doc) return failedRes(res, 404, new Error(`Can NOT found #${lesson_id} Lesson`));
    if (user.role == Instructor  || user.role == Admin) return successfulRes(res, 200, doc);

    const lessonIndex = course.lessons.indexOf(lesson_id);
    if (lessonIndex < 0) return failedRes(res, 404, new Error(`This lesson does NOT belong to course [${course.title}]`));

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

exports.getLessonDetails = async (req, res) => {
  try {
    const lesson_id = req.params.lesson_id;
    const {details} = req.query;

    let response;
    if(details == 'comments'){
       response = await Comment.aggregate([
        {
          $match: { parent_id: ObjectId(lesson_id) },
        },
        {
          $graphLookup: {
            from: 'comments',
            startWith: '$replies',
            connectFromField: 'replies',
            connectToField: '_id',
            maxDepth: 10,
            depthField: 'depthOfReplies',
            as: 'replies',
          },
        },
      ]);

    }
    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addLesson = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    let { lessons } = req.body;
    const user = req.session.user;


    if (!Array.isArray(lessons)) {
      const arr = [lessons];
      lessons = arr;
    }
    

    const course = await Course.findById(course_id).exec();
    if (!course) throw new Error(`Can NOT find a Course with ID-${course_id}`);
    if(!(user._id == course.instructor._id || user.role == Admin)) return failedRes(res, 401, new Error(`You are NOT authorized to edit this course`));


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
    let response = `Number of lessons has been added: ${saved.length}`;
    return successfulRes(res, 201, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const user = req.session.user;
    const course_id = req.params.course_id;
    const _id = req.params.lesson_id;
    const { title, video_url } = req.body;

    const course = await Course.findById(course_id).exec();
    if (!course) throw new Error(`Can NOT find a Course with ID-${course_id}`);
    if(!(user._id == course.instructor._id || user.role == Admin)) return failedRes(res, 401, new Error(`You are NOT authorized to edit this course`));


    let child_id;
    course.lessons.forEach((e) => {
      if (e._id == _id) child_id = e._id;
    });

    const doc = await Lesson.findById(child_id).exec();

    doc.title = title ? title : doc.title;
    doc.video_url = video_url ? video_url : doc.video_url;
    doc.course = course_id ? course_id : doc.course;

    await doc.save();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const user = req.session.user;
    const course_id = req.params.course_id;
    const _id = req.params.lesson_id;
    const force = req.query.force;

    const course = await Course.findById(course_id).exec();
    if (!course) throw new Error(`Can NOT find a Course with ID-${course_id}`);
    if(!(user._id == course.instructor._id || user.role == Admin)) return failedRes(res, 401, new Error(`You are NOT authorized to edit this course`));

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


exports.commentLesson = async (req, res) => {
  try {
    const user = req.session.user;
    const lesson_id = req.params.lesson_id;
    const { comment } = req.body;


    const doc = new Comment({
      parent_id: lesson_id,
      user: {
        _id: user._id,
        name: `${user.first_name} ${user.last_name}`,
        photo: user.photo,
      },
      text: comment,
    });
    await doc.save();
    
    await Lesson.findByIdAndUpdate(lesson_id, { $push: { comments: doc._id } }, {new: true}).exec();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.replyComment = async (req, res) => {
  try {
    const user = req.session.user;
    const comment_id = req.params.comment_id;
    const { reply } = req.body;

    const doc = new Comment({
      parent_id: comment_id,
      user: {
        _id: user._id,
        name: `${user.first_name} ${user.last_name}`,
        photo: user.photo,
      },
      text: reply,
    });
    await doc.save();

    await Comment.findByIdAndUpdate(comment_id, { $push: { replies: doc._id } }, {new: true}).exec();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.reactComment = async (req, res) => {
  try {
    const comment_id = req.params.comment_id;

    const doc = await Comment.findByIdAndUpdate(comment_id, { $inc: { likes: 1 } }, {new: true}).exec();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};