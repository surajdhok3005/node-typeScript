import express from "express";
import { createEnrollment,getLearnerWithCourses } from "../contollers/enrollmentController";

const router = express.Router();
 router.post('/create',createEnrollment);
 router.get('/details',getLearnerWithCourses)

 export default router