import { sendEmail } from "../utils/email.js";
import nodemailer from "nodemailer";

jest.mock("nodemailer");

describe("sendEmail", () => {
  let mockSendMail;

  beforeEach(() => {
    // Mock the sendMail function
    mockSendMail = jest.fn().mockResolvedValue("Email sent");
    nodemailer.createTransport.mockReturnValue({
      sendMail: mockSendMail,
    });

    // Mock environment variables
    process.env.EMAIL_USER = "test@example.com";
    process.env.EMAIL_PASS = "password";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send an email successfully", async () => {
    const to = "recipient@example.com";
    const subject = "Test Subject";
    const text = "This is a test email.";

    await sendEmail(to, subject, text);

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    expect(mockSendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    expect(mockSendMail).toHaveBeenCalledTimes(1);
  });

  it("should log an error if sending email fails", async () => {
    const to = "recipient@example.com";
    const subject = "Test Subject";
    const text = "This is a test email.";

    const mockError = new Error("SMTP error");
    mockSendMail.mockRejectedValueOnce(mockError);

    console.error = jest.fn(); // Mock console.error

    await sendEmail(to, subject, text);

    expect(console.error).toHaveBeenCalledWith(
      "Error sending email:",
      mockError
    );
  });
});
