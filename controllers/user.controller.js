import prisma from "../main.js";
import { userPatchValid } from "../validation/user.valid.js";

export async function findAll(req, res) {
   try {
      let data = await prisma.user.findMany();

      if (!data.length) {
         return res.status(404).json({ message: "Not founda data." });
      }

      res.status(200).json({ data });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function findOne(req, res) {
   let { id } = req.params;
   try {
      let data = await prisma.user.findFirst({ where: { id: Number(id) } });

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
      let data = await prisma.user.findFirst({ where: { id: Number(id) } });

      if (!data) {
         return res.status(404).json({ message: "Not found data." });
      }

      let deleted = await prisma.user.delete({ where: { id: data.id } });

      res.status(200).json({ data: deleted });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function update(req, res) {
   let { error, value } = userPatchValid.validate(req.body);
   if (error) {
      return res.status(422).json({ message: error.details[0].message });
   }
   let { id } = req.params;
   try {
      let data = await prisma.user.findFirst({ where: { id: Number(id) } });
      if (!data) {
         return res.status(404).json({ message: "Not found data." });
      }

      if (value.regionId) {
         let region = await prisma.region.findFirst({
            where: { id: value.regionId },
         });
         if (!region) {
            return res.status(404).json({ message: "Not found region." });
         }
      }

      let updated = await prisma.user.update({
         where: { id: data.id },
         data: value,
      });

      res.status(200).json({ data: updated });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function mydata(req, res) {
   try {
      let data = await prisma.user.findFirst({
         where: { id: req.user.id },
         include: {
            region: true,
            Banner: true,
            Comment: true,
            Like: { include: { banner: true } },
            Donate: { include: { banner: true } },
         },
      });

      if (!data) {
         return res.status(404).json({ message: "Not founda data." });
      }

      res.status(200).json({ data });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}
