const express = require('express');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const multer = require('multer');
const { TOKENKEY, DBURI, DBURI_remote, NODE_ENV } = require('./config/env');

const login = require('./services/login/login.routes');
const dashboard = require('./services/dashboard/index.routes');
const course = require('./services/course/course.routes');

const { initPlans } = require('./services/plans/plans.model');

module.exports = async (app) => {
  app.use(cookieParser());
  app.use(express.json());
  app.use(morgan('dev'));

  let clientPromise;
  if (NODE_ENV == 'dev') {
    clientPromise = mongoose
      .connect(DBURI)
      .then((conn) => {
        console.log('connected to local database successfully');
        return conn.connection.getClient();
      })
      .catch(() => {
        console.log("can't connect to remote database");
      });
  } else {
    clientPromise = mongoose
      .connect(DBURI_remote)
      .then((conn) => {
        console.log('connected to database successfully');
        return conn.connection.getClient();
      })
      .catch(() => {
        console.log("can't connect to database");
      });
  }
  initPlans();

  // Middlewares
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Allow-Credentials', true);
    return next();
  });

  app.use(
    session({
      name: 's_id',
      secret: TOKENKEY,
      store: MongoStore.create({ clientPromise }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, //24 Hours OR Oneday
        sameSite: NODE_ENV == 'dev' ? '' : 'none',
        secure: NODE_ENV == 'dev' ? false : true,
        httpOnly: false,
      },
    })
  );
  const unless = function (paths, middleware) {
    let flag = false;
    return function (req, res, next) {
      for (let i = 0; i < paths.length; i++) {
        if (new RegExp(paths[i]).test(req.path)) {
          flag = true;
          break;
        }
      }
      if (flag) {
        return next();
      } else {
        console.log('Using multer.none');
        return middleware(req, res, next);
      }
    };
  };
  // app.use(unless(['/admin/course/*', '/admin/user/*', '/myprofile'], multer().none()));

  //Routers
  app.use(login);
  app.use(dashboard);
  app.use(course);
};
