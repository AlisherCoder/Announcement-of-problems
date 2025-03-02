import prisma from "../main.js";
import path from "path";
import fs from "fs";
import {
   bannerPatchValid,
   bannerSearch,
   bannerValid,
} from "../validation/banner.valid.js";

export async function findAll(req, res) {
   let { error, value } = bannerSearch.validate(req.query);
   if (error) {
      return res.status(422).json({ message: error.details[0].message });
   }

   let { page = 1, take = 10, regionId, categoryId } = value;
   try {
      let user = await prisma.user.findFirst({ where: { id: req.user.id } });
      let data;
      
      if (user.role == "ADMIN") {
         data = await prisma.banner.findMany({
            skip: (page - 1) * take,
            take: take,
            include: { BannerItem: { include: { region: true } } },
            where: {
               categoryId: categoryId,
            },
         });
      } else {
         data = await prisma.banner.findMany({
            skip: (page - 1) * take,
            take: take,
            include: { BannerItem: { include: { region: true } } },
            where: {
               BannerItem: { some: { regionId: regionId || user.regionId } },
               categoryId: categoryId,
            },
         });
      }

      if (!data.length) {
         return res.status(404).json({ message: "Not found data." });
      }

      res.status(200).json({ data });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function create(req, res) {
   let { error, value } = bannerValid.validate(req.body);
   if (error) {
      return res.status(422).json({ message: error.details[0].message });
   }

   try {
      let category = await prisma.category.findFirst({
         where: { id: value.categoryId },
      });

      if (!category) {
         return res.status(404).json({ message: "Not found category." });
      }

      let { regions, ...data } = value;

      for (let id of regions) {
         let region = await prisma.region.findFirst({ where: { id } });
         if (!region) {
            return res.status(404).json({ message: "Not found region." });
         }
      }

      data.authorId = req.user.id;

      let created = await prisma.banner.create({ data: data });

      for (let id of regions) {
         await prisma.bannerItem.create({
            data: { bannerId: created.id, regionId: id },
         });
      }

      res.status(201).json({ data: created });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function findOne(req, res) {
   let { id } = req.params;
   try {
      let data = await prisma.banner.findFirst({
         where: { id: Number(id) },
         include: {
            author: true,
            category: true,
            BannerItem: { include: { region: true } },
            Donate: { include: { user: true } },
            Like: { include: { user: true } },
            Comment: { include: { user: true } },
         },
      });

      if (!data) {
         return res.status(404).json({ message: "Not found data." });
      }

      data.Regions = data.BannerItem.map((bi) => bi.region);
      delete data.BannerItem;

      res.status(200).json({ data });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function remove(req, res) {
   let { id } = req.params;
   try {
      let data = await prisma.banner.findFirst({ where: { id: Number(id) } });

      if (!data) {
         return res.status(404).json({ message: "Not found data." });
      }

      if (req.user.id != data.authorId && req.user.role != "ADMIN") {
         return res.status(401).json({ message: "Not allowed." });
      }

      let deleted = await prisma.banner.delete({ where: { id: data.id } });
      try {
         let filepath = path.join("uploads", data.image);
         fs.unlinkSync(filepath);
      } catch (error) {}

      res.status(200).json({ data: deleted });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function update(req, res) {
   let { error, value } = bannerPatchValid.validate(req.body);
   if (error) {
      return res.status(422).json({ message: error.details[0].message });
   }
   let { id } = req.params;

   try {
      let data = await prisma.banner.findFirst({ where: { id: Number(id) } });

      if (!data) {
         return res.status(404).json({ message: "Not found data." });
      }

      if (req.user.id != data.authorId && req.user.role != "ADMIN") {
         return res.status(401).json({ message: "Not allowed." });
      }

      if (value.status && req.user.role != "ADMIN") {
         return res
            .status(401)
            .json({ message: "Not allowed updated status." });
      }

      if (value.image) {
         try {
            let filepath = path.join("uploads", data.image);
            fs.unlinkSync(filepath);
         } catch (error) {}
      }

      let updated = await prisma.banner.update({
         where: { id: data.id },
         data: value,
      });

      res.status(200).json({ data: updated });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}
