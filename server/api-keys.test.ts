import { describe, expect, it } from "vitest";
import { ENV } from "./_core/env";

describe("API Keys Validation", () => {
  it("should have NEWSAPI_KEY configured", () => {
    expect(ENV.newsapiKey).toBeDefined();
    expect(ENV.newsapiKey).toHaveLength(32); // NewsAPI keys are typically 32 chars
  });

  it("should have OPENAI_API_KEY configured", () => {
    expect(ENV.openaiApiKey).toBeDefined();
    expect(ENV.openaiApiKey.length).toBeGreaterThan(40); // OpenAI keys are typically 100+ chars
  });

  it("should validate NewsAPI key format", () => {
    const key = ENV.newsapiKey;
    // NewsAPI keys are alphanumeric
    expect(/^[a-zA-Z0-9]+$/.test(key)).toBe(true);
  });

  it("should validate OpenAI key format", () => {
    const key = ENV.openaiApiKey;
    // OpenAI keys start with 'sk-' and contain alphanumeric, hyphen, underscore
    expect(/^sk-/.test(key)).toBe(true);
  });
});
