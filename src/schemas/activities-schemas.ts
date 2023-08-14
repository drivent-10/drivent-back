import { CreateUserParams } from "@/services/users-service";
import Joi from "joi";

export const createUserActivitySchema = Joi.object({
  activityId: Joi.number().required(),
});
