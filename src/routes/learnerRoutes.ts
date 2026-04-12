
import express from "express";

import { createLearner,getLearners, getlearnerById,updateLearner,deleteLearner} from "../contollers/learnerController";

const router = express.Router();

router.post("/create",createLearner);
router.post("/list",getLearners);
router.get("/:id",getlearnerById)
router.put("/:id",updateLearner)
router.delete("/:id",deleteLearner)

export default router
