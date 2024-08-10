import { brand } from "@/common/texts";
import { markdownNames } from "@/docs";
import { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
	return markdownNames.map((markdownName) => ({
		url: `${brand.origin}/${markdownName}`,
		changeFrequency: "daily",
		priority: 0.7,
	}));
}
