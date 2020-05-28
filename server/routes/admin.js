const express = require('express');
const router = express.Router();
const isAuth = require('./authMiddleware').isAuth;
const authRole = require('./authMiddleware').authRole;
const userModel = require('../models/userModel');

router.get(
  '/api/admin',
  isAuth,
  authRole(process.env.ROLE_ADMIN),
  (req, res) => {
    res.send('admin');
  }
);

router.get(
  '/api/admin/users',
  //isAuth,
  //authRole(process.env.ROLE_ADMIN),
  async (req, res) => {
    try {
      const usersLocal = await userModel.find({ isStudent: 'false' });
      const usersUAM = await userModel.find({ isStudent: 'true' });
      const newUsersLocal = usersLocal;
      newUsersLocal.forEach(function (obj) {
        obj.longing2 = obj.login;
      });
      res.status(200).json(newUsersLocal.concat(usersUAM));
    } catch (err) {
      res.status(404).json(err);
    }
  }
);
router.patch(
  '/api/admin/modify/:userId',
  isAuth,
  authRole(process.env.ROLE_ADMIN),
  async function (req, res) {
    try {
      const updatedUser = await userModel.updateOne(
        {
          _id: req.params.userId,
        },
        {
          $set: {
            isStudent: req.body.isStudent,
          },
        }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(404).json(err);
    }
  }
);
module.exports = router;