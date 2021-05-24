const Course = require('../models/Course');
const AWS = require('aws-sdk');
const localStorage = require('local-storage');
const { multipleMongooseToObject } = require('../../util/mongoose');
class SiteController {
  //[Get] /
  async index(req, res,next) {
    let docClient = new AWS.DynamoDB.DocumentClient();
    var role= localStorage.get('username');
    var paramsAuth = {
      TableName: "User",
      Key: {
        "username": role,
      },
    };
    var authTable = await docClient.get(paramsAuth).promise();
    var auth = authTable;
    var params = {
      TableName: "Course",
    };
    var result = await docClient.scan(params).promise();
    console.log(result);
    res.render("home",{courses: result.Items, auth: auth.Item});
  }
   async showlogin(req, res, next) {
    res.render("login");
  }
  async login(req, res, next) {
    localStorage.remove('username');
    let docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
      TableName: "User",
      Key: {
        "username": req.body.username,
      },
    }
    var paramsDL = {
      TableName: "Course",
    };
    var result = await docClient.scan(paramsDL).promise();
     docClient.get(params, function (err, data) {
      if (err) {
        console.log("getdata false" + JSON.stringify(err, null, 2));
      } else {
        if(req.body.password == data.Item.password)
        {
          localStorage.set('username',req.body.username);
          console.log(localStorage.get('username'));
          res.render("home",{courses: result.Items, auth: data.Item});
        }
        else
        {
          res.render("login");
        }
      }
    });
    // var params = {
    //   TableName: "Course",
    // };
    // var result = await docClient.scan(params).promise();
    // res.render("me/stored-courses", { courses: result.Items });
  }

  search(req, res) {
    res.render('search');
  }
}

module.exports = new SiteController();
// const newcontroller= require('/.NewsController')
