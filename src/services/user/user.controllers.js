const bcrypt = require('bcrypt');
const User = require('./user.model');
const { successfulRes, failedRes } = require('../../utils/response');
const { plansNames } = require('../plans/plans.model');
const { subscribe } = require('../../utils/subscribe');

exports.verify = (req, res) => {
  successfulRes(res, 200, { token: res.locals.user });
};
exports.getUsers = async (req, res) => {
  try {
    let q = req.query;

    const response = await User.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: { first_name: 1, last_name: 1, email: 1, membership: 1, memberplan: 1 },
      },
    ]);
    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.getUser = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await User.findById(_id).exec();
    response.password = undefined;

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.addUser = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password, role, photo, membership, memberplan } = req.body;

    if (membership == premiumPlan && Object.values(plansNames).includes(memberplan) && memberplan != plansNames.None) {
      doc.membership = premiumPlan;
      doc.memberplan = memberplan;
      doc.end_of_membership = subscribe(memberplan, doc.end_of_membership);
    } else {
      await doc.save();
      throw new Error(`Provide valid plan name-${memberplan}`);
    }

    const saved = new User({
      first_name,
      last_name,
      email,
      phone,
      password,
      role,
      membership,
      memberplan,
      photo,
    });
    if (password) {
      saved.password = bcrypt.hashSync(password, 10);
    } else {
      throw new Error('Invalid Password');
    }

    await saved.save();

    return successfulRes(res, 201, saved);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const { first_name, last_name, email, phone, password, photo, role, membership, memberplan } = req.body;

    let doc = await User.findById(_id);

    doc.first_name = first_name ? first_name : doc.first_name;
    doc.last_name = last_name ? last_name : doc.last_name;
    doc.email = email ? email : doc.email;
    doc.phone = phone ? phone : doc.phone;
    doc.role = role ? role : doc.role;

    if (password) {
      doc.password = bcrypt.hashSync(password, 10);
    }
    valid = doc.validateSync();
    if (valid) throw valid;
    await doc.save();
    doc.password = undefined;
    return successfulRes(res, 200, doc);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const _id = req.params.id;

    const response = await User.findByIdAndDelete(_id).exec();

    return successfulRes(res, 200, response);
  } catch (e) {
    return failedRes(res, 500, e);
  }
};
