import express from "express";
import { createCourse,updateCourse ,getCourses , deletCourse} from "../contollers/courseController";

const router = express.Router()

router.post('/createCourse',createCourse);
router.put('/updateCourse/:id',updateCourse)
router.get('/list',getCourses)
router.delete('/deleteCourse/:id',deletCourse)

export default router