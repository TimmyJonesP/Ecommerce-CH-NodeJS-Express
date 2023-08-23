import { nodemailer_user } from "../../config/mailer.config.js";
import { PORT } from "../../config/main.config.js";
import { generateToken, verifyToken } from "../../utils/jwt.token.utils.js";
import userDao from "../users.dao.js";
import { hashPassword, isValidPassword } from "../../utils/crypt.utils.js";
import HTTPError from "./errors.repository.js";
import MailerDao from "../mailer.dao.js";

class PasswordRepository {
  async sendEmail(email) {
    try {
      const resetLink = `http://localhost:${PORT}/api/login/forgot-password/${email}`;

      const mailOptions = {
        from: nodemailer_user,
        to: email,
        subject: "Restore your password.",
        text: `Restore your password with the following link: ${resetLink}`,
      };
      await MailerDao.sendEmail(mailOptions);
    } catch (error) {
      throw error;
    }
  }

  async createToken(email, res) {
    try {
      const token = generateToken(email);
      await this.sendEmail(email);
      res.cookie("tokenPassword", token, { maxAge: 86400000, httpOnly: true });
      logger.info("token generated");
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(newPassword, token, email) {
    try {
      const verifiedToken = verifyToken(token);
      if (verifiedToken.email !== email) {
        return new HTTPError("Verification error", 401);
      }
      const user = await userDao.findByEmail(email);
      const isNotValid = await isValidPassword(newPassword, user.password);

      if (isNotValid) {
        alert("Must be different to previous passwords");
        return res
          .status(401)
          .json({ error: "Must be different to previous passwords" });
      }
      const passwordHash = await hashPassword(newPassword);

      user.password = passwordHash;
      await user.save();
      logger.info("Changes applied");
    } catch (error) {
      throw new HTTPError("Error occurred.", 500);
    }
  }
}

export default PasswordRepository;
