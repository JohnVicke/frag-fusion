import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { Webhook, WebhookRequiredHeaders } from "svix";

import { exhaustive } from "~/utils/exhaustive";
import { env } from "~/env/server";
import { handleUserCreation } from "./_handlers/user-creation";
import { handleUserDeletion } from "./_handlers/user-deletion";
import { handleUserUpdate } from "./_handlers/user-update";

type AllowedEventTypes = "user.created" | "user.updated" | "user.deleted";
type VerifiedPayload = Extract<WebhookEvent, { type: AllowedEventTypes }>;

export async function POST(req: Request) {
  const body = await req.text();
  const webHook = new Webhook(env.CLERK_WEBHOOK_SECRET);

  try {
    const payload = webHook.verify(body, getSvixHeaders()) as VerifiedPayload;
    switch (payload.type) {
      case "user.created":
        return handleUserCreation(payload.data);
      case "user.updated":
        return handleUserUpdate(payload.data);
      case "user.deleted": {
        return handleUserDeletion(payload.data);
      }
      default:
        return exhaustive(payload);
    }
  } catch (error) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
}

function getSvixHeaders() {
  const requestHeaders = headers();
  return {
    "svix-id": requestHeaders.get("svix-id") ?? "",
    "svix-timestamp": requestHeaders.get("svix-timestamp") ?? "",
    "svix-signature": requestHeaders.get("svix-signature") ?? "",
  } satisfies WebhookRequiredHeaders;
}
