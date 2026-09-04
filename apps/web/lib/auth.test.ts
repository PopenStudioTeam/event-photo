import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearOrganizer,
  clearToken,
  getOrganizer,
  getToken,
  logout,
  logoutAndRedirectToLogin,
  organizerInitials,
  saveOrganizer,
  saveToken,
} from "./auth";

function jwtWithExp(exp: number) {
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  return `header.${payload}.sig`;
}

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe("organizerInitials", () => {
  it("returns ? when email is missing", () => {
    expect(organizerInitials(undefined)).toBe("?");
  });

  it("uses the first letter of the first two parts", () => {
    expect(organizerInitials("jane.doe@example.com")).toBe("JD");
  });

  it("uses the first two characters of a single part", () => {
    expect(organizerInitials("host@example.com")).toBe("HO");
  });

  it("prefers a two-word display name", () => {
    expect(organizerInitials("jane.doe@example.com", "Ada Lovelace")).toBe("AL");
  });

  it("uses the first two characters of a single-word name", () => {
    expect(organizerInitials("host@example.com", "Ada")).toBe("AD");
  });
});

describe("token storage", () => {
  it("saves and reads a token", () => {
    saveToken("plain-token");
    expect(getToken()).toBe("plain-token");
  });

  it("clears an expired JWT", () => {
    saveToken(jwtWithExp(Math.floor(Date.now() / 1000) - 60));
    expect(getToken()).toBeNull();
    expect(localStorage.getItem("eventphoto_token")).toBeNull();
  });

  it("keeps a JWT that has not expired", () => {
    const token = jwtWithExp(Math.floor(Date.now() / 1000) + 3600);
    saveToken(token);
    expect(getToken()).toBe(token);
  });

  it("clears the token", () => {
    saveToken("plain-token");
    clearToken();
    expect(getToken()).toBeNull();
  });
});

describe("organizer storage", () => {
  it("requires a token to read the organizer", () => {
    saveOrganizer({ id: "1", email: "a@b.com" });
    expect(getOrganizer()).toBeNull();
  });

  it("reads the organizer when a token exists", () => {
    saveToken("plain-token");
    saveOrganizer({ id: "1", email: "a@b.com" });
    expect(getOrganizer()).toEqual({ id: "1", email: "a@b.com" });
  });

  it("returns null for invalid JSON", () => {
    saveToken("plain-token");
    localStorage.setItem("eventphoto_user", "{");
    expect(getOrganizer()).toBeNull();
  });

  it("clears token and organizer on logout", () => {
    saveToken("plain-token");
    saveOrganizer({ id: "1", email: "a@b.com" });
    logout();
    expect(getToken()).toBeNull();
    expect(localStorage.getItem("eventphoto_user")).toBeNull();
    clearOrganizer();
  });
});

describe("logoutAndRedirectToLogin", () => {
  it("does not redirect when already on a login path", () => {
    const replace = vi.fn();
    vi.stubGlobal("location", { pathname: "/login", replace });
    saveToken("plain-token");
    logoutAndRedirectToLogin();
    expect(replace).not.toHaveBeenCalled();
    expect(localStorage.getItem("eventphoto_token")).toBeNull();
  });

  it("redirects to login from other paths", () => {
    const replace = vi.fn();
    vi.stubGlobal("location", { pathname: "/dashboard", replace });
    saveToken("plain-token");
    logoutAndRedirectToLogin();
    expect(replace).toHaveBeenCalledWith("/login");
  });
});
