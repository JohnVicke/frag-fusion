import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    API_BASE_URL: z.string().min(1),
  },
  runtimeEnv: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
});
