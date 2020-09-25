const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { timeStamp } = require('console');
const { exit } = require('process');
const { throws } = require('assert');
const port = '7070';
const ip = '127.0.0.1';

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json()); 

app.get('/', function(req, res) 
{  
    res.sendFile(path.join(__dirname, "/public/main.html"));
});

app.get('/tabledata', function(req, res) {
    res.sendFile(path.join(__dirname, "/data.json"));
});

app.post('/reservation', function(req,res) {
    var obj = req.body;
    obj['time'] = Date();
    fs.readFile(path.join(__dirname, '/data.json'), function (err, data) {
        if(err && err.code === "ENOENT") {
         console.log("ENOENT Error");
        }
        else if(err) {
          console.log(err);
        }
        else {
          try {
            var allData = JSON.parse(data);
            var valid = true;
            for (var element in allData.reservations) {
                if (allData.reservations[element].deviceId == obj.deviceId) {
                    console.log("Duplicate request");
                    valid = false;
                    break;
                }
            }
            
            if(valid == true) {
                allData.reservations.push(obj);

                for (var element in allData.devices) {
                    if (allData.devices[element].deviceId == obj.deviceId) {
                        allData.devices.splice(element, 1);
                        break;
                    }
                }

                fs.writeFile(path.join(__dirname, '/data.json'), JSON.stringify(allData), function (err) {
                    if(err) {
                        console.log("Error in writing file " + err);
                    }
                });
            }
          } catch(exception) {
            console.log(exception);
          }
        }
      });
      res.end();
});

app.delete('/delete/:deviceId', function(req, res) {
    var deviceId = req.params.deviceId;
    fs.readFile(path.join(__dirname, '/data.json'), function (err, data) {
        if(err && err.code === "ENOENT") {
         console.log("ENOENT Error");
        }
        else if(err) {
          console.log(err);
        }
        else {
          try {
            var allData = JSON.parse(data);
            var rewrite = false;
            for (var element in allData.reservations) {
                if (allData.reservations[element].deviceId == deviceId) {
                    var obj = {
                      "name": allData.reservations[element].deviceName,
                      "deviceId": deviceId
                    };
                    allData.devices.push(obj);
                    allData.reservations.splice(element, 1);
                    rewrite = true;
                    break;
                }
            }
            
            if(rewrite == true) {
                fs.writeFile(path.join(__dirname, '/data.json'), JSON.stringify(allData), function (err) {
                    if(err) {
                        console.log("Error in writing file " + err);
                    }
                });
            }
          } catch(exception) {
            console.log(exception);
          }
        }
      });
      res.end();
});

app.listen(port, ip, function() {
    console.log("Server running and listening on " + ip + " " + port);
});