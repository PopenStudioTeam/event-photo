import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const googleAuthSchema = z.object({
  idToken: z.string().min(1),
});

export const loginSchema = registerSchema;

export const coverUploadSchema = z.object({
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  fileSize: z.number().int().positive().max(5 * 1024 * 1024), // 5MB is plenty for a cover
});

export const createEventSchema = z.object({
  name: z.string().min(1).max(120),
  eventDate: z.string().datetime().optional(),
  protected: z.boolean().optional(),
  password: z.string().min(4).max(128).optional(),
});

export const updateEventSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  eventDate: z.string().datetime().optional(),
  coverImageKey: z.string().optional(),
  protected: z.boolean().optional(),
  password: z.string().min(4).max(128).optional(),
});

export const unlockEventSchema = z.object({
  password: z.string().min(1).max(128),
});

// Guest upload validation
export const uploadMediaUrlSchema = z.object({
  contentType: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
  ]),
  fileSize: z.number().int().positive().max(100 * 1024 * 1024), // 100MB
});

export const createMediaSchema = z.object({
  key: z.string().min(1),
  contentType: z.string().min(1),
  fileSize: z.number().int().positive(),
  guestName: z.string().min(1).max(80).optional(),
  caption: z.string().min(1).max(300).optional(),
});