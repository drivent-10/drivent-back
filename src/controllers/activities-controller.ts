import { AuthenticatedRequest } from "@/middlewares";
import activitiesService from "@/services/activities-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getActivities(req: AuthenticatedRequest, res: Response) {
    try {
        const { userId } = req
        const activities = await activitiesService.getActivities(userId)
        return res.status(httpStatus.OK).send(activities)
    } catch (error) {

        if (error.name === 'NotFoundError') {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        if (error.type === 'unpaid') {
            return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
        }
        if (error.type === 'unavailable') {
            return res.sendStatus(httpStatus.SERVICE_UNAVAILABLE);
        }
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
}

export async function createUserActivity(req: AuthenticatedRequest, res: Response) {
    try {
        const { userId } = req;
        const { activityId } = req.body;
        await activitiesService.createUserActivity(userId, activityId);
        return res.status(httpStatus.OK).send('Vaga reservada com sucesso.');
    } catch (err) {
        if (err.name === "ConflictError") {
            return res.status(httpStatus.CONFLICT).send({
                message: err.message,
            });
        }
        if (err.name === 'PaymentRequiredError') {
            return res.status(httpStatus.PAYMENT_REQUIRED).send({
              message: err.message,
            });
          }
    }
}

