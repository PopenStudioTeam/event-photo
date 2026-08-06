import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { sign } from "hono/jwt";
import { eq } from "drizzle-orm";
import { db } from "@app/shared/db";
import { organizers } from "@app/shared/schema";
import { registerSchema, loginSchema } from "@app/shared/validators";
import { hashPassword, verifyPassword } from "../lib/password.js";

const JWT_SECRET = process.env.JWT_SECRET || "";

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
      .returning({ id: organizers.id, email: organizers.email });

    const token = await sign({ sub: organizer.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }, JWT_SECRET);
    return c.json({ token, organizer }, 201);
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    
    const [organizer] = await db.select().from(organizers).where(eq(organizers.email, email));
    if(!organizer || !organizer.passwordHash || !verifyPassword(password, organizer.passwordHash)) {
      return c.json({ error: "Invalid email or password" }, 401);
    }
    
    const token = await sign({ sub: organizer.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }, JWT_SECRET);
    return c.json({token, organizer: {id: organizer.id, email: organizer.email}});
  })