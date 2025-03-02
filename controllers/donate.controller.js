import prisma from "../main.js";
import { donateValid } from "../validation/comment.valid.js";

export async function create(req, res) {
   let { error, value } = donateValid.validate(req.body);
   if (error) {
      return res.status(422).json({ message: error.details[0].message });
   }
   let { summa, bannerId } = value;

   try {
      let banner = await prisma.banner.findFirst({ where: { id: bannerId } });

      if (!banner) {
         return res.status(404).json({ message: "Not found banner." });
      }

      if (banner.status != "ACTIVE") {
         return res.status(400).json({ message: "This banner is not active." });
      }

      let user = await prisma.user.findFirst({ where: { id: req.user.id } });

      if (summa > user.balance) {
         return res
            .status(400)
            .json({ message: "There is not enough money in the account." });
      }

      value.userId = req.user.id;
      let created = await prisma.donate.create({ data: value });

      let updatedBanner = await prisma.banner.update({
         where: { id: banner.id },
         data: { balance: banner.balance + summa },
      });

      let updatedUser = await prisma.user.update({
         where: { id: user.id },
         data: { balance: user.balance - summa },
      });

      if (updatedBanner.balance >= updatedBanner.target) {
         await prisma.banner.update({
            where: { id: banner.id },
            data: { status: "INACTIVE" },
         });
      }

      res.status(201).json({ data: created, updatedBanner, updatedUser });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}
