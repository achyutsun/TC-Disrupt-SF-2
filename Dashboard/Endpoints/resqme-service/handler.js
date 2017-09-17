'use strict';
const AWS = require("aws-sdk");
const async = require('async');
const docClient = new AWS.DynamoDB.DocumentClient();
const https = require("https");

/**
 * export functions
 * @param event
 * @param context
 * @param callback
 */
module.exports.getAllRequests = (event, context, callback) => {
    console.log('sdsdss');
    getAllRequests(callback);
};
/*module.exports.getAllRequests = (event, context, cb) => cb(null,
    { message: 'SC@AWS is healthy!', event }
);*/

module.exports.getUserById = (event, context, callback) => {
    const user_id = event.path.userId;
    console.log('userid: ', event);

    getUserByUserId(user_id, callback);

};
module.exports.updateSaveStatusToTrue = (event, context, callback) => {
    const user_id = event.path.userId;
    console.log('userid: ', event);

    updateSaveStatus(user_id, callback);
};



module.exports.addRequest = (event, context, callback) => {
    const message = event.path.message;
    const phone = event.path.phone;
    // sample messages
    // help! stuck in a flood. My address is 3001 telegraph avenue berkeley
    // help. fire. address telegraph avenue berkeley
    const disasterTypes = ['fire', 'landslide', 'hurricane', 'earthquake', 'flood'];
    console.log('message: ', message);
    console.log('phone: ', phone);
    let type = 'unknown';
    var i;
    for (i = 0; i < disasterTypes.length; i++) {
        if (message.includes(disasterTypes[i])) {
            type = disasterTypes[i];
            break;
        }
    }
    var X = 'My%20address%20is';
    console.log('message.indexOf(X)', message.indexOf(X));
    console.log('X.length', X.length);
    console.log('message.length', message.length);

    var address = message.slice((message.indexOf(X) + X.length), message.length);

    // const address = message.substring(message.indexOf(ind)+X.length, message.length);
    console.log('address ', address);
// get coordinates by address
    const url =
        `https://www.mapquestapi.com/geocoding/v1/address?key=UShjaMayAC4UkuBJ5nu5rqFuraxzEOQU&inFormat=kvp&outFormat=json&location=${address}&thumbMaps=false`;
    https.get(url, res => {
        res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
        body += data;
});
    res.on("end", () => {
        console.log('body: ', body);
    body = JSON.parse(body);
    persistRequest(body.results[0].locations[0].latLng.lat, body.results[0].locations[0].latLng.lng, type, phone, callback);
});
});
};

function persistRequest(lat, lng, type, phone, callback) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://trekr.com:27018/nehadb";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var myobj = {
            user_id: "usertest",
            latitude: lat,
            longitude: lng,
            saved: false,
            type: type,
            phone: phone,
            is_help_request: true
        };
        db.collection("requests").insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
            callback(null, {statusCode: 200, body: myobj})
        });
    });
}

function updateSaveStatus(user_id, callback) {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://trekr.com:27018/nehadb";

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var myquery = { user_id: user_id };
        var newvalues = {$set: {saved: true} };
        db.collection("requests").updateMany(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log(res.result.nModified + " document(s) updated");
            db.close();
        });
    });
}
function getAllRequests(callback) {

    var MongoClient = require('mongodb').MongoClient
        , format = require('util').format;

    MongoClient.connect('mongodb://trekr.com:27018/nehadb', function (err, db) {
        if (err) {
            console.log(err);
        }
        else {
            mongoFind(db, 'requests', function (user_res) {
                console.log(user_res);
                callback(null, {statusCode: 200, body: user_res});
                db.close();
            });
        }

        console.log('Disconnected from server successfully');
    });
}

function getUserByUserId(id, callback) {
    console.log('works');

    var MongoClient = require('mongodb').MongoClient
        , format = require('util').format;

    MongoClient.connect('mongodb://trekr.com:27018/nehadb', function (err, db) {
        if (err) {
            console.log(err);
        }
        else {
            mongoFindById(db, 'users', id, function (user_res) {
                console.log(user_res);
                callback(null, {statusCode: 200, body: user_res});
                db.close();
            });
        }
    });
}

function mongoFind(db, collection_name, cb) {
    var collection = db.collection(collection_name);

    var query = { saved: false };
    collection.find(query).toArray(function (err, res) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('results', res);
            console.log('Inserted into the ' + collection_name + ' collection');
            cb(res);
        }
    });
}

function mongoFindById(db, collection_name, id, cb) {
    var collection = db.collection(collection_name);
    //const response = {users: []};

    collection.find({user_id: id}).toArray(function (err, res) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('results', res, 'id: ', id);
            /*res.forEach((item) => {
                response.users.push(item);
            });*/
            console.log('Found from ' + collection_name + ' collection');
            cb(res);
        }
    });
}