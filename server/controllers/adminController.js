const { ObjectId } = require('mongodb');
const userModel = require('../models/userModel');
const { validationResult } = require('express-validator');

module.exports.usersGet = async function (req, res) {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json(err);
  }
};

module.exports.userDelete = async function (req, res) {
  try {
    const updatedUser = await userModel.updateOne(
      {
        _id: req.params.userId
      },
      {
        $set: {
          isActive: req.body.isActive
        }
      }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(404).json(err);
  }
};

module.exports.userUpdate = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }
  try {
    const updatedUser = await userModel.updateOne(
      {
        _id: ObjectId(req.body._id)
      },
      req.body
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(404).json(err);
  }
};