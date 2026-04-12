import { Request, Response } from "express";
import { db } from "../config/db";
import { Course } from "../types/course";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export const createCourse = async (req: Request, res: Response) => {
    try {
        const { title, duration }: Course = req.body

        const [result] = await db.execute<ResultSetHeader>(
            "INSERT INTO courses (title,duration) VALUES (?,?)",
            [title, duration]
        );
        res.status(201).json({
            message: "Course created Successfully",
            data: result
        })

    } catch (error: any) {
        return res.status(500).json({
            "message": error.message
        })
    }
}

export const updateCourse = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { title, duration } = req.body
        const [result] = await db.execute<ResultSetHeader>(
            "UPDATE courses SET title = COALESCE(?,title) , duration = COALESCE(?,duration) where course_id = ?",
            [title ?? null, duration ?? null, id]
        )
        if (result.affectedRows === 0) {
            return res.status(404).json({
                "message": "Course Not Found."
            })
        }
        if (result.changedRows === 0) {
            return res.status(200).json({
                message: "No Changes made (same data)"
            })
        }
        return res.status(200).json({
            message: "Course Updated Successfully.",
            data: result.affectedRows

        })

    } catch (error: any) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const getCourses = async (req: Request, res: Response) => {
    try {
        const [result] = await db.execute<RowDataPacket[]>(
            "SELECT * FROM courses"
        )

        if (result.length === 0) {
            return res.status(404).json({
                message: "No courses found",
                data: []
            });
        }

        res.status(200).json({
            message: "courses found successfully.",
            data: result[0]
        })


    } catch (error: any) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const deletCourse = async  (req:Request , res: Response) => {
    try{
        const{id} = req.params;
        const[result] = await db.execute <ResultSetHeader> (
            "DELETE FROM courses WHERE course_id = ?",
            [id]
        )
        if(result.affectedRows === 0){
            return res.status(404).json({
                message:"Course Not Found"
            })
        }
        return res.status(200).json({
            "message":"Course Deleted Successfully."
        })

    }catch(error:any){
        res.status(500).json({
            message:error.message
        })
    }
}