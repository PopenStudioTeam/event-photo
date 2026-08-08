export type QrLayout = "warm" | "clean";

export type QrLayoutConfig = {
  key: QrLayout;
  title: string;
  description: string;
  defaultGreeting: string;
  footer: string;
};

export const DEFAULT_QR_GREETING =
  "Share your photos and videos with us!";

export const QR_LAYOUT_CONFIG: Record<QrLayout, QrLayoutConfig> = {
  warm: {
    key: "warm",
    title: "Warm celebration",
    description: "Soft gradient with elegant centered layout.",
    defaultGreeting: "Hope you enjoy and share the best moments with us.",
    footer: "Scan the QR code to upload photos & videos",
  },
  clean: {
    key: "clean",
    title: "Clean modern",
    description: "Minimal white card, easy to read at a distance.",
    defaultGreeting: "Share the best moments with us.",
    footer: "Scan the QR code to upload photos & videos",
  },
};

export const QR_LAYOUT_ORDER: QrLayout[] = ["warm", "clean"];

export type QrDownloadOptions = {
  layout: QrLayout;
  greeting: string;
};

export function resolveQrGreeting(layout: QrLayout, greeting: string) {
  const trimmed = greeting.trim();
  return trimmed || QR_LAYOUT_CONFIG[layout].defaultGreeting;
}

const FONT_FAMILIES = {
  display: '"Playfair Display", Georgia, serif',
  script: '"Cormorant Garamond", "Times New Roman", serif',
  sans: '"Nunito Sans", system-ui, sans-serif',
};

let fontsReady: Promise<void> | null = null;

export function ensureQrCardFonts() {
  if (typeof document === "undefined") {
    return Promise.resolve();
  }

  if (!fontsReady) {
    fontsReady = Promise.all([
      document.fonts.load('600 72px "Playfair Display"'),
      document.fonts.load('500 40px "Playfair Display"'),
      document.fonts.load('italic 400 44px "Cormorant Garamond"'),
      document.fonts.load('400 34px "Cormorant Garamond"'),
      document.fonts.load('600 24px "Cormorant Garamond"'),
      document.fonts.load('500 36px "Nunito Sans"'),
      document.fonts.load('400 28px "Nunito Sans"'),
    ]).then(() => undefined);
  }

  return fontsReady;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  startY: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }

  if (current) lines.push(current);

  ctx.textAlign = "center";
  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, startY + index * lineHeight);
  });
}

