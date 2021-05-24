const express = require('express');
const router = express.Router();

const meController = require('../app/Controllers/MeController');

//newsController.index()
router.get('/stored/courses', meController.storedCourses);
router.get('/stored/courses/student', meController.storedCoursesStudent);

module.exports = router;
