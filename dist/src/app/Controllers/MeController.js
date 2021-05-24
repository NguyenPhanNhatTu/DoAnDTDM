const Course = require("../models/Course");
const AWS = require("aws-sdk");
const {
  mongooseToObject,
  multipleMongooseToObject
} = require("../../util/mongoose");
const localStorage = require("local-storage");
class MeController {
  //Get /stored/courses
  async storedCourses(req, res, next) {
    let docClient = new AWS.DynamoDB.DocumentClient();
    var role = localStorage.get("username");
    var paramsAuth = {
      TableName: "User",
      Key: {
        username: role
      }
    };
    console.log(role);
    var authTable = await docClient.get(paramsAuth).promise();
    var auth = authTable;
    console.log(auth);
    var params = {
      TableName: "Study",
      ProjectionExpression: "#ur,id_course",
      FilterExpression: "#ur = :test",
      ExpressionAttributeNames: {
        "#ur": "username"
      },
      ExpressionAttributeValues: {
        ":test": role
      }
    };
    docClient.scan(params, onScan);
    function onScan(err, data) {
      if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        // print all the movies
        console.log("Scan succeeded.");
        console.log(data.Items);
        var dulieu = [];
        for (let i = 0; i < data.Count; i++) {
          dulieu[i] = data.Items[i].id_course;
        }
        var titleObject = {};
        var index = 0;
        dulieu.forEach(function (value) {
          index++;
          var titleKey = ":titlevalue" + index;
          titleObject[titleKey.toString()] = value;
        });
        var params1 = {
          TableName: "Course",
          FilterExpression: "id_course IN (" + Object.keys(titleObject).toString() + ")",

          ExpressionAttributeValues: titleObject

        };
        docClient.scan(params1, onScan);
        function onScan(err, data1) {
          if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
          } else {
            console.log(auth);
            res.render("me/stored-courses", { courses: data1.Items, auth: auth.Item });
          }
        }
      }
    }
  }

  async storedCoursesStudent(req, res, next) {
    let docClient = new AWS.DynamoDB.DocumentClient();
    var role = localStorage.get("username");
    var paramsAuth = {
      TableName: "User",
      Key: {
        username: role
      }
    };
    console.log(role);
    var authTable = await docClient.get(paramsAuth).promise();
    var auth = authTable;
    console.log(auth);
    var params = {
      TableName: "Study",
      ProjectionExpression: "#ur,id_course",
      FilterExpression: "#ur = :test",
      ExpressionAttributeNames: {
        "#ur": "username"
      },
      ExpressionAttributeValues: {
        ":test": role
      }
    };
    docClient.scan(params, onScan);
    function onScan(err, data) {
      if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        // print all the movies
        console.log("Scan succeeded.");
        console.log(data.Items);
        var dulieu = [];
        for (let i = 0; i < data.Count; i++) {
          dulieu[i] = data.Items[i].id_course;
        }
        var titleObject = {};
        var index = 0;
        dulieu.forEach(function (value) {
          index++;
          var titleKey = ":titlevalue" + index;
          titleObject[titleKey.toString()] = value;
        });
        var params1 = {
          TableName: "Course",
          FilterExpression: "id_course IN (" + Object.keys(titleObject).toString() + ")",

          ExpressionAttributeValues: titleObject

        };
        docClient.scan(params1, onScan);
        function onScan(err, data1) {
          if (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
          } else {
            console.log(auth);
            res.render("me/stored-courses-student", { courses: data1.Items, auth: auth.Item });
          }
        }
      }
    }
  }

  //Get /trash/courses
  trashCourses(req, res, next) {
    Course.findDeleted({}).then(courses => res.render("me/trash-courses", {
      courses: multipleMongooseToObject(courses)
    })).catch(next);
  }
}

module.exports = new MeController();