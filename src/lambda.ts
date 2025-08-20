import "tsconfig-paths/register";
import { app } from "@/app";
import serverless from "@vendia/serverless-express";

export const handler = serverless({ app });
