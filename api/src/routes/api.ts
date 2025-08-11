import { Router, Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import axios from "axios";

const router = Router();

router.post("/question", asyncHandler(async (req: Request, res: Response) => {
  const { question } = req.body;
  const response = await axios.post("http://localhost:8000/v1/question", {
    question: question
  });
  res.json(response.data);
}));

export default router;