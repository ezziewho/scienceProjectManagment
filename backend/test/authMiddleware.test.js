import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";

const mockRequest = (sessionData) => ({
  session: sessionData,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("authMiddleware", () => {
  describe("isAdmin", () => {
    it("should return 401 if session or role is missing", () => {
      const req = mockRequest({});
      const res = mockResponse();
      const next = jest.fn();

      isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Unauthorized. Please log in.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 if role is not 'manager'", () => {
      const req = mockRequest({ role: "user" });
      const res = mockResponse();
      const next = jest.fn();

      isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Access denied. Admins only.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next if role is 'manager'", () => {
      const req = mockRequest({ role: "manager" });
      const res = mockResponse();
      const next = jest.fn();

      isAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("isAuthenticated", () => {
    it("should return 401 if session or userId is missing", () => {
      const req = mockRequest({});
      const res = mockResponse();
      const next = jest.fn();

      isAuthenticated(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Unauthorized. Please log in.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next if userId is present", () => {
      const req = mockRequest({ userId: 1 });
      const res = mockResponse();
      const next = jest.fn();

      isAuthenticated(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
