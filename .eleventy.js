const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("static");

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  const i18nDir = path.join(__dirname, "_data", "i18n");
  const translations = {};
  fs.readdirSync(i18nDir).forEach((file) => {
    const locale = path.basename(file, ".json");
    translations[locale] = JSON.parse(fs.readFileSync(path.join(i18nDir, file), "utf-8"));
  });

  eleventyConfig.addFilter("t", (key, locale) => {
    const keys = key.split(".");
    let value = translations[locale] || translations["en"];
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return key;
      }
    }
    return value;
  });

  eleventyConfig.addFilter("locales", () => Object.keys(translations));

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: false,
  };
};
