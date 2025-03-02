import nodemailer from "nodemailer";
import { totp } from "otplib";
import { config } from "dotenv";
config();

const otpsecret = process.env.otpsecret;
totp.options = { step: 600 };

const transport = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: "ibrahimovkamronbek7@gmail.com",
      pass: "wyna uzcb pgrz vdbx",
   },
});

async function sendOtp(email) {
   let otp = totp.generate(otpsecret + email);
   try {
      await transport.sendMail({
         to: email,
         subject: "One time password",
         text: `Code for verify account ${otp}`,
      });

      return otp;
   } catch (error) {
      console.log(error.message);
   }
}

export default sendOtp;
