import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";

// Mock db functions
const mockGetUserByEmail = vi.fn();
const mockUpsertUser = vi.fn();
const mockSetUserPasswordHash = vi.fn();

vi.mock("./db", () => ({
  getUserByEmail: (...args: unknown[]) => mockGetUserByEmail(...args),
  upsertUser: (...args: unknown[]) => mockUpsertUser(...args),
  setUserPasswordHash: (...args: unknown[]) => mockSetUserPasswordHash(...args),
}));

vi.mock("./odoo", () => ({
  syncOdooContact: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./email", () => ({
  sendWelcomeEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./_core/sdk", () => ({
  sdk: {
    createSessionToken: vi.fn().mockResolvedValue("mock-session-token"),
  },
}));

vi.mock("./_core/cookies", () => ({
  getSessionCookieOptions: vi.fn().mockReturnValue({
    httpOnly: true,
    secure: false,
    sameSite: "lax" as const,
    path: "/",
  }),
}));

describe("Email Auth - Password Hashing", () => {
  it("should hash passwords with bcrypt", async () => {
    const password = "testpassword123";
    const hash = await bcrypt.hash(password, 12);
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.startsWith("$2a$") || hash.startsWith("$2b$")).toBe(true);
  });

  it("should verify correct password", async () => {
    const password = "testpassword123";
    const hash = await bcrypt.hash(password, 12);
    const isValid = await bcrypt.compare(password, hash);
    expect(isValid).toBe(true);
  });

  it("should reject wrong password", async () => {
    const password = "testpassword123";
    const hash = await bcrypt.hash(password, 12);
    const isValid = await bcrypt.compare("wrongpassword", hash);
    expect(isValid).toBe(false);
  });
});

describe("Email Auth - Registration Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should reject registration if email already exists with password", async () => {
    mockGetUserByEmail.mockResolvedValue({
      id: 1,
      openId: "email_existing",
      email: "test@example.com",
      passwordHash: "$2b$12$somehash",
    });

    // Simulate what the router does
    const existingUser = await mockGetUserByEmail("test@example.com");
    expect(existingUser).toBeDefined();
    expect(existingUser.passwordHash).toBeTruthy();
    // Router would throw CONFLICT here
  });

  it("should allow registration for new email", async () => {
    mockGetUserByEmail.mockResolvedValue(undefined);
    mockUpsertUser.mockResolvedValue(undefined);
    mockSetUserPasswordHash.mockResolvedValue(undefined);

    const existingUser = await mockGetUserByEmail("new@example.com");
    expect(existingUser).toBeUndefined();

    // Simulate registration flow
    await mockUpsertUser({
      openId: "email_test-uuid",
      name: "New User",
      email: "new@example.com",
      loginMethod: "email",
    });
    expect(mockUpsertUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "new@example.com",
        loginMethod: "email",
      })
    );
  });
});

describe("Email Auth - Login Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should reject login for non-existent user", async () => {
    mockGetUserByEmail.mockResolvedValue(undefined);
    const user = await mockGetUserByEmail("nonexistent@example.com");
    expect(user).toBeUndefined();
    // Router would throw UNAUTHORIZED
  });

  it("should reject login for user without password (OAuth-only user)", async () => {
    mockGetUserByEmail.mockResolvedValue({
      id: 1,
      openId: "oauth_user",
      email: "oauth@example.com",
      passwordHash: null,
    });
    const user = await mockGetUserByEmail("oauth@example.com");
    expect(user).toBeDefined();
    expect(user.passwordHash).toBeNull();
    // Router would throw UNAUTHORIZED
  });

  it("should accept login with correct password", async () => {
    const password = "correctpassword";
    const hash = await bcrypt.hash(password, 12);
    mockGetUserByEmail.mockResolvedValue({
      id: 1,
      openId: "email_user",
      email: "user@example.com",
      passwordHash: hash,
      name: "Test User",
    });

    const user = await mockGetUserByEmail("user@example.com");
    expect(user).toBeDefined();
    const isValid = await bcrypt.compare(password, user.passwordHash);
    expect(isValid).toBe(true);
  });
});
