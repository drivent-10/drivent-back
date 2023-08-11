import { AuthenticatedRequest } from "@/middlewares";
import certificateService from "@/services/certificate-service";
import { Response } from "express";
import httpStatus from "http-status";
import { generateCertificationPdf } from "../utils/certificate-pdf-generator";
export async function getCertification(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const userCertificationData = await certificateService.getCertificationData(userId);
    res.setHeader("Content-Disposition", "inline");
    res.setHeader("Content-Type", "application/pdf");
    const document = generateCertificationPdf(userCertificationData);
    document.pipe(res);
    document.end();
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

