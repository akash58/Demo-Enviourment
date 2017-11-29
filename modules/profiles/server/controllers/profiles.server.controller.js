'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Profile = mongoose.model('Profile'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Profile
 */
exports.create = function (req, res) {
  var profile = new Profile(req.body);
  profile.user = req.user;

  profile.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(profile);
    }
  });
};

/**
 * Show the current Profile
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var profile = req.profile ? req.profile.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  profile.isCurrentUserOwner = req.user && profile.user && profile.user._id.toString() === req.user._id.toString();

  res.jsonp(profile);
};

/**
 * Update a Profile
 */
exports.update = function (req, res) {
  var profile = req.profile;

  profile = _.extend(profile, req.body);

  profile.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(profile);
    }
  });
};

/**
 * Delete an Profile
 */
exports.delete = function (req, res) {
  var profile = req.profile;

  profile.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(profile);
    }
  });
};

/**
 * List of Profiles
 */
exports.list = function (req, res) {
  if (req.query.name) {
    if (typeof(req.query.page) === 'undefined') req.query.page = 1;
    if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
    Profile.find({ $and: [{ active: true }, { name: { $regex: new RegExp(req.query.name.toLowerCase(), 'i') } }] }).sort('-created').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function (err, profiles) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(profiles);
      }
    });
  } else {
    if (typeof(req.query.page) === 'undefined') req.query.page = 1;
    if (typeof(req.query.limit) === 'undefined') req.query.limit = 10;
    Profile.find({ active: true }).sort('-created').skip((req.query.page - 1) * Number(req.query.limit)).limit(Number(req.query.limit)).exec(function (err, profiles) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(profiles);
      }
    });
  }
  // Profile.find().sort('-created').populate('user', 'displayName').exec(function (err, profiles) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.jsonp(profiles);
  //   }
  // });
};

exports.count = function (req, res) {
  if (req.query.name) {
    Profile.count({ $and: [{ active: true }, { name: { $regex: new RegExp(req.query.name.toLowerCase(), 'i') } }] }).exec(function (err, profiles_count) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log(profiles_count);
        res.send({ count: profiles_count });
      }
    });
  } else {
    Profile.count({ active: true }).exec(function (err, profiles_count) {
      if (err) {
        // console.log(err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        // console.log(profiles_count);
        res.send({ count: profiles_count });
      }
    });
  }
};

/**
 * Profile middleware
 */
exports.profileByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Profile is invalid'
    });
  }

  Profile.findById(id).populate('user', 'displayName').exec(function (err, profile) {
    if (err) {
      return next(err);
    } else if (!profile) {
      return res.status(404).send({
        message: 'No Profile with that identifier has been found'
      });
    }
    req.profile = profile;
    next();
  });
};
