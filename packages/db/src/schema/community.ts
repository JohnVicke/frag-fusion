import { relations } from "drizzle-orm";
import {
  mysqlEnum,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

import { post } from "./post";
import { subscriptionsToCommunities } from "./subscriptions-to-communities";
import { user } from "./user";

export const community = mysqlTable(
  "community",
  {
    id: varchar("id", { length: 256 }).primaryKey(),
    creatorId: varchar("creator_id", { length: 256 }).notNull(),
    avatarUrl: varchar("avatar_url", { length: 256 }),
    name: varchar("name", { length: 256 }).notNull(),
    normalizedName: varchar("normalized_name", { length: 256 }).notNull(),
    type: mysqlEnum("type", ["public", "private", "restricted"]).notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 }).notNull(),
    createdAt: timestamp("created_at", { fsp: 3 }).notNull(),
  },
  (table) => ({
    nameIdx: uniqueIndex("name_idx").on(table.name),
  }),
);

export const communityRelations = relations(community, ({ many, one }) => ({
  posts: many(post),
  subscriptions: many(subscriptionsToCommunities),
  creator: one(user, {
    fields: [community.creatorId],
    references: [user.id],
  }),
}));
