import { describe, expect, it } from "vitest";
import { identityDisplayName, sessionIdentity } from "./authIdentity";

describe("sessionIdentity", () => {
  it("keeps the nested identity returned by /auth/me", () => {
    expect(sessionIdentity({ user: {
      id: "account-1",
      email: "person@example.com",
      activeMode: "seeker",
      firstName: "Ana",
      lastName: "López",
    } })).toEqual({
      id: "account-1",
      email: "person@example.com",
      activeMode: "seeker",
      firstName: "Ana",
      lastName: "López",
    });
  });

  it("does not use the email prefix as a person's name", () => {
    expect(identityDisplayName({ email: "person@example.com" })).toBe("Usuario");
  });
});
