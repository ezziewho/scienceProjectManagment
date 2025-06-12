import { hashPassword, comparePassword } from "../utils/bcryptUtils.js";

describe("bcryptUtils", () => {
  describe("hashPassword", () => {
    it("should hash a password successfully", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe("string");
      expect(hash).not.toBe(password); // Ensure the hash is different from the original password
    });

    it("should throw an error if password is invalid", async () => {
      await expect(hashPassword(null)).rejects.toThrow();
    });
  });

  describe("comparePassword", () => {
    it("should return true for matching password and hash", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);

      const result = await comparePassword(password, hash);
      expect(result).toBe(true);
    });

    it("should return false for non-matching password and hash", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);

      const result = await comparePassword("wrongPassword", hash);
      expect(result).toBe(false);
    });

    it("should throw an error if hash is invalid", async () => {
      const password = "testPassword123";
      await expect(comparePassword(password, null)).rejects.toThrow();
    });
  });
});
