import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";

import { db, eq, schema } from "@dq/db";

import { Timestamp } from "~/utils/timestamp";
import { protectedProcedure, t } from "../trpc";

export const postRouter = t.router({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        communityName: z.string(),
        content: z.any(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const id = nanoid();
      await db.insert(schema.post).values({
        id,
        title: input.title,
        content: input.content,
        communityName: input.communityName,
        creatorId: ctx.user.id,
        createdAt: new Timestamp(),
        updatedAt: new Timestamp(),
      });
      return {
        id,
        title: input.title,
        communityName: input.communityName,
      };
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const post = await db.query.post.findFirst({
        where: eq(schema.post.id, input.id),
      });
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      if (post.creatorId !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this post",
        });
      }

      await db.delete(schema.post).where(eq(schema.post.id, input.id));

      return true;
    }),
});
