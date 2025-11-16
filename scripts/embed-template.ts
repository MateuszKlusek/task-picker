#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
import { log } from "../src/utils/logger";

/**
 * Embed the template into the build process, becuase it's faster then reading from the file system in runtime
 */

const templatePath = path.join(
  __dirname,
  "../config/.task-picker.config-template.yaml"
);
const templateContent = fs.readFileSync(templatePath, "utf8");

const embeddedTemplate = `// This file is auto-generated during build
// Do not edit manually

export const EMBEDDED_TEMPLATE = \`${templateContent}\`;
`;

const outputPath = path.join(__dirname, "../src/template.ts");

fs.writeFileSync(outputPath, embeddedTemplate);

log.info("Embedded template into src/template.ts");
