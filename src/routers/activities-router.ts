import { getActivities } from "@/controllers/activities-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const activitiesRouter = Router()

activitiesRouter
    .get("", getActivities)

export default activitiesRouter