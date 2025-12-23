import express from "express";
import { 
  createLogbookEntry, 
  getLogbookEntries, 
  getStudentLogbook 
} from "../controllers/logbookcontroller.js";

const router = express.Router();

router.post("/", createLogbookEntry);
router.get("/", getLogbookEntries);
router.get("/student/:studentId", getStudentLogbook);

export default router;
