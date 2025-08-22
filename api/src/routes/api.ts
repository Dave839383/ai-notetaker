import { Router, Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import axios from "axios";

const router = Router();

router.post("/question", asyncHandler(async (req: Request, res: Response) => {
  const { question } = req.body;
  const response = await axios.post("http://localhost:8000/v1/ask", {
    question: question
  });
  res.json(response.data);
}));

// in the future this will simply add the note to a dynamo db table here
router.post("/note", asyncHandler(async (req: Request, res: Response) => {
  console.log("note request ", req.body);
  const { text } = req.body;
  const response = await axios.post("http://localhost:8000/v1/note", {
    text: text
  });
  console.log("note response ", response.data);
  res.json(response.data);
}));

export default router;