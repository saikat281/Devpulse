import { pool } from "../../db";
import type { IssueStatus, IssueType } from "../../types";
import type { IIssues } from "./issues.interface";


const issueTypes: IssueType[] = ["bug", "feature_request"];
const issueStatus: IssueStatus[] = ["in_progress", "open", "resolved"];

const createIssuesInDB = async (id: number, payload: IIssues) => {


    const { title, description, type, status } = payload;
    
    if (!issueTypes.includes(type)) {
        throw new Error("Invalid type input!");
    }
    if (status && !issueStatus.includes(status)) {
        throw new Error("Invalid status input");
    }
    const result = await pool.query(
        `
    INSERT INTO issues(title , description , type , status , reporter_id) VALUES ($1 , $2 , $3 , COALESCE($4 , 'open'), $5) RETURNING *
    `,
        [title, description, type, status, id],
    );

    return result;
};


export const isssuesService = {
    createIssuesInDB,
}