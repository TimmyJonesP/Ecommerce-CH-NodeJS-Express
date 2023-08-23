import transporter from "../../utils/nodemailer.utils.js";

class MailerRepository {
  sendMail(mailOptions) {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email", error);
      } else {
        console.log("Email sent", info.response);
      }
    });
  }
}

export default MailerRepository;
