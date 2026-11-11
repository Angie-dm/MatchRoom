import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { clearOnboardingDraft, onboardingDraftKey, startOnboardingDraft } from "./onboardingStorage";

const store = new Map();
const localStorageMock = {
  getItem: (key) => store.get(key) ?? null,
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
};

describe("startOnboardingDraft", () => {
  beforeEach(() => {
    store.clear();
    globalThis.localStorage = localStorageMock;
  });

  afterEach(() => {
    delete globalThis.localStorage;
  });

  it("stores a Google identity under the authenticated user's draft key", () => {
    startOnboardingDraft({ correo: "person@example.com", firstName: "Ana" }, "account-1");
    expect(JSON.parse(localStorage.getItem(onboardingDraftKey("account-1")))).toEqual({
      correo: "person@example.com",
      firstName: "Ana",
    });
    expect(localStorage.getItem(onboardingDraftKey())).toBeNull();
    clearOnboardingDraft("account-1");
  });
});
