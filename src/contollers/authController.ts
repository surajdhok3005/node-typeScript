import { Request, Response } from "express";
import { db } from "../config/db";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from "mysql2";


const SECRETE = "demon";

export const register = async (req: Request, res: Response) => {

    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute(
            "INSERT INTO  users (name,email,password) VALUES (?,?,?)",
            [name, email, hashedPassword]
        )
        res.json({
            message: "User Registerd."
        })

    } catch (error: any) {
        res.status(500).json({
            message: error.message
        })
    }


}


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

          const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "User Not Found."
            })
        }
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "invalid Credentials."
            })
        }

        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },
            SECRETE,
            {
                expiresIn: "1h"
            }
        )

        res.json({
            message:"Login Successfull",
            token:token
        })



    } catch (error: any) {
        res.status(500).json({
            message: error.message
        })
    }
}