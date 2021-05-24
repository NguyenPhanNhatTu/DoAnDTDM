const express = require('express');
const router = express.Router();

const courseController = require('../app/Controllers/CourseController');

//newsController.index()
router.get('/create', courseController.create);
router.post('/store',courseController.store);
router.post('/handle-form-actions',courseController.handleFormActions);   
router.get('/:id_course/edit',courseController.edit);
router.put('/:id_course',courseController.update);
router.post('/:id_course/student',courseController.addlearn);
router.patch('/:id_course/restore', courseController.restore);
router.delete('/:id_course',courseController.delete);
router.delete('/:id_course/student',courseController.deleteCourseStudent);

router.delete('/:id_course/force',courseController.forceDelete);
router.get('/:id_course', courseController.show);
module.exports = router;
