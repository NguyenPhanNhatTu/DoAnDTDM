const Course = require("../models/Course");
const AWS = require("aws-sdk");
const { mongooseToObject } = require("../../util/mongoose");
const localStorage = require("local-storage");

class CourseController {
  async show(req, res, next) {
    let docClient = new AWS.DynamoDB.DocumentClient();
    var role = localStorage.get("username");
    var paramsAuth = {
      TableName: "User",
      Key: {
        username: role
      }
    };
    var authTable = await docClient.get(paramsAuth).promise();
    var auth = authTable;
    var params = {
      TableName: "Course",
      Key: {
        id_course: req.params.id_course
      }
    };
    docClient.get(params, function (err, data) {
      if (err) {
        console.log("getdata false" + JSON.stringify(err, null, 2));
      } else {
        res.render("courses/show", { course: data.Item, auth: auth.Item });
      }
    });

    // Course.findOne({ slug: req.params.slug })
    // .then(course =>
    //   res.render('courses/show',{course : mongooseToObject(course)})
    // )
    // .catch(next);
  }
  //GET Courses/create
  async create(req, res, next) {
    let docClient = new AWS.DynamoDB.DocumentClient();
    var role = localStorage.get("username");
    var paramsAuth = {
      TableName: "User",
      Key: {
        username: role
      }
    };
    var authTable = await docClient.get(paramsAuth).promise();
    var auth = authTable;
    console.log(auth);
    if (auth.Item.role == "GIAOVIEN") {
      res.render("courses/create", { auth: auth.Item });
    } else {
      res.redirect("/login");
    }
  }
  //Post Courses/store
  async store(req, res, next) {
    try {
      let docClient = new AWS.DynamoDB.DocumentClient();
      var role = localStorage.get("username");
      var paramsAuth = {
        TableName: "User",
        Key: {
          username: role
        }
      };
      var authTable = await docClient.get(paramsAuth).promise();
      var auth = authTable;
      if (auth.Item.role == "GIAOVIEN") {
        const formData = req.body;
        formData.image = `https://img.youtube.com/vi/${req.body.videoID}/sddefault.jpg`;
        var id;
        var ngayHienTai = new Date();
        ngayHienTai.setDate(ngayHienTai.getDate());
        id = ngayHienTai.toISOString();
        var params = {
          TableName: "Course",
          Item: {
            id_course: id,
            name_course: formData.name_course,
            decriptions: formData.decriptions,
            image: formData.image,
            videoID: formData.videoID
          }
        };
        docClient.put(params, function (err, data) {
          if (err) {
            console.log("getdata false" + JSON.stringify(err, null, 2));
          } else {
            var paramsStudy = {
              TableName: "Study",
              Item: {
                id_course: id,
                username: role
              }
            };
            docClient.put(paramsStudy, function (err, data) {
              if (err) {
                console.log("getdata false" + JSON.stringify(err, null, 2));
              } else {
                res.redirect("/me/stored/courses");
              }
            });
          }
        });
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      res.redirect("/login");
    }
  }
  //GET Courses/:id/edit
  async edit(req, res, next) {
    let docClient = new AWS.DynamoDB.DocumentClient();
    var role = localStorage.get("username");
    var paramsAuth = {
      TableName: "User",
      Key: {
        username: role
      }
    };
    var authTable = await docClient.get(paramsAuth).promise();
    var auth = authTable;
    console.log(auth);
    if (auth.Item.role == "GIAOVIEN") {
      var params = {
        TableName: "Course",
        Key: {
          id_course: req.params.id_course
        }
      };
      docClient.get(params, function (err, data) {
        if (err) {
          console.log("getdata false" + JSON.stringify(err, null, 2));
        } else {
          res.render("courses/edit", { course: data.Item, auth: auth.Item });
        }
      });
    } else {
      res.redirect("/login");
    }
  }
  //PUT Courses/:id
  async update(req, res, next) {
    let docClient = new AWS.DynamoDB.DocumentClient();
    var role = localStorage.get("username");
    var paramsAuth = {
      TableName: "User",
      Key: {
        username: role
      }
    };
    var authTable = await docClient.get(paramsAuth).promise();
    var auth = authTable;
    if (auth.Item.role == "GIAOVIEN") {
      const formData = req.body;
      var anhYT = `https://img.youtube.com/vi/${req.body.videoID}/sddefault.jpg`;
      var params = {
        TableName: "Course",
        Key: {
          id_course: req.params.id_course
        },
        UpdateExpression: "set  name_course= :r, decriptions= :p, videoID= :a, image = :i",
        ExpressionAttributeValues: {
          ":r": formData.name_course,
          ":p": formData.decriptions,
          ":a": formData.videoID,
          ":i": anhYT
        },
        ReturnValues: "UPDATED_NEW"
      };
      await docClient.update(params, function (err, data) {
        if (err) {
          console.log("getdata false" + JSON.stringify(err, null, 2));
        } else {
          res.redirect("/me/stored/courses");
        }
      });
    } else {
      res.redirect("/login");
    }
  }
  //Delete Courses/:id
  async delete(req, res, next) {
    var dem = 0;
    let docClient = new AWS.DynamoDB.DocumentClient();
    var role = localStorage.get("username");
    var paramsAuth = {
      TableName: "User",
      Key: {
        username: role
      }
    };
    var authTable = await docClient.get(paramsAuth).promise();
    var auth = authTable;
    if (auth.Item.role == "GIAOVIEN") {
      const formData = req.body;
      let docClient = new AWS.DynamoDB.DocumentClient();
      var params = {
        TableName: "Course",
        Key: {
          id_course: req.params.id_course
        }
      };
      await docClient.delete(params, function (err, data) {
        if (err) {
          console.log("getdata false" + JSON.stringify(err, null, 2));
        } else {
          var paramsStudy = {
            TableName: "Study",
            ProjectionExpression: "#id,username",
            FilterExpression: "#id = :test",
            ExpressionAttributeNames: {
              "#id": "id_course"
            },
            ExpressionAttributeValues: {
              ":test": req.params.id_course
            }
          };
          docClient.scan(paramsStudy, onScan);
          function onScan(err, data) {
            if (err) {
              console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
              // print all the movies
              console.log("Scan succeeded.");
              var dulieu = [];
              for (let i = 0; i < data.Count; i++) {
                dulieu[i] = data.Items[i];
              }
              for (let i = 0; i < data.Count; i++) {
                var paramsStudy1 = {
                  TableName: "Study",
                  Key: {
                    id_course: req.params.id_course,
                    username: data.Items[i].username
                  }
                };
                docClient.delete(paramsStudy1, function (err, data) {
                  if (err) {
                    console.log("getdata false" + JSON.stringify(err, null, 2));
                  } else {
                    dem = dem + 1;
                  }
                });
              }
              console.log(dem);
              res.redirect("/me/stored/courses");
            }
          }

          // var paramsStudy = {
          //   TableName: "Study",
          //   Key: {
          //     id_course: req.params.id_course,
          //     username: "duynao4"
          //   },
          // };
          // docClient.delete(paramsStudy, function (err, data) {
          //   if (err) {
          //     console.log("getdata false" + JSON.stringify(err, null, 2));
          //   } else {
          //     var paramsStudy1 = {
          //       TableName: "Study",
          //       Key: {
          //         id_course: req.params.id_course,
          //         username: "giaovien"
          //       },
          //     };
          //     docClient.delete(paramsStudy1, function (err, data) {
          //       if (err) {
          //         console.log("getdata false" + JSON.stringify(err, null, 2));
          //       } else {
          //         res.redirect("/me/stored/courses");
          //       }
          //     });
          //   }
          // });
        }
      });
    } else {
      res.redirect("/login");
    }
  }

  async addlearn(req, res, next) {
    try {
      console.log(req.params.id_course);
      let docClient = new AWS.DynamoDB.DocumentClient();
      var role = localStorage.get("username");
      var paramsAuth = {
        TableName: "User",
        Key: {
          username: role
        }
      };
      var authTable = await docClient.get(paramsAuth).promise();
      var auth = authTable;
      if (auth.Item.role == "SINHVIEN") {
        var paramsStudy = {
          TableName: "Study",
          Item: {
            id_course: req.params.id_course,
            username: role
          }
        };
        docClient.put(paramsStudy, function (err, data) {
          if (err) {
            console.log("getdata false" + JSON.stringify(err, null, 2));
          } else {
            res.redirect("/me/stored/courses/student");
          }
        });
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      res.redirect("/login");
    }
  }

  //Delete Courses/:id
  async deleteCourseStudent(req, res, next) {
    console.log("Vao delete roi ne");
    let docClient = new AWS.DynamoDB.DocumentClient();
    var role = localStorage.get("username");
    var paramsAuth = {
      TableName: "User",
      Key: {
        username: role
      }
    };
    var authTable = await docClient.get(paramsAuth).promise();
    var auth = authTable;
    if (auth.Item.role == "SINHVIEN") {
      let docClient = new AWS.DynamoDB.DocumentClient();
      var params = {
        TableName: "Study",
        Key: {
          id_course: req.params.id_course,
          username: role
        }
      };
      await docClient.delete(params, function (err, data) {
        if (err) {
          console.log("getdata false" + JSON.stringify(err, null, 2));
        } else {
          res.redirect("/me/stored/courses/student");
        }
      });
    } else {
      res.redirect("/login");
    }
  }
  // [PATCH] /courses/:id/restore
  restore(req, res, next) {
    Course.restore({ _id: req.params.id }).then(() => res.redirect("back")).catch(next);
  }
  forceDelete(req, res, next) {
    Course.deleteOne({ _id: req.params.id }).then(() => res.redirect("back")).catch(next);
  }
  // [PATCH] /courses/handle-form-actions
  handleFormActions(req, res, next) {
    switch (req.body.action) {
      case "delete":
        Course.delete({ _id: { $in: req.body.courseIds } }).then(() => res.redirect("back")).catch(next);
        break;
      default:
        res.json({ message: "Action is invalid!!" });
    }
  }
}

module.exports = new CourseController();