import { createUserActivity, getActivities } from "@/controllers/activities-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";
import { validateBody } from "@/middlewares";
import { createUserActivitySchema } from "@/schemas";

const activitiesRouter = Router()

activitiesRouter
    .all("/*", authenticateToken)
    .get("", getActivities)
    .post("", validateBody(createUserActivitySchema), createUserActivity)

export default activitiesRouter