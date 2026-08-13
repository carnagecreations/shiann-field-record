// ─────────────────────────────────────────────────────────────────────────────
// ELEVENTY CONFIGURATION
// This file configures how Eleventy builds your static site
// Documentation: https://www.11ty.dev/docs/config/
// ─────────────────────────────────────────────────────────────────────────────

// 📦 Plugin Imports
const pluginImages = require("@codestitchofficial/eleventy-plugin-sharp-images");
const pluginMinifier = require("@codestitchofficial/eleventy-plugin-minify");
const pluginSitemap = require("@quasibit/eleventy-plugin-sitemap");

// ⚙️ Configuration Files
const configSitemap = require("./src/config/plugins/sitemap");
const configImages = require("./src/config/plugins/images");

// 🔧 Processing Functions
const sass = require("./src/config/processors/sass");
const javascript = require("./src/config/processors/javascript");

// 🛠️ Utilities
const filterPostDate = require("./src/config/filters/postDate");
const filterIsoDate = require("./src/config/filters/isoDate");
const filterTitleCase = require("./src/config/filters/titleCase");
const isProduction = process.env.ELEVENTY_ENV === "PROD";

module.exports = function (eleventyConfig) {
	// ═════════════════════════════════════════════════════════════════════════
	// LANGUAGES
	// Using Eleventy's build events to process non-template languages
	// Learn more: https://www.11ty.dev/docs/events/
	// ═════════════════════════════════════════════════════════════════════════

	/*
	 * JavaScript & CSS Processing
	 * These processors handle bundling, transpiling, and minification
	 * - JavaScript: Compiled with esbuild for modern bundling
	 * - CSS/SASS: Processed and minified for production, including a PostCSS pipeline
	 */
	eleventyConfig.on("eleventy.after", javascript);
	eleventyConfig.on("eleventy.after", sass);

	// ═════════════════════════════════════════════════════════════════════════
	// PLUGINS
	// Extend Eleventy with additional functionality
	// Learn more: https://www.11ty.dev/docs/plugins/
	// ═════════════════════════════════════════════════════════════════════════

	/*
	 * 🖼️ Image Optimization
	 * Resize and optimize images for better performance using {% getUrl %}
	 * Documentation: https://github.com/CodeStitchOfficial/eleventy-plugin-sharp-images
	 */
	eleventyConfig.addPlugin(pluginImages, configImages);

	/*
	 * 🗺️ Sitemap Generation
	 * Creates sitemap.xml automatically using domain from _data/client.json
	 * Documentation: https://github.com/quasibit/eleventy-plugin-sitemap
	 */
	eleventyConfig.addPlugin(pluginSitemap, configSitemap);

	/*
	 * 📦 Production Minification
	 * Minifies HTML, CSS, JSON, XML, XSL, and webmanifest files
	 * Only runs during production builds (npm run build)
	 * Documentation: https://github.com/CodeStitchOfficial/eleventy-plugin-minify
	 */
	if (isProduction) {
		eleventyConfig.addPlugin(pluginMinifier);
	}

	// ═════════════════════════════════════════════════════════════════════════
	// PASSTHROUGH COPIES
	// Copy files directly to output without processing
	// Learn more: https://www.11ty.dev/docs/copy/
	// ═════════════════════════════════════════════════════════════════════════

	eleventyConfig.addPassthroughCopy("./src/assets"); // Static assets
	eleventyConfig.addPassthroughCopy("./src/admin"); // CMS admin files
	eleventyConfig.addPassthroughCopy("./src/_redirects"); // Redirect rules

	// ═════════════════════════════════════════════════════════════════════════
	// FILTERS
	// Transform data in templates at build time
	// Learn more: https://www.11ty.dev/docs/filters/
	// ═════════════════════════════════════════════════════════════════════════

	// Custom filter to convert file slug to title case (e.g., about-us -> About Us)
	eleventyConfig.addFilter("titleCase", filterTitleCase);

	/*
	 * 📅 Human-Readable Date Formatting Filter
	 * Converts JavaScript dates to human-readable format
	 * Usage: {{ "2023-12-02" | postDate }}
	 * Powered by Luxon: https://moment.github.io/luxon/api-docs/
	 */
	eleventyConfig.addFilter("postDate", filterPostDate);

	/*
	 * 📅 ISO Date Formatting Filter
	 * Converts JavaScript dates to ISO 8601 format
	 * Usage: {{ "2023-12-02" | isoDate }}
	 * Powered by Luxon: https://moment.github.io/luxon/api-docs/
	 */
	eleventyConfig.addFilter("isoDate", filterIsoDate);

	/*
	 * 🏷️ Filter By Tag
	 * Returns only the items whose `tags` array includes the given tag.
	 * Usage: {% for entry in ledger | filterByTag(site.tagKey) %}
	 */
	eleventyConfig.addFilter("filterByTag", (arr, tag) => (arr || []).filter((item) => (item.tags || []).includes(tag)));

	/*
	 * 🔎 Find By ID
	 * Returns the first item whose `id` matches. Nunjucks' built-in
	 * `selectattr(...) | first` misbehaves with a dynamic (non-literal)
	 * comparison value, returning a stale result across separate pages that
	 * share the same include — this plain-JS filter sidesteps that bug.
	 * Usage: {{ digSites | findById(siteId) }}
	 */
	eleventyConfig.addFilter("findById", (arr, id) => (arr || []).find((item) => item.id === id));

	/*
	 * 🚫 Exclude URL
	 * Returns all items except the one whose `.url` matches — used to drop
	 * the current page from a "more posts" list. Same rationale as findById:
	 * avoids Nunjucks' built-in rejectattr with a dynamic comparison value.
	 * Usage: {{ collections.post | excludeUrl(page.url) }}
	 */
	eleventyConfig.addFilter("excludeUrl", (arr, url) => (arr || []).filter((item) => item.url !== url));

	/*
	 * 🧩 To JSON
	 * Safely serializes a JS value for embedding in a <script type="application/json"> tag.
	 * Usage: {{ digSites | toJson | safe }}
	 */
	eleventyConfig.addFilter("toJson", (value) => JSON.stringify(value).replace(/</g, "\\u003c"));

	/*
	 * ✂️ Limit
	 * Returns the first N items of an array (Nunjucks' built-in `slice` splits
	 * into N groups rather than truncating, so this fills that gap).
	 * Usage: {% for item in items | limit(4) %}
	 */
	eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));

	// ═════════════════════════════════════════════════════════════════════════
	// SHORTCODES
	// Generate dynamic content with JavaScript
	// Learn more: https://www.11ty.dev/docs/shortcodes/
	// ═════════════════════════════════════════════════════════════════════════

	/*
	 * 📆 Current Year Shortcode
	 * Outputs the current year (useful for copyright notices)
	 * Usage: {% year %}
	 * Updates automatically with each build
	 */
	eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

	// ═════════════════════════════════════════════════════════════════════════
	// BUILD CONFIGURATION
	// Define input/output directories and template engine
	// ═════════════════════════════════════════════════════════════════════════

	return {
		dir: {
			input: "src", // Source files directory
			output: "public", // Build output directory
			includes: "_includes", // Partial templates directory
			data: "_data", // Global data files directory
		},
		htmlTemplateEngine: "njk", // Nunjucks for HTML templates
	};
};
