import { brand } from "@/common/texts";
import { markdownNames } from "@/docs";
import { getStories } from "@/server/services/story/getStories";
import { MetadataRoute } from "next";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const stories = await getStories({
		count: 300,
	});
	return [
		{
			url: `${brand.origin}/`,
			changeFrequency: "daily",
			priority: 0.7,
		},
		{
			url: `${brand.origin}/stories`,
			changeFrequency: "daily",
			priority: 0.7,
		},
		{
			url: `${brand.origin}/stories/rank`,
			changeFrequency: "daily",
			priority: 0.7,
		},
		...markdownNames.map(
			(markdownName) =>
				({
					url: `${brand.origin}/${markdownName}`,
					changeFrequency: "daily",
					priority: 0.7,
				}) as const,
		),
		...stories.map(
			(story) =>
				({
					url: `${brand.origin}/stories/${story.id}`,
					changeFrequency: "daily",
					priority: 0.7,
				}) as const,
		),
	];
}
