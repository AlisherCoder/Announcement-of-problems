import prisma from "../main.js";
import {
   commentPatchValid,
   commentPostValid,
} from "../validation/comment.valid.js";

export async function create(req, res) {
   let { error, value } = commentPostValid.validate(req.body);
   if (error) {
      return res.status(422).json({ message: error.details[0].message });
   }

   try {
      let banner = await prisma.banner.findFirst({
         where: { id: value.bannerId },
      });
      if (!banner) {
         return res.status(404).json({ message: "Not found banner." });
      }
      
      value.userId = req.user.id;
      let created = await prisma.comment.create({ data: value });
      res.status(201).json({ data: created });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function remove(req, res) {
   let { id } = req.params;
   try {
      let data = await prisma.comment.findFirst({ where: { id: Number(id) } });

      if (!data) {
         return res.status(404).json({ message: "Not found data." });
      }

      if (req.user.id != data.userId && req.user.role != "ADMIN") {
         return res.status(401).json({ message: "Not allowed." });
      }

      let deleted = await prisma.comment.delete({ where: { id: data.id } });

      res.status(200).json({ data: deleted });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function update(req, res) {
   let { error, value } = commentPatchValid.validate(req.body);
   if (error) {
      return res.status(422).json({ message: error.details[0].message });
   }
   let { id } = req.params;

   try {
      let data = await prisma.comment.findFirst({ where: { id: Number(id) } });

      if (!data) {
         return res.status(404).json({ message: "Not found data." });
      }

      if (req.user.id != data.userId && req.user.role != "ADMIN") {
         return res.status(401).json({ message: "Not allowed." });
      }

      let updated = await prisma.comment.update({
         where: { id: data.id },
         data: value,
      });

      res.status(200).json({ data: updated });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}
