import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password.js";

describe("hashPassword / verifyPassword", () => {
  it("verifies a matching password", () => {
    const stored = hashPassword("secret-pass");
    expect(verifyPassword("secret-pass", stored)).toBe(true);
  });

  it("rejects a wrong password", () => {
    const stored = hashPassword("secret-pass");
    expect(verifyPassword("other-pass", stored)).toBe(false);
  });

  it("rejects a stored value with no separator", () => {
    expect(verifyPassword("secret-pass", "nocolon")).toBe(false);
  });

  it("rejects empty salt or hash parts", () => {
    expect(verifyPassword("secret-pass", ":abc")).toBe(false);
    expect(verifyPassword("secret-pass", "abc:")).toBe(false);
  });

  it("rejects a malformed hash payload", () => {
    expect(verifyPassword("secret-pass", "nothex:zzzz")).toBe(false);
  });
});
