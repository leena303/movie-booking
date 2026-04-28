const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const UserModel = require("../models/user.model");

const authController = {
  async register(req, res) {
    try {
      const { name, email, password, phone, address } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "Name, email, and password are required",
        });
      }

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      await UserModel.createUser(name, email, passwordHash, phone, address);

      return res.status(201).json({
        message: "Register successful",
      });
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      return res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          message: "Email is required",
        });
      }

      const user = await UserModel.findByEmail(email);

      // Không báo email có tồn tại hay không để tránh dò email
      if (!user) {
        return res.json({
          message:
            "Nếu email tồn tại trong hệ thống, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.",
        });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");

      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await UserModel.saveResetPasswordToken(email, resetToken, expiresAt);

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

      console.log("RESET PASSWORD LINK:", resetLink);

      return res.json({
        message:
          "Nếu email tồn tại trong hệ thống, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({
          message: "Token and password are required",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters",
        });
      }

      const user = await UserModel.findByResetPasswordToken(token);

      if (!user) {
        return res.status(400).json({
          message: "Reset token is invalid or expired",
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      await UserModel.updatePasswordById(user.id, passwordHash);

      return res.json({
        message: "Password reset successful",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = authController;
