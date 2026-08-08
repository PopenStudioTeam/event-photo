import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";

export const mediaTypeEnum = pgEnum("media_type", ["photo", "video"]);

export const eventPlanEnum = pgEnum("event_plan", [
  "free",
  "premium",
  "pro",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "free",
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const organizers = pgTable("organizers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  googleId: text("google_id").unique(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
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

  maxMediaCount: integer("max_media_count").default(100).notNull(),
  uploadsDeadline: timestamp("uploads_deadline", {
    withTimezone: true,
  }),

  protected: boolean("protected").default(false).notNull(),
  protectedPasswordHash: text("gallery_password"),

  primaryColor: text("primary_color").default("#ffffff").notNull(),
  backgroundVariant: text("background_variant")
    .default("dark")
    .notNull(),

  povEnabled: boolean("pov_enabled").default(false).notNull(),
  povMaxPerGuest: integer("pov_max_per_guest").default(0).notNull(),
  povRevealAt: timestamp("pov_reveal_at", { withTimezone: true }),

  coverLayout: text("cover_layout").default("banner").notNull(),
  coverOverlay: text("cover_overlay").default("none").notNull(),

  plan: eventPlanEnum("plan").default("free").notNull(),
  paymentStatus: paymentStatusEnum("payment_status")
    .default("free")
    .notNull(),

  stripeCheckoutSessionId: text("stripe_checkout_session_id").unique(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paidAt: timestamp("paid_at", { withTimezone: true }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
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
  guestId: text("guest_id"),
  caption: text("caption"),

  likesCount: integer("likes_count").default(0).notNull(),
  status: text("status").default("pending").notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const mediaLikes = pgTable(
  "media_likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    mediaId: uuid("media_id")
      .references(() => media.id, { onDelete: "cascade" })
      .notNull(),
    guestId: text("guest_id").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique().on(table.mediaId, table.guestId)]
);
