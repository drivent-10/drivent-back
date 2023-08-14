import { singInPost, singInWithGitPost } from "@/controllers";
import { validateBody } from "@/middlewares";
import { signInWithGitSchema, signInSchema } from "@/schemas";
import { Router } from "express";

const authenticationRouter = Router();

authenticationRouter.post("/sign-in", validateBody(signInSchema), singInPost);
authenticationRouter.post("/sign-in-git", validateBody(signInWithGitSchema), singInWithGitPost);

export { authenticationRouter };
