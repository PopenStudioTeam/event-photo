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

export const eventCategoryEnum = pgEnum("event_category", [
  "wedding",
  "party",
  "conference",
  "birthday",
  "other",
]);

export const testimonialCategoryEnum = pgEnum("testimonial_category", [
  "wedding",
  "party",
  "birthday",
  "corporate",
  "other",
]);

export const testimonialSourceEnum = pgEnum("testimonial_source", [
  "guest",
  "organizer",
  "admin",
]);

export const organizers = pgTable("organizers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  googleId: text("google_id").unique(),
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
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
  category: eventCategoryEnum("category").default("other").notNull(),
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

export const testimonials = pgTable("testimonials", {
  id: uuid("id").defaultRandom().primaryKey(),

  eventId: uuid("event_id").references(() => events.id, {
    onDelete: "set null",
  }),

  authorName: text("author_name").notNull(),
  authorRole: text("author_role"),
  category: testimonialCategoryEnum("category").default("other").notNull(),
  source: testimonialSourceEnum("source").default("guest").notNull(),

  rating: integer("rating").default(5).notNull(),
  quote: text("quote").notNull(),
  photoKey: text("photo_key"),

  verified: boolean("verified").default(false).notNull(),
  published: boolean("published").default(false).notNull(),
  featured: boolean("featured").default(false).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const pricingPlans = pgTable("pricing_plans", {
  id: uuid("id").defaultRandom().primaryKey(),

  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  priceCents: integer("price_cents").notNull(),
  originalPriceCents: integer("original_price_cents"),
  billingNote: text("billing_note").notNull(),
  description: text("description").notNull(),
  badge: text("badge"),

  sortOrder: integer("sort_order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const pricingPlanFeatures = pgTable("pricing_plan_features", {
  id: uuid("id").defaultRandom().primaryKey(),

  planId: uuid("plan_id")
    .references(() => pricingPlans.id, { onDelete: "cascade" })
    .notNull(),

  label: text("label").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const faqPageEnum = pgEnum("faq_page", ["home", "pricing"]);

export const faqs = pgTable("faqs", {
  id: uuid("id").defaultRandom().primaryKey(),

  page: faqPageEnum("page").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),

  sortOrder: integer("sort_order").default(0).notNull(),
  published: boolean("published").default(true).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const guideComments = pgTable("guide_comments", {
  id: uuid("id").defaultRandom().primaryKey(),

  guideSlug: text("guide_slug").notNull(),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  body: text("body").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});