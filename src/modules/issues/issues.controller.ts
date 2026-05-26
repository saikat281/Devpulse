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
  } catch (error: any) {
    res.status(500).json({

      success: false,
      message: error.message,

    })
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await isssuesService.getSingleIssueFromDB(id as string);
    return res.status(200).json({
      success: true,
      message: "Issue retrived successfully",
      data: result
    })
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 ? "Something went wrong" : error.message;
    return res.status(500).json({

      success: false,
      message: error.message,

    })
  }
};

const updateIssue = async (req: Request, res: Response) => {
  const { id: issueId } = req.params;
  const { id: userId, role: userRole } = req.user;

  try {
    const result = await isssuesService.updateIssueInDB(
      issueId as string,
      userId as string,
      userRole,
      req.body,
    );
    return res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result
    })
  } catch (error: any) {
    res.status(500).json({

      success: false,
      message: error.message,
      data: error

    })
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await isssuesService.deleteIssueInDB(id as string);
    return res.status(200).json({
      success: true,
      message: "Issue deleted successfully"
    })

  } catch (error: any) {
    res.status(500).json({

      success: false,
      message: error.message,
      data: error

    })
  }
};


export const issuesController = {
  createIssues, getAllIssues, getSingleIssue, updateIssue, deleteIssue
}