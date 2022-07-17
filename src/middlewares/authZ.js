const { Admin, Instructor } = require('../config/roles');
const Course = require('../services/course/course.model');
const { failedRes } = require('../utils/response');

exports.isAdmin = (req, res, next) => {
  try {
    const role = res.locals.user.role;
    if (role && role == Admin) return next();
    else throw new Error('You are NOT authorized to Admins Only Routes');
  } catch (e) {
    if (e instanceof ReferenceError) return failedRes(res, 500, e);
    else return failedRes(res, 401, e);
  }
};

exports.isInstructor = (req, res, next) => {
  try {
    const role = res.locals.user.role;
    if (role && (role == Instructor || role == Admin)) return next();
    else throw new Error('You are NOT authorized to Instructor Routes');
  } catch (e) {
    if (e instanceof ReferenceError) return failedRes(res, 500, e);
    else return failedRes(res, 401, e);
  }
};

exports.isEnrolledCourse = async (req, res, next) =>{
  try{
   const user = req.session.user;
   const course_id = req.params.course_id;
   
   const user_course = user.courses.find((e) => e.course_id == course_id);
   const course = await Course.findById(course_id).exec();
   if(!course) return failedRes(res, 404, new Error(`Can NOT found #${course_id} Course`));
   if(!(user_course || user._id == course.instructor._id || user.role == Admin)) return failedRes(res, 401, new Error('You have NOT enrolled in this course yet'));
   res.locals.course = course;
   next();
  }catch(err){
    return failedRes(res, 500, err);
  }
}

exports.whoiam = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const user_id = res.locals.id;

    if (_id != user_id) {
      throw new Error('It is NOT you');
    } else {
      return next();
    }
  } catch (e) {
    if (e instanceof ReferenceError) return failedRes(res, 500, e);
    else return failedRes(res, 401, e);
  }
};
