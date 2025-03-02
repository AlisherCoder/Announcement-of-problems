import prisma from "../main.js";
import {
   regionPatchValid,
   regionPostValid,
} from "../validation/region.valid.js";

export async function findAll(req, res) {
   try {
      let data = await prisma.category.findMany();

      if (!data.length) {
         return res.status(404).json({ message: "Not found data." });
      }

      res.status(200).json({ data });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function create(req, res) {
   let { error, value } = regionPostValid.validate(req.body);
   if (error) {
      return res.status(422).json({ message: error.details[0].message });
   }

   try {
      let created = await prisma.category.create({ data: value });
      res.status(201).json({ data: created });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function findOne(req, res) {
   let { id } = req.params;
   try {
      let data = await prisma.category.findFirst({
         where: { id: Number(id) },
         include: { Banner: true },
      });

      if (!data) {
         return res.status(404).json({ message: "Not found data." });
      }

      res.status(200).json({ data });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function remove(req, res) {
   let { id } = req.params;
   try {
      let data = await prisma.category.findFirst({ where: { id: Number(id) } });

      if (!data) {
         return res.status(404).json({ message: "Not found data." });
      }

      let deleted = await prisma.category.delete({ where: { id: Number(id) } });

      res.status(200).json({ data: deleted });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function update(req, res) {
   let { error, value } = regionPatchValid.validate(req.body);
   if (error) {
      return res.status(422).json({ message: error.details[0].message });
   }
   let { id } = req.params;

   try {
      let data = await prisma.category.findFirst({ where: { id: Number(id) } });

      if (!data) {
         return res.status(404).json({ message: "Not found data." });
      }

      let updated = await prisma.category.update({
         where: { id: Number(id) },
         data: value,
      });

      res.status(200).json({ data: updated });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}
