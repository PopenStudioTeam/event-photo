import { pgTable, uuid, text, timestamp, boolean, integer, pgEnum } from "drizzle-orm/pg-core";

export const mediaTypeEnum = pgEnum("media_type", ["photo", "video"]);

export const organizers = pgTable("organizers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),          // now nullable
  googleId: text("google_id").unique(),          // new
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  eventDate: timestamp("event_date", { withTimezone: true }),
  coverImageKey: text("cover_image_key"),
  uploadsEnabled: boolean("uploads_enabled").default(true).notNull(),
  organizerId: uuid("organizer_id")
    .references(() => organizers.id, { onDelete: "cascade" })
    .notNull(),
  maxMediaCount: integer("max_media_count").default(1000).notNull(),
  uploadsDeadline: timestamp("uploads_deadline", { withTimezone: true }),
  protected: boolean("protected").default(false).notNull(),
  protectedPasswordHash: text("gallery_password"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  storageKey: text("storage_key").notNull().unique(),
  type: mediaTypeEnum("type").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  guestName: text("guest_name"),
  caption: text("caption"),
  likesCount: integer("likes_count").default(0).notNull(),
  status: text("status").default("pending").notNull(), // "pending" | "approved" | "rejected"
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});