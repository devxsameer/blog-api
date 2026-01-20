import { cloudinary } from "@/config/cloudinary.js";

export function buildAvatarUrl(
  resource: { public_id: string; version: string },
  size = 256,
) {
  return cloudinary.url(resource.public_id, {
    version: resource.version,
    width: size,
    height: size,
    crop: "fill",
    gravity: "face",
    quality: "auto",
    fetch_format: "auto",
  });
}
