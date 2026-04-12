import {Request , Response} from "express";
import { db } from "../config/db";
import { Learner } from "../types/learner";
import { ResultSetHeader,RowDataPacket  } from "mysql2";


export const createLearner = async (req: Request, res: Response) => {
  try {
    const { name, email, age }: Learner = req.body;

    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO learners (name,email,age) VALUES (?,?,?)",
      [name, email, age]
    );
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM learners WHERE learner_id = ?",
      [result.insertId]
    );

    return res.status(201).json({
      message: "Learner created successfully",
      data: rows[0],
    });

  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      message: "Error creating learner",
    });
  }
};

export const getLearners = async (req:Request ,res:Response) => {

    try{

        const [rows] = await db.execute(
             "SELECT * FROM learners")

             res.json({
                message:"Learners fetched Successfully",
                data:rows
             })

    }catch(error){
        console.log(error);
        res.status(500).json({
            message:"Error Fetching Leaners."
        })
    }






}

export const getlearnerById = async (req:Request , res:Response) => {

    const {id} = req.params;

    const[rows] = await db.execute <RowDataPacket[]> (
        "SELECT  *  FROM learners WHERE learner_id = ?",
        [id]
    )

    if(rows.length === 0 ){
        return res.status(404).json({
            message:"Learner Not Found"
        })
    }
    res.json({
        message:"Learner Fetched Successfully",
        data:rows[0]
    })

}

export const updateLearner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE learners 
       SET name = COALESCE(?, name),
           age = COALESCE(?, age),
           email = COALESCE(?, email)
       WHERE learner_id = ?`,
      [name ?? null, age ?? null, email ?? null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Learner Not Found" });
    }

    if (result.changedRows === 0) {
      return res.status(200).json({
        message: "No changes made (same data)",
      });
    }

    return res.status(200).json({
      message: "Learner Updated Successfully",
      affectedRows: result.affectedRows,
    });

  } catch (error: any) {
    console.log(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      message: "Error updating learner",
    });
  }
};

export const deleteLearner = async (req : Request , res : Response) => {

    try{
        const{id} = req.params

        const[result] = await db.execute <ResultSetHeader> (
            "DELETE FROM learners WHERE learner_id = ?",
            [id]
        );
        if(result.affectedRows === 0){
            return res.status(404).json({
                message:"Learner Not Found"
            })
        }
        res.json({
            message:"Learner Deleted Successfully."
        })


    }catch(error){
        return res.status(500).json({
            message:"Error"
        })
    }





}