function drawDivider(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  y: number,
  color: string
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(centerX - 120, y);
  ctx.lineTo(centerX - 18, y);
  ctx.moveTo(centerX + 18, y);
  ctx.lineTo(centerX + 120, y);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function formatEventDate(date: string | null) {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function drawWarmBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#ffd8df");
  gradient.addColorStop(0.5, "#fff2d8");
  gradient.addColorStop(1, "#fff8ee");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.beginPath();
  ctx.arc(140, 160, 120, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 184, 202, 0.32)";
  ctx.beginPath();
  ctx.arc(1030, 260, 170, 0, Math.PI * 2);
  ctx.fill();

  const inset = 72;
  const innerInset = 92;
  ctx.strokeStyle = "rgba(180, 95, 110, 0.35)";
  ctx.lineWidth = 2;
  roundRect(ctx, inset, inset, width - inset * 2, height - inset * 2, 28);
  ctx.stroke();

  ctx.lineWidth = 1;
  roundRect(
    ctx,
    inset + 20,
    inset + 20,
    width - (inset + 20) * 2,
    height - (inset + 20) * 2,
    22
  );
  ctx.stroke();
}

function drawCleanBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#f4f4f5";
  ctx.beginPath();
  ctx.arc(150, 150, 120, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#e4e4e7";
  ctx.beginPath();
  ctx.arc(1000, 220, 160, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#e4e4e7";
  ctx.lineWidth = 2;
  roundRect(ctx, 64, 64, width - 128, height - 128, 32);
  ctx.stroke();
}

function drawWarmLayout(
  ctx: CanvasRenderingContext2D,
  width: number,
  options: {
    eventName: string;
    eventDate: string | null;
    greeting: string;
    footer: string;
    qrImage: HTMLImageElement;
  }
) {
  const centerX = width / 2;
  const formattedDate = formatEventDate(options.eventDate);

  ctx.fillStyle = "#8f5a63";
  ctx.font = `600 24px ${FONT_FAMILIES.script}`;
  ctx.textAlign = "center";
  ctx.fillText("EVENT PHOTO SHARING", centerX, 220);

  drawDivider(ctx, centerX, 252, "#c07b86");

  ctx.fillStyle = "#3b2328";
  ctx.font = `600 72px ${FONT_FAMILIES.display}`;
  wrapText(ctx, options.eventName, centerX, 360, 860, 82);

  if (formattedDate) {
    ctx.fillStyle = "#6f4d52";
    ctx.font = `italic 400 44px ${FONT_FAMILIES.script}`;
    ctx.fillText(formattedDate, centerX, 520);
  }

  const qrSize = 390;
  const qrX = (width - qrSize) / 2;
  const qrY = formattedDate ? 590 : 540;

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.08)";
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = "rgba(255,255,255,0.96)";
  roundRect(ctx, qrX - 36, qrY - 36, qrSize + 72, qrSize + 72, 34);
  ctx.fill();
  ctx.restore();

  ctx.drawImage(options.qrImage, qrX, qrY, qrSize, qrSize);

  drawDivider(ctx, centerX, qrY + qrSize + 92, "#c07b86");

  ctx.fillStyle = "#4a3135";
  ctx.font = `italic 400 44px ${FONT_FAMILIES.script}`;
  wrapText(ctx, options.greeting, centerX, qrY + qrSize + 150, 760, 54);

  ctx.fillStyle = "#7a5960";
  ctx.font = `400 34px ${FONT_FAMILIES.script}`;
  wrapText(ctx, options.footer, centerX, qrY + qrSize + 320, 760, 44);
}

function drawCleanLayout(
  ctx: CanvasRenderingContext2D,
  width: number,
  options: {
    eventName: string;
    eventDate: string | null;
    greeting: string;
    footer: string;
    qrImage: HTMLImageElement;
  }
) {
  const centerX = width / 2;
  const formattedDate = formatEventDate(options.eventDate);

  ctx.fillStyle = "#111827";
  ctx.font = `600 68px ${FONT_FAMILIES.display}`;
  wrapText(ctx, options.eventName, centerX, 200, 900, 78);

  if (formattedDate) {
    ctx.fillStyle = "#4b5563";
    ctx.font = `500 36px ${FONT_FAMILIES.sans}`;
    ctx.fillText(formattedDate, centerX, 310);
  }

  const qrSize = 420;
  const qrX = (width - qrSize) / 2;
  const qrY = formattedDate ? 380 : 340;

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.06)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, qrX - 40, qrY - 40, qrSize + 80, qrSize + 80, 36);
  ctx.fill();
  ctx.restore();

  ctx.drawImage(options.qrImage, qrX, qrY, qrSize, qrSize);

  ctx.fillStyle = "#374151";
  ctx.font = `500 36px ${FONT_FAMILIES.sans}`;
  wrapText(ctx, options.greeting, centerX, qrY + qrSize + 110, 780, 48);

  ctx.fillStyle = "#6b7280";
  ctx.font = `400 28px ${FONT_FAMILIES.sans}`;
  wrapText(ctx, options.footer, centerX, qrY + qrSize + 260, 780, 40);
}

export async function renderQrCard(options: {
  layout: QrLayout;
  eventName: string;
  eventDate: string | null;
  greeting: string;
  qrImage: HTMLImageElement;
}) {
  const { layout, eventName, eventDate, qrImage, greeting } = options;
  const config = QR_LAYOUT_CONFIG[layout];
  const resolvedGreeting = resolveQrGreeting(layout, greeting);

  await ensureQrCardFonts();

  const canvas = document.createElement("canvas");
  const width = 1200;
  const height = 1800;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  if (layout === "warm") {
    drawWarmBackground(ctx, width, height);
    drawWarmLayout(ctx, width, {
      eventName,
      eventDate,
      greeting: resolvedGreeting,
      footer: config.footer,
      qrImage,
    });
  } else {
    drawCleanBackground(ctx, width, height);
    drawCleanLayout(ctx, width, {
      eventName,
      eventDate,
      greeting: resolvedGreeting,
      footer: config.footer,
      qrImage,
    });
  }

  return canvas.toDataURL("image/png");
}

export function formatQrCardDate(date: string | null) {
  return formatEventDate(date) ?? "No date set";
}
