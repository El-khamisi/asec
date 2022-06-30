const { Types } = require('mongoose');
const Course = require('./course.model');
const User = require('../user/user.model');
const { successfulRes, failedRes } = require('../../utils/response');

exports.getCourses = async (req, res) => {
  const allowfilters = ['title', 'category', 'all'];
  let query = { is_deleted: false };
  try {
    let { filter = 'all', value, page = 1 } = req.query;

    if (!allowfilters.includes(filter)) throw new Error('Invalid filter');
    if (value) query[filter] = { $regex: value, $options: 'six' };
    const skip = (page - 1) * 16;
    let response = await Course.aggregate([
      {
        $match: query,
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          title: 1,
          thumb: 1,
          instructor: 1,
          description: 'description.text',
          price_egp: '$price.egp',
          rating: 1,
          membership: 1,
          level: 1,
          category: 1,
        },
      },
      {
        $facet: {
          current_data: [{ $skip: skip }, { $limit: 16 }],
          page_info: [{ $count: 'total_pages' }, { $addFields: { page: page } }],
        },
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
    let response = await Course.findOne({ _id, is_deleted: false })
      .select('-updatedAt -is_deleted -__v')
      .populate({ path: 'instructor._id', select: 'first_name last_name email photo' })
      .populate({ path: 'lessons', select: 'title' });

    if (response) {
      response._doc.lessons = response.lessons;
      response._doc.lessons_count = response.lessons.length;
      response._doc.instructor = response.instructor._id;
      response._doc.price_egp = response._doc.price.egp;
      delete response._doc.price;
    }

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getCourseDetails = async (req, res) => {
  const allowdetails = ['reviews', 'resources'];
  try {
    const _id = req.params.id;
    const { details } = req.query;
    if (!allowdetails.includes(details)) throw new Error('Invalid details');

    const response = await Course.aggregate([
      {
        $match: { _id: Types.ObjectId(_id), is_deleted: false },
      },
      {
        $lookup: {
          from: `${details}`,
          localField: '_id',
          foreignField: 'content_id',
          as: `${details}`,
        },
      },
      {
        $unwind: `$${details}`,
      },
      {
        $replaceRoot: { newRoot: `$${details}` },
      },
      { $limit: 50 },
      {
        $unset: ['_id', 'content_id', 'content_type', 'user_id', '__v'],
      },
    ]);

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addCourse = async (req, res) => {
  try {
    const { title, thumb, instructor, description_text, description_list, price_usd, price_egp, membership, level, category, project, spec } =
      req.body;

    const saved = new Course({
      title,
      thumb,
      instructor: {
        _id: instructor,
        name: await User.findById(instructor)
          .select('first_name last_name')
          .then((user) => `${user.first_name} ${user.last_name}`),
      },
      description: {
        text: description_text,
        list: description_list,
      },
      price: {
        usd: price_usd,
      },
      membership,
      level,
      category,
      project,
      spec,
    });
    await saved.save();

    return successfulRes(res, 201, saved.toJSON({ virtuals: true }));
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
    await doc.save();

    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await Course.findByIdAndUpdate(_id, { is_deleted: true }).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
