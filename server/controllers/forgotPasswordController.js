const express = require('express');
const crypto = require('crypto');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');

module.exports.forgotPassword = async function (req, res) {
  if (req.body.email === '') {
    res.status(400).send('email required');
  }
  const token = crypto.randomBytes(20).toString('hex');
  await User.findOneAndUpdate(
    {
      email: req.body.email,
      isStudent: false,
    },
    {
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 3600000,
    },
    {
      // useNewUrlParser: true,
      //useFindAndModify: false
    },
    (err, user) => {
      if (err) {
        res.status(401).end('recovery email sent');
      }
      if (!user) return res.status(401).json('uzytkownik nie istniej');

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: `${process.env.EMAIL_PASSWORD}`,
        },
      });

      const mailOptions = {
        from: `${process.env.EMAIL_ADDRESS}`,
        to: `${user.email}`,
        subject: 'Link To Reset Password',
        text:
          'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n' +
          `http://localhost:3000/reset/${token}\n\n` +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      };

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          return res.status(422).send(err);
        } else {
          res.status(200).json('recovery email sent');
        }
      });
    }
  );
};
