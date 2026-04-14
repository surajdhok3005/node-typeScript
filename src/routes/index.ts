import { Application } from "express";
import learnerRoutes from "./learnerRoutes";
import courseRoutes from "./courseRoutes";
import enrollmentRoutes from './enrollmentRoutes'
import authRoutes from './authRoutes'

export const registerRoutes = (app:Application) => {
    app.use("/api/learner" , learnerRoutes);
    app.use("/api/course",courseRoutes)
    app.use('/api/enrollment',enrollmentRoutes)
    app.use('/api/user',authRoutes)
};