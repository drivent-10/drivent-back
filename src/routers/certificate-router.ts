import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getCertification } from "@/controllers/certificate-controller";

const certificateRouter = Router();

certificateRouter
  .all("/*", authenticateToken)
  .get("/", getCertification);

export { certificateRouter };
