import { Application } from "express";
import learnerRoutes from "./learnerRoutes";
import courseRoutes from "./courseRoutes";
import enrollmentRoutes from './enrollmentRoutes'

export const registerRoutes = (app:Application) => {
    app.use("/api/learner" , learnerRoutes);
    app.use("/api/course",courseRoutes)
    app.use('/api/enrollment',enrollmentRoutes)
};