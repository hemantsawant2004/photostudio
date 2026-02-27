import { Request, Response, NextFunction } from "express";
import { GalleryService } from "./gallery.service";

export const getPhotos = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const photos = await GalleryService.getAll();
    res.json({ success: true, data: photos });
  } catch (err) {
    next(err);
  }
};