import { Router } from "express";
import { getPhotos } from "./gallery.controller";

export const galleryRouter = Router();

galleryRouter.get("/", getPhotos);
// later: POST + Zod schema for admin upload