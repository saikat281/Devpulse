import type { Request, Response } from "express";
import { isssuesService } from "./issues.service";


const createIssues = async (req: Request, res: Response) => {
  try {
    const id = req.user.id

    const result = await isssuesService.createIssuesInDB(id, req.body);

    res.status(201).json({

      success: true,
      message: "Issue created successfully",
      data: result.rows[0]


    })
  } catch (error: any) {
    res.status(500).json({

      success: false,
      message: error.message,


    })
  };
}

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const type = (req.query?.type as string) || null;
    const status = (req.query?.status as string) || null;
    const sort = (req.query?.sort as string) || "newest";

    const queries = {
      sort,
      type,
      status,
    };

    //   console.log(queries)

    const result = await isssuesService.getAllIssuesFromDB(queries);

    return res.status(200).json({
      success: true,
      message: "Issue created successfully",
      data: result
    })
  } catch (error) {
    res.status(500).json({

      success: false,
      message: "Something went Wrong",


    })
  }
};


export const issuesController = {
  createIssues, getAllIssues
}