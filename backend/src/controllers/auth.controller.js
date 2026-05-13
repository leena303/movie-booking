const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const UserModel = require("../models/user.model");

function validatePassword(password) {
  if (!password || typeof password !== "string") {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must contain at least 8 characters";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least 1 uppercase letter";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least 1 lowercase letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least 1 number";
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;/`~]/.test(password)) {
    return "Password must contain at least 1 special character";
  }

  return "";
}

const authController = {
  async register(req, res) {
    try {
      const { name, email, password, phone, address } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "Name, email, and password are required",
        });
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        return res.status(400).json({ message: passwordError });
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

      const passwordError = validatePassword(password);
      if (passwordError) {
        return res.status(400).json({ message: passwordError });
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

  async updateMe(req, res) {
    try {
      const userId = req.user.id;
      const { name, phone, address, oldPassword, newPassword } = req.body;

      const currentUser = await UserModel.findById(userId);

      if (!currentUser) {
        return res.status(404).json({
          message: "Không tìm thấy người dùng",
        });
      }

      await UserModel.updateProfileById(userId, {
        name: name !== undefined ? name.trim() : currentUser.name,
        phone: phone !== undefined ? phone.trim() : currentUser.phone,
        address: address !== undefined ? address.trim() : currentUser.address,
      });

      if (oldPassword || newPassword) {
        if (!oldPassword || !newPassword) {
          return res.status(400).json({
            message: "Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới",
          });
        }

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
          return res.status(400).json({ message: passwordError });
        }

        if (oldPassword === newPassword) {
          return res.status(400).json({
            message: "Mật khẩu mới không được trùng mật khẩu cũ",
          });
        }

        const userPassword = await UserModel.findPasswordById(userId);

        const isMatch = await bcrypt.compare(
          oldPassword,
          userPassword.password_hash,
        );

        if (!isMatch) {
          return res.status(400).json({
            message: "Mật khẩu cũ không đúng",
          });
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        await UserModel.updatePasswordById(userId, passwordHash);
      }

      const updatedUser = await UserModel.findById(userId);

      return res.json({
        message: "Cập nhật tài khoản thành công",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Update me error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = authController;
