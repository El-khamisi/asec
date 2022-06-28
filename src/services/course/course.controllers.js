const Course = require('./course.model');
const { successfulRes, failedRes } = require('../../utils/response');
const { upload_image } = require('../../config/cloudinary');
const User = require('../user/user.model');

exports.getCourses = async (req, res) => {
  try {
    let { filter = 'title', value = '.*', limit = 16, skip = 0 } = req.query;

    let response = await Course.aggregate([
      {
        $match: { filter: { $regex: value, $options: 'six' } },
      },
      {
        $sort: { createdAt: -1 },
      },
      { $skip: skip },
      { $limit: limit },
      {
        $project: { title: 1, thumb: 1, instructor: 1, description: 1, price: 1, rating: 1, membership: 1, level: 1, category: 1 },
      },
    ]);

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getCourse = async (req, res) => {
  try {
    const _id = req.params.id;
    let response = await Course.findById(_id).select('-is_deleted')
    .populate({ path: 'instructor._id', select: 'first_name last_name email photo'})
    .populate({ path: 'lessons', select: 'name' });

    response._doc.instructor = response._doc.instructor._id;
    response.price = response.price.egp;

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addCourse = async (req, res) => {
  try {
    const { title, thumb,  instructor, description_text, description_list, 
      price_usd, price_egp, membership, level, category, project, spec, } = req.body;

    const saved = new Course({
      title,
      thumb,
      instructor:{
        _id: instructor,
        name: await User.findById(instructor).select('first_name last_name').then(user => `${user.first_name} ${user.last_name}`),
      },
      description: {
        text: description_text,
        list: description_list,
      },price: {
        usd: price_usd
      },
      membership,
      level,
      category,
      project,
      spec
    });
    await saved.save();

    return successfulRes(res, 201, saved.toJSON({virtuals: true}));
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const _id = req.params.id;
    const { name, price, instructor, text, list, membership, level, quizzes } = req.body;
    const photo = req.file?.path;

    let doc = await Course.findById(_id).exec();

    doc.name = name ? name : doc.name;
    doc.price = price ? price : doc.price;
    doc.level = level ? level : doc.level;
    doc.instructor = instructor ? instructor : doc.instructor;
    doc.membership = membership ? membership : doc.membership;
    doc.description = {
      text: text ? text : doc.description.text,
      list: list ? list : doc.description.list,
    };
    doc.quizzes = quizzes ? quizzes : doc.quizzes;

    if (photo) {
      doc.photo = await upload_image(photo, doc._id, 'courses_thumbs');
    }

    await doc.save();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await Course.findByIdAndDelete(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
