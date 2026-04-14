import { Request, Response } from "express";
import { db } from "../config/db";
import { Enrollment } from "../types/enrollment";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import {io} from '../app';

export const createEnrollment = async (req: Request, res: Response) => {
    const connection = await db.getConnection()
    try {

        const { learner_id, course_id }: Enrollment = req.body
        await connection.beginTransaction()

        if (!learner_id || !course_id) {
            return res.status(400).json({
                message: "learner_id and course_id are mandetory."
            })
        }

        const [learner] = await connection.execute<RowDataPacket[]>(
            "SELECT * FROM learners WHERE learner_id = ?",
            [learner_id]
        )
        if (learner.length === 0) {
            return res.status(404).json({
                message: "Learner Not Found."
            })
        }
        const [course] = await connection.execute<RowDataPacket[]>(
            "SELECT * FROM courses WHERE course_id = ?",
            [course_id]
        )
        if (course.length === 0) {
            return res.status(404).json({
                message: "course Not Found."
            })
        }

        const [exiting] = await connection.execute<RowDataPacket[]>(
            "SELECT * FROM enrollments WHERE learner_id= ? AND course_id = ?",
            [learner_id, course_id]
        )
        if (exiting.length > 0) {
            return res.status(400).json({
                message: "Already enrolled in this course"
            })
        }

        const [result] = await connection.execute<ResultSetHeader>(
            "INSERT INTO enrollments (learner_id , course_id) VALUES (?,?)",
            [learner_id, course_id]
        )

            io.emit("new enrollment",{
                learner_id,
                course_id,
                message:"New Enrollment happend"
            });

            


        await connection.commit()
        return res.status(200).json({
            message: "Enrollment Created Successfully(transaction).",
            data: result.affectedRows
        })

    } catch (error: any) {
      await connection.rollback();
         res.status(400).json({
      message: error.message || "Transaction failed"
    });
    } finally{
        connection.release()
    }
}

export const getLearnerWithCourses = async (req: Request, res: Response) => {
    try {

        const [result] = await db.execute<RowDataPacket[]>(
            `SELECT 
            l.learner_id,
            l.name,
            c.title
            FROM learners l
            LEFT JOIN enrollments e ON l.learner_id = e.learner_id
            LEFT JOIN courses c ON e.course_id = c.course_id`

        )
        res.json({
            message: "Data fetched successfully",
            data: result
        });


    } catch (error: any) {
        return res.status(500).json({
            message: error.message
        })
    }
}