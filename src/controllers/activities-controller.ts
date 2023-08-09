import { AuthenticatedRequest } from "@/middlewares";
import activitiesService from "@/services/activities-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getActivities(req:AuthenticatedRequest, res:Response){
    const {userId} = req
    const activities = await activitiesService.getActivities(userId)
    return res.status(httpStatus.OK).send(activities)
}


