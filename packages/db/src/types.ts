import { InferModel } from "drizzle-orm";

import * as schema from "./schema";

export type Community = InferModel<typeof schema.community>;
export type Subscription = InferModel<typeof schema.subscription>;
export type Comment = InferModel<typeof schema.comment>;
export type Post = InferModel<typeof schema.post>;
export type Vote = InferModel<typeof schema.vote>;
export type User = InferModel<typeof schema.user>;
