import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sign, jwt } from "hono/jwt";
import { eq, count } from "drizzle-orm";
import { db } from "@app/shared/db";
import { organizers, events } from "@app/shared/schema";
import { registerSchema, loginSchema } from "@app/shared/validators";
import { hashPassword, verifyPassword } from "../lib/password.js";

const JWT_SECRET = process.env.JWT_SECRET || "";

function organizerPayload(organizer: {
  id: string;
  email: string;
  onboardingCompleted: boolean;
}) {
  return {
    id: organizer.id,
    email: organizer.email,
    onboardingCompleted: organizer.onboardingCompleted,
  };
}

export const authRoutes = new Hono()
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const existing = await db.select().from(organizers).where(eq(organizers.email, email));
    if (existing.length > 0) {
      return c.json({ error: "Email already registered" }, 409);
    }

    const [organizer] = await db
      .insert(organizers)
      .values({ email, passwordHash: hashPassword(password) })
      .returning({
        id: organizers.id,
        email: organizers.email,
        onboardingCompleted: organizers.onboardingCompleted,
      });

    const token = await sign(
      { sub: organizer.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
      JWT_SECRET
    );
    return c.json(
      { token, organizer: organizerPayload(organizer), needsOnboarding: true },
      201
    );
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const [organizer] = await db.select().from(organizers).where(eq(organizers.email, email));
    if (
      !organizer ||
      !organizer.passwordHash ||
      !verifyPassword(password, organizer.passwordHash)
    ) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    const token = await sign(
      { sub: organizer.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
      JWT_SECRET
    );

    const [eventCountRow] = await db
      .select({ count: count() })
      .from(events)
      .where(eq(events.organizerId, organizer.id));

    const needsOnboarding =
      !organizer.onboardingCompleted && (eventCountRow?.count ?? 0) === 0;

    return c.json({
      token,
      organizer: organizerPayload(organizer),
      needsOnboarding,
    });
  })
  .get("/me", jwt({ secret: JWT_SECRET, alg: "HS256" }), async (c) => {
    const { sub: organizerId } = c.get("jwtPayload") as { sub: string };

    const [organizer] = await db
      .select({
        id: organizers.id,
        email: organizers.email,
        onboardingCompleted: organizers.onboardingCompleted,
      })
      .from(organizers)
      .where(eq(organizers.id, organizerId));

    if (!organizer) {
      return c.json({ error: "Organizer not found" }, 404);
    }

    const [eventCountRow] = await db
      .select({ count: count() })
      .from(events)
      .where(eq(events.organizerId, organizerId));

    return c.json({
      organizer: organizerPayload(organizer),
      eventCount: eventCountRow?.count ?? 0,
      needsOnboarding:
        !organizer.onboardingCompleted && (eventCountRow?.count ?? 0) === 0,
    });
  })
  .post("/complete-onboarding", jwt({ secret: JWT_SECRET, alg: "HS256" }), async (c) => {
    const { sub: organizerId } = c.get("jwtPayload") as { sub: string };

    const [organizer] = await db
      .update(organizers)
      .set({ onboardingCompleted: true })
      .where(eq(organizers.id, organizerId))
      .returning({
        id: organizers.id,
        email: organizers.email,
        onboardingCompleted: organizers.onboardingCompleted,
      });

    if (!organizer) {
      return c.json({ error: "Organizer not found" }, 404);
    }

    return c.json({ organizer: organizerPayload(organizer) });
  });
