import { Router } from "express";
import { userRoles } from "../../types";
import auth from "../../middleware/auth";
import { issuesController } from "./issues.controller";


const router = Router();


router.post("/", auth(userRoles.contributor, userRoles.maintainer),issuesController.createIssues,);
router.get('/',issuesController.getAllIssues)

export const issuesRoute = router