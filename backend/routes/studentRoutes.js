import express from "express";
import { saveStudent } from "../controllers/studentController.js";

const router = express.Router();

router.post("/", saveStudent);

export default router;
