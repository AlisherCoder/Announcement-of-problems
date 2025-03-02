import sendOtp from "../config/send-otp.js";
import jwt from "jsonwebtoken";
import prisma from "../main.js";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { totp } from "otplib";
import { passwordValid, registerValid } from "../validation/user.valid.js";
config();

const otpsecret = process.env.otpsecret || "otpsecret";
const jwtsecret = process.env.jwtsecret || "jwtsecret";

export async function register(req, res) {
   let { error, value } = registerValid.validate(req.body);
   if (error) {
      return res.status(422).json({ message: error.details[0].message });
   }
   let { email, password, regionId } = value;

   try {
      let user = await prisma.user.findFirst({ where: { email } });
      if (user) {
         return res.status(409).json({ message: "You have an account." });
      }

      let region = await prisma.region.findFirst({ where: { id: regionId } });
      if (!region) {
         return res.status(404).json({ message: "Not found region." });
      }

      value.password = bcrypt.hashSync(password, 10);
      await prisma.user.create({ data: value });

      let otp = await sendOtp(email);

      res.status(201).json({
         message:
            "Registered, we have sent you a one-time password by email to activate your account.",
         otp,
      });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function activate(req, res) {
   let { email, otp } = req.body;
   let isValid = totp.check(otp, otpsecret + email);

   if (!isValid) {
      return res.status(401).json({ message: "OTP or email is wrong." });
   }

   try {
      let user = await prisma.user.findFirst({ where: { email } });
      if (!user) {
         return res.status(401).json({ message: "Not found user." });
      }

      let updated = await prisma.user.update({
         where: { id: user.id },
         data: { status: true },
      });

      res.status(200).json({
         message: "Your account has been successfully verified.",
      });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function login(req, res) {
   let { email, password } = req.body;
   try {
      let user = await prisma.user.findFirst({ where: { email } });
      if (!user) {
         return res.status(401).json({ message: "Not found user." });
      }

      let isValid = bcrypt.compareSync(password, user.password);
      if (!isValid) {
         return res
            .status(400)
            .json({ message: "Password or email is wrong." });
      }

      if (!user.status) {
         return res
            .status(400)
            .json({ message: "Your account is not active." });
      }

      let token = jwt.sign(
         {
            id: user.id,
            role: user.role,
         },
         jwtsecret,
         { expiresIn: "12h" }
      );

      res.status(200).json({ token });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function sendOTP(req, res) {
   let { email } = req.body;
   try {
      let user = await prisma.user.findFirst({ where: { email } });
      if (!user) {
         return res.status(401).json({ message: "Not found user." });
      }

      let otp = await sendOtp(email);

      res.status(200).json({ message: "One-time password sent.", otp });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function resetPassword(req, res) {
   let { email, otp, newPassword } = req.body;
   let { error } = passwordValid.validate({ newPassword });
   if (error) {
      return res.status(422).json({ message: error.details[0].message });
   }

   try {
      let isValid = totp.check(otp, otpsecret + email);
      if (!isValid) {
         return res.status(400).json({ message: "OTP or email is wrong." });
      }

      let user = await prisma.user.findFirst({ where: { email } });
      newPassword = bcrypt.hashSync(newPassword, 10);

      await prisma.user.update({
         where: { id: user.id },
         data: { password: newPassword },
      });

      res.status(200).json({ message: "Your password updated successfully." });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}
