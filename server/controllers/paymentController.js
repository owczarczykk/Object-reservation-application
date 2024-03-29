const { json } = require('express');
const request = require('request');
const userModel = require('../models/userModel');
const reservationModel = require('../models/reservationModel');
const moment = require('moment');

module.exports.getPayToken = async function (req, res) {
  request(
    {
      method: 'POST',
      url: 'https://secure.snd.payu.com/pl/standard/user/oauth/authorize',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body:
        'grant_type=client_credentials&client_id=' +
        process.env.PAYU_CLIENT_ID +
        '&client_secret=' +
        process.env.PAYU_CLIENT_SECRET,
    },
    function (error, response, body) {
      try {
        let jsonBody = JSON.parse(body);
        res.status(response.statusCode).send(jsonBody.access_token);
      } catch {
        if (error) return res.status(404).json(error);
      }
    },
  );
};

module.exports.removeReservation = async function (req, res) {
  userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { reservations: { _id: req.params.reservationId } },
      $set: { sumPrice: req.body.sumPrice - req.body.price },
    },
    { safe: true, upsert: true, new: true },
    function (err, node) {
      if (err) {
      }
      res.status(200).json(node);
    },
  );
};

module.exports.returnListToSave = async function (req, res, next) {
  const reservations = req.body.reservations;
  let saveToBase = [];
  let iterator = 0;
  let ifPass = true;
  const user = userModel.findOne({ _id: req.user._id });
  for (const item of reservations) {
    let start = moment(item.start);

    let titleDate = start.format('HH:mm');

    let day = start.format('DD');
    let year = start.format('YYYY');
    let month = start.format('MM');
    const dayString = year + '-' + month + '-' + day;
    let reserv = await reservationModel.find(
      {
        dayString: item.dayString,
        title: item.title,
        courtId: item.courtId,
      },
      async function (err, obj) {
        if (err) {
          ifPass = false;
        }
        if (obj.length > 0) {
          ifPass = false;
        } else {
          iterator = iterator + 1;
          saveToBase.push({
            referId: item._id,
            title: item.title,
            start: item.start,
            dayString: item.dayString,
            end: item.end,
            courtId: item.courtId,
            userId: item.userId,
            price: item.price,
            vat: item.vat,
          });
        }
      },
    );
  }

  if (ifPass == true) {
    res.locals.saveToBase = saveToBase;
    await userModel.updateOne(
      {
        _id: req.user._id,
      },
      {
        $set: {
          reservations: [],
          sumPrice: 0,
        },
      },
    );
    next();
  } else {
    await userModel.updateOne(
      {
        _id: req.user._id,
      },
      {
        $set: {
          reservations: [],
          sumPrice: 0,
        },
      },
    );
    return res.status(422).send('Godzina zajęta');
  }
};

module.exports.saveToBase = async function (req, res, next) {
  await reservationModel.insertMany(res.locals.saveToBase);
  next();
};

module.exports.createPayments = async function (req, res) {
  let ids = '';

  ids = `${req.body.reservations[0].userId}`;
  const reservations = req.body.reservations;
  reservations.forEach(value => {
    ids = ids + `,${value._id}`;
  });

  request(
    {
      method: 'POST',
      url: 'https://secure.snd.payu.com/api/v2_1/orders/',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + req.headers.bearer,
      },
      body: JSON.stringify({
        customerIp: '150.254.78.206',
        notifyUrl: 'https://devcourt.projektstudencki.pl/api/notifyy',
        merchantPosId: process.env.PAYU_CLIENT_ID,
        description: 'DEV',
        currencyCode: 'PLN',
        totalAmount: req.body.price,
        continueUrl: 'https://devcourt.projektstudencki.pl/',
        buyer: {
          email: req.user.email,
          phone: '+48 ' + req.user.phone,
          firstName: req.user.name,
          lastName: req.user.surname,
          language: 'pl',
          delivery: {
            postalCode: req.user.adress_postalCode,
            city: req.user.adress_city,
            street: req.user.adress_street,
            countryCode: 'PL',
          },
        },
        products: [
          {
            name: ids,
            unitPrice: req.body.price,
            quantity: '1',
          },
        ],
      }),
    },
    function (error, response, body) {
      let jsonBody = JSON.parse(body);
      if (jsonBody.status.statusCode == 'SUCCESS') {
        return res.status(200).send(body);
      } else if (jsonBody.status.statusCode == 'UNAUTHORIZED') {
        return res.status(401).send(jsonBody.status.codeLiteral);
      } else {
        return res.status(500).send('Problem with PayU server');
      }
      res.end();
    },
  );
};

module.exports.notify = async function (req, res) {
  const response = {
    statusCode: 200,
  };

  const ids = req.body.order.products[0].name.split(',');
  const userId = ids[0];

  ids.shift();

  if (req.body.order.status == 'COMPLETED') {
    await reservationModel.updateMany(
      {
        referId: { $in: ids },
        userId: userId,
        orderId: { $exists: false },
        paid: false,
      },
      {
        $set: {
          paid: true,
          orderId: req.body.order.orderId,
        },
      },
    );

    return res.status(200).send(response);
  } else if (req.body.order.status == 'CANCELED') {
    await reservationModel.deleteMany({
      userId: userId,
      referId: { $in: ids },
      orderId: { $exists: false },
      paid: false,
    });
    return res.status(response);
  }
  res.status(200).send(response);
};

module.exports.getOrderInfo = function (req, res) {
  request(
    {
      method: 'GET',
      url: 'https://secure.snd.payu.com/api/v2_1/orders/' + req.params.orderId,
      headers: {
        Authorization: 'Bearer ' + req.headers.bearer,
      },
    },
    function (error, response, body) {
      let jsonBody = JSON.parse(body);
      res.status(200).send(jsonBody.status.statusCode);
    },
  );
};
