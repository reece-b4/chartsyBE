import { fetchAllTasks, fetchTaskById, addTask } from "@/models/tasks.model";
import { Request, Response, NextFunction } from "express";

export const getAllTasks = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tasks = await fetchAllTasks();
    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};
//
export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const result = await fetchTaskById(id);
    console.log("result", result);
    if (result === null) {
      console.log("result is null");
      res.status(404).json({ msg: "Task not found" });
    }
    res.status(200).json({ task: result });
  } catch (error) {
    next(error);
  }
};

export const postTask = async (req: Request,
    res: Response,
    next: NextFunction) => {
  try {
    const task = await addTask(req.body)
    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
}
