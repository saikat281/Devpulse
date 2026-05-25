import type { Request, Response } from "express";
import { isssuesService } from "./issues.service";


const createIssues = async (req: Request, res: Response) => {
  try {
    const id = req.user.id

    const result = await isssuesService.createIssuesInDB(id, req.body);

    res.status(201).json({

      success: true,
      message: "Issue created successfully",
      data:result.rows[0]


    })
  } catch (error: any) {
    res.status(500).json({

      success: false,
      message: error.message,

    })
  };
}
  export const issuesController = {
    createIssues,
  }