// src/modules/tag/tag.service.ts
import * as TagRepo from "./tag.repository.js";

function normalizeTag(tag: string) {
  return tag.trim().toLowerCase();
}

export async function processTags(rawTags: string[]) {
  const normalized = [...new Set(rawTags.map(normalizeTag))];

  await TagRepo.insertTags(normalized);

  const tags = await TagRepo.findTagsByNames(normalized);

  return tags.map((t) => t.id);
}

export async function getTagsForPost(postId: string) {
  return TagRepo.findTagsByPostId(postId);
}

export async function getPopularTags() {
  return TagRepo.findPopularTags();
}
