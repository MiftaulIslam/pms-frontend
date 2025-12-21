/**
 * Node.js script to generate Heroicons React TSX components
 * npm install axios jsdom fs-extra
 */

import axios from "axios";
import { JSDOM } from "jsdom";
import fs from "fs-extra";
import path from "path";

const ICONS_DIR = path.join(process.cwd(), "icons");

// URLs
const HEROICONS = [
  { type: "solid", url: "https://heroicons.com/solid" },
  { type: "outline", url: "https://heroicons.com/outline" },
];

// Convert kebab-case or snake-case to PascalCase
const toPascalCase = (str: string) =>
  str
    .replace(/(^\w|[-_]\w)/g, (match) => match.replace(/[-_]/, "").toUpperCase());

async function fetchAndGenerate(type: "solid" | "outline", url: string) {
  console.log(`Fetching ${type} icons...`);
  const res = await axios.get(url);
  const dom = new JSDOM(res.data);
  const document = dom.window.document;

  const iconGroups = document.querySelectorAll("div.group");
  const outputFolder = path.join(ICONS_DIR, type);
  await fs.ensureDir(outputFolder);

  for (const group of iconGroups) {
    const nameDiv = group.querySelector("div[title]");
    const svgEl = group.querySelector("svg");

    if (!nameDiv || !svgEl) continue;

    const iconName = nameDiv.title;
    const componentName = toPascalCase(iconName);
    let svgString = svgEl.outerHTML;

    // Remove hardcoded attributes we want to control via props
    svgString = svgString
      .replace(/width="[^"]*"/g, "")
      .replace(/height="[^"]*"/g, "")
      .replace(/fill="[^"]*"/g, "")
      .replace(/stroke="[^"]*"/g, "")
      .replace(/class="[^"]*"/g, "");

    // TSX template
    const tsx = `import React from 'react';

interface ${componentName}Props extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  fill?: string;
  stroke?: string;
}

// Set defaults based on type
const ${componentName}: React.FC<${componentName}Props> = ({
  size = 24,
  className = '',
  fill = '${type === "solid" ? "currentColor" : "none"}',
  stroke = '${type === "solid" ? "none" : "currentColor"}',
  ...props
}) => (
  ${svgString.replace(
      /<svg[^>]*>/,
      `<svg
    width={size}
    height={size}
    fill={fill}
    stroke={stroke}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}>`
    )}
);

export default ${componentName};
`;

    const filePath = path.join(outputFolder, `${componentName}.tsx`);
    await fs.writeFile(filePath, tsx, "utf8");
    console.log(`[${type}] Created: ${componentName}.tsx`);
  }
}

async function main() {
  for (const iconSet of HEROICONS) {
    await fetchAndGenerate(iconSet.type as "solid" | "outline", iconSet.url);
  }
  console.log("All icons generated successfully!");
}

main().catch(console.error);
