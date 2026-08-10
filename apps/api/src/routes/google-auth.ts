import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sign, jwt } from "hono/jwt";
import { eq, count } from "drizzle-orm";
import { OAuth2Client } from "google-auth-library";
import { db } from "@app/shared/db";
import { organizers, events } from "@app/shared/schema";
import { googleAuthSchema } from "@app/shared/validators";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET!;

export const googleAuthRoutes = new Hono().post(
  "/google",
  zValidator("json", googleAuthSchema),
  async (c) => {
    const { idToken } = c.req.valid("json");

    // Verify the token with Google — this throws if invalid/expired
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch {
      return c.json({ error: "Invalid Google token" }, 401);
    }

    if (!payload?.email || !payload.sub) {
      return c.json({ error: "Google account has no email" }, 400);
    }

    // Find existing organizer or create a new one
    let [organizer] = await db
      .select()
      .from(organizers)
      .where(eq(organizers.email, payload.email));

    if (!organizer) {
      [organizer] = await db
        .insert(organizers)
        .values({ email: payload.email, googleId: payload.sub })
        .returning();
    } else if (!organizer.googleId) {
      // Existing email/password account — link Google to it
      [organizer] = await db
        .update(organizers)
        .set({ googleId: payload.sub })
        .where(eq(organizers.id, organizer.id))
        .returning();
    }

    const token = await sign(
      { sub: organizer.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
      JWT_SECRET
    );

    const [eventCountRow] = await db
      .select({ count: count() })
      .from(events)
      .where(eq(events.organizerId, organizer.id));

    const isNewAccount = !organizer.onboardingCompleted && (eventCountRow?.count ?? 0) === 0;

    return c.json({
      token,
      organizer: {
        id: organizer.id,
        email: organizer.email,
        onboardingCompleted: organizer.onboardingCompleted,
      },
      needsOnboarding: isNewAccount,
    });
  }
);