import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const googleAuthSchema = z.object({
  idToken: z.string().min(1),
});

export const loginSchema = registerSchema;

export const listEventsQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  uploads: z.enum(["all", "enabled", "disabled"]).optional(),
  protection: z.enum(["all", "yes", "no"]).optional(),
});

export const coverUploadSchema = z.object({
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  fileSize: z.number().int().positive().max(5 * 1024 * 1024),
});

export const eventCategorySchema = z.enum([
  "wedding",
  "party",
  "conference",
  "birthday",
  "other",
]);

export const createEventSchema = z.object({
  name: z.string().min(1).max(120),
  category: eventCategorySchema.optional(),
  eventDate: z.string().datetime().optional(),
  protected: z.boolean().optional(),
  password: z.string().min(4).max(128).optional(),

  primaryColor: z.string().min(4).max(32).optional(),
  backgroundVariant: z.enum(["dark", "light"]).optional(),

  povEnabled: z.boolean().optional(),
  povMaxPerGuest: z.number().int().min(0).max(100).optional(),
  povRevealAt: z.string().datetime().optional(),

  coverLayout: z.enum(["banner", "card"]).optional(),
  coverOverlay: z.enum(["none", "gradient"]).optional(),

  plan: z.enum(["free", "premium", "pro"]).optional(),
});

export const updateEventSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  category: eventCategorySchema.optional(),
  eventDate: z.string().datetime().optional(),
  coverImageKey: z.string().optional(),

  protected: z.boolean().optional(),
  password: z.string().min(4).max(128).optional(),

  primaryColor: z.string().min(4).max(32).optional(),
  backgroundVariant: z.enum(["dark", "light"]).optional(),

  povEnabled: z.boolean().optional(),
  povMaxPerGuest: z.number().int().min(0).max(100).optional(),
  povRevealAt: z.string().datetime().optional(),

  coverLayout: z.enum(["banner", "card"]).optional(),
  coverOverlay: z.enum(["none", "gradient"]).optional(),

  uploadsEnabled: z.boolean().optional(),
});

export const unlockEventSchema = z.object({
  password: z.string().min(1).max(128),
});

export const uploadMediaUrlSchema = z.object({
  contentType: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
  ]),
  fileSize: z.number().int().positive().max(100 * 1024 * 1024),
});

export const createMediaSchema = z.object({
  key: z.string().min(1),
  contentType: z.string().min(1),
  fileSize: z.number().int().positive(),
  guestName: z.string().min(1).max(80).optional(),
  guestId: z.string().min(8).max(64).optional(),
  caption: z.string().min(1).max(300).optional(),
});

export const guestMediaQuerySchema = z.object({
  guestId: z.string().min(8).max(64),
});

export const likeMediaSchema = z.object({
  guestId: z.string().min(8).max(64),
});

export const createCheckoutSchema = z.object({
  plan: z.enum(["premium", "pro"]),
});

export const guideSlugParamSchema = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9-]+$/);

export const createGuideCommentSchema = z.object({
  authorName: z.string().trim().min(1).max(80),
  authorEmail: z.string().trim().email().max(160),
  body: z.string().trim().min(1).max(2000),
});

export const testimonialPhotoUploadSchema = z.object({
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  fileSize: z.number().int().positive().max(8 * 1024 * 1024),
});

export const createTestimonialSchema = z.object({
  authorName: z.string().trim().min(1).max(80),
  authorEmail: z.string().trim().email().max(160).optional(),
  rating: z.number().int().min(1).max(5),
  quote: z.string().trim().min(1).max(2000),
  photoKey: z.string().min(1).max(300).optional(),
});