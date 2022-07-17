const ObjectId = require('mongoose').Types.ObjectId;
const User = require('./user.model');
const { successfulRes, failedRes } = require('../../utils/response');
const Course = require('../course/course.model');
const { Student } = require('../../config/roles');

exports.profileView = async (req, res) => {
  try {
    const { _id } = req.session.user;

    const response = await User.aggregate([
      {
        $match: { _id: ObjectId(_id) },
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'courses.course_id',
          foreignField: '_id',
          pipeline: [
            { $project: { title: 1, thumb: 1, instructor: 1, 'description.text': 1, lessons: 1 } },
            { $addFields: { lessons_count: { $size: '$lessons' } } },
          ],
          as: 'completed',
        },
      },
      {
        $unset: ['password', 'createdAt', '__v'],
      },
    ]);
    if (response.role == Student) {
      response.rating = undefined;
      response.about = undefined;
    }

    return successfulRes(res, 200, response[0]);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.profileUpdate = async (req, res) => {
  try {
    const { _id } = req.session.user;
    const { first_name, last_name, email, phone, photo } = req.body;

    let doc = await User.findById(_id).exec();

    doc.first_name = first_name ? first_name : doc.first_name;
    doc.last_name = last_name ? last_name : doc.last_name;
    doc.email = email ? email : doc.email;
    doc.phone = phone ? phone : doc.phone;
    doc.photo = photo ? photo : doc.photo;

    const valid = doc.validateSync();
    if (valid) throw valid;
    await doc.save();
    doc.password = undefined;
    req.session.user = doc;
    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.profileDelete = async (req, res) => {
  try {
    const _id = res.locals.user.id;

    const response = await User.findByIdAndDelete(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const user = req.session.user;
    
    let error;
    for (const e of user.courses) {
      if (e.course_id == course_id) {
        if (e.is_completed) {
          error = new Error('Your have already completed to this course');
        }
        error = new Error('Your have already enrolled to this course');
      }
      return failedRes(res, 400, error);
    }

    const course = await Course.findById(course_id).exec();
    if (course.membership != 'free' && course.instructor._id != user._id) {
      return failedRes(res, 401, new Error('You should pay to enroll to premium courses'));
    } else {
      await User.findByIdAndUpdate(user._id, {
        $push: { courses: { course_id } },
      }).exec();
      user.courses.push({
        course_id,
      });

      return res.redirect(`/course/${course_id}`);
    }
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.completeCourse = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const user = req.session.user;

    for (const e of user.courses) {
      if (e.course_id == course_id && e.is_completed) return failedRes(res, 400, new Error('Your have already completed to this course'));
    }

    const course = await Course.findById(course_id).exec();
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
