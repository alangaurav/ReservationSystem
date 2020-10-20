const express = require('express');
const MongoClient = require('mongodb').MongoClient
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const path = require('path');
const { error } = require('console');

const port = '7070';
const ip = '127.0.0.1';
const connectionString = 'mongodb://127.0.0.1:27017';

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());

const sessionStore = new MongoStore({
  url: connectionString,
  dbName: 'socsw',
  collection: 'sessions'
});

app.use(session({
  secret: 'sfhAkjhHAJKjhsAKJh',
  store: sessionStore,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 5 * 60 * 1000,
  }
}));

app.get('/', function (req, res) {
  if (req.session.user == "admin")
    res.redirect('/dashboard-admin');
  else if (req.session.authenticated)
    res.redirect('/dashboard');
  else
    res.sendFile(path.normalize(__dirname + '/public/views/login.html'));
});

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    const db = client.db('socsw');

    const usersCollection = db.collection('users');
    const devicesCollection = db.collection('devices');
    const pcsCollection = db.collection('pcs');

    app.post('/login', function (req, res) {
      var userid = req.body.uid;
      var pass = req.body.upass;

      usersCollection.findOne({ 'uid': userid })
        .then(results => {
          if(!results)
            res.redirect('/');
          else if (pass == results.password) {
            req.session.user = userid;
            req.session.authenticated = true;

            if (userid == 'admin')
              res.redirect('/dashboard-admin');
            else
              res.redirect('/dashboard');
          }
          else {
            req.session.authenticated = false;
            res.redirect('/');
          }
        })
        .catch(error => console.error(error));
    })

    app.get('/dashboard', function (req, res) {
      if (req.session.authenticated && req.session.user != 'admin') {
        res.sendFile(path.normalize(__dirname + '/public/views/dashboard.html'));
      }
      else
        res.redirect('/');
    })

    app.get('/device-data', function (req, res) {
      if (req.session.authenticated) {
        var deviceData = [];

        var cursor = devicesCollection.find({}, { _id: 0 });
        cursor.forEach(function (doc, err) {
          deviceData.push(doc);
        }, function () {
          res.json(deviceData);
        });
      }
      else
        res.redirect('/');
    })

    app.get('/current-user', function (req, res) {
      if (req.session.authenticated) {
        usersCollection.findOne({ 'uid': req.session.user }, { projection: { _id: 0, password: 0 } })
          .then(results => {
            res.json(results);
          })
          .catch(error => console.error(error));
      }
      else
        res.redirect('/');
    })

    app.get('/user-data', function (req, res) {
      if (req.session.user == 'admin') {
        var userData = [];
        var cursor = usersCollection.find({ name: { $ne: 'admin' } }, { projection: { _id: 0, _password: 0 } });
        cursor.forEach(function (doc, err) {
          userData.push(doc);
        }, function () {
          res.json(userData);
        });
      }
      else
        res.redirect('/');
    })

    app.get('/pc-data', function (req, res) {
      if (req.session.authenticated) {
        var pcData = [];

        var cursor = pcsCollection.find({}, { projection: { _id: 0 } });
        cursor.forEach(function (doc, err) {
          pcData.push(doc);
        }, function () {
          res.json(pcData);
        });
      }
      else
        res.redirect('/');
    })

    app.get('/dashboard-admin', function (req, res) {
      if (req.session.user == 'admin') {
        res.sendFile(path.normalize(__dirname + '/public/views/dashboard-admin.html'));
      }
      else
        res.redirect('/');
    })

    app.post('/add-device', function (req, res) {
      if (req.session.user == "admin") {
        devicesCollection.findOneAndUpdate(
          { 'did': req.body.deviceId },
          {
            '$setOnInsert':
              { 'did': req.body.deviceId, 'name': req.body.deviceName, 'pcip': req.body.devicePC, 'inUse': false, 'currentUser': null }
          },
          { upsert: true })
          .then(results => {
            res.redirect('/dashboard-admin');
          })
          .catch(error => console.error(error))
      }
      else
        res.redirect('/');
    })

    app.post('/update-device', function (req, res) {
      if (req.session.user == "admin") {
        devicesCollection.findOneAndUpdate(
          { 'did': req.body.id },
          {
            '$set':
              { 'did': req.body.id, 'name': req.body.name, 'pcip': req.body.ip }
          },
          { upsert: false })
          .then(results => {
            res.redirect('/dashboard-admin');
          })
          .catch(error => console.error(error))
      }
      else
        res.redirect('/');
    })

    app.post('/add-pc', function (req, res) {
      if (req.session.user == "admin") {
        pcsCollection.findOneAndUpdate(
          { 'ip': req.body.pcip },
          {
            '$setOnInsert':
              { 'name': req.body.PCName, 'ip': req.body.pcip }
          },
          { upsert: true })
          .then(results => {
            res.redirect('/dashboard-admin');
          })
          .catch(error => console.error(error))
      }
      else
        res.redirect('/');
    })

    app.post('/update-pc', function (req, res) {
      if (req.session.user == "admin") {
        pcsCollection.findOneAndUpdate(
          { 'ip': req.body.ip },
          {
            '$set':
              { 'name': req.body.name, 'ip': req.body.ip }
          },
          { upsert: false })
          .then(results => {
            res.redirect('/dashboard-admin');
          })
          .catch(error => console.error(error))
      }
      else
        res.redirect('/');
    })

    app.post('/add-user', function (req, res) {
      if (req.session.user == "admin") {
        usersCollection.findOneAndUpdate(
          { 'uid': req.body.uid },
          {
            '$setOnInsert':
              { 'uid': req.body.uid, 'name': req.body.uname, 'uip': req.body.uIP, 'password': 'siso@123' }
          },
          { upsert: true })
          .then(results => {
            res.redirect('/dashboard-admin');
          })
          .catch(error => console.error(error))
      }
      else
        res.redirect('/');
    })

    app.post('/update-user', function (req, res) {
      if (req.session.authenticated) {
        usersCollection.findOneAndUpdate(
          { 'uid': req.body.uid },
          {
            '$set':
              { 'uid': req.body.uid, 'name': req.body.uname, 'uip': req.body.uIP }
          },
          { upsert: false })
          .then(results => {
            res.redirect('/dashboard');
          })
          .catch(error => console.error(error))
      }
      else
        res.redirect('/');
    })

    app.post('/reserve-device', function (req, res) {
      if (req.session.authenticated) {
        devicesCollection.findOneAndUpdate(
          { 'did': req.body.deviceId },
          {
            '$set':
              { 'inUse': true, 'currentUser': req.session.user }
          },
        )
          .then(results => {
            res.sendStatus(200);
          })
          .catch(error => console.error(error))
      }
      else
        res.redirect('/');
    })

    app.post('/remove-device', function (req, res) {
      if (req.session.authenticated) {
        devicesCollection.findOneAndUpdate(
          { 'did': req.body.deviceId },
          {
            '$set':
              { 'inUse': false, 'currentUser': null }
          },
        )
          .then(results => {
            res.sendStatus(200);
          })
          .catch(error => console.error(error))
      }
      else
        res.redirect('/');
    })

    app.post('/reserve-pc', function (req, res) {
      if (req.session.authenticated) {
        pcsCollection.findOneAndUpdate(
          { 'ip': req.body.pcip },
          {
            '$set':
              { 'inUse': true, 'currentUser': req.session.user }
          },
        )
          .then(results => {
            res.sendStatus(200);
          })
          .catch(error => console.error(error))
      }
      else
        res.redirect('/');
    })

    app.post('/remove-pc', function (req, res) {
      if (req.session.authenticated) {
        pcsCollection.findOneAndUpdate(
          { 'ip': req.body.pcip },
          {
            '$set':
              { 'inUse': false, 'currentUser': null }
          },
        )
          .then(results => {
            res.sendStatus(200);
          })
          .catch(error => console.error(error))
      }
      else
        res.redirect('/');
    })

    app.delete('/delete-device', function (req, res) {
      if (req.session.user == 'admin') {
        devicesCollection.deleteOne({ did: req.body.deviceId })
          .then(results => {
            res.sendStatus(200);
          })
          .catch(error => console.error(error))
      }
      else
        res.redirect('/');
    })

    app.delete('/delete-user', function (req, res) {
      if (req.session.user == 'admin') {
        usersCollection.deleteOne({ uid: req.body.uid })
          .then(results => {
            res.sendStatus(200);
          })
          .catch(error => console.error(error))
      }
      else
        res.redirect('/');
    })

    app.delete('/delete-pc', function (req, res) {
      if (req.session.user == 'admin') {
        pcsCollection.deleteOne({ ip: req.body.pcip })
          .then(results => {
            res.sendStatus(200);
          })
          .catch(error => console.error(error))
      }
      else
        res.redirect('/');
    })

    app.get('/logout', function (req, res) {
      req.session.destroy((err) => {
        if (err)
          console.log(err);
        res.redirect('/');
      });
    });
  }).catch(error => console.error(error));

app.listen(port, ip, function () {
  console.log("Server running and listening on " + ip + " " + port);
});