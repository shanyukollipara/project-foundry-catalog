#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";

const root = new URL("../", import.meta.url);
const catalogPath = new URL("catalog/projects.json", root);
const readmePath = new URL("README.md", root);
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const readme = fs.readFileSync(readmePath, "utf8");
const errors = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};

const EXPECTED_TOTAL = 170;
const LEGACY_TOTAL = 100;
const LEGACY_SEMANTIC_SHA256 = "6f22253fc0bde5a44c32dcc459c4673d6becb9aa2e449cbb33126ced5daebf37";
const EXPECTED_FIELDS = [
  "domain", "repo_slug", "name", "one_sentence", "concrete_problem",
  "target_users", "why_now", "differentiator", "architecture",
  "technically_hard_parts", "local_first_mvp", "stretch_goals", "demo_story",
  "test_strategy", "data_and_api_constraints", "misuse_or_safety_notes",
  "estimated_build_days", "usefulness_score", "technical_depth_score",
  "feasibility_score", "portfolio_signal_score", "weighted_score",
  "build_wave_1", "rank",
];
const SCORE_FIELDS = [
  "usefulness_score", "technical_depth_score", "feasibility_score",
  "portfolio_signal_score",
];
const ARRAY_FIELDS = [
  "target_users", "architecture", "technically_hard_parts", "stretch_goals",
];
const SHALLOW_CATEGORY = /\b(?:crud\s+(?:app|wrapper)|dashboard\s+app|product\s+clone|application\s+clone|prompt\s+collection|thin\s+api\s+client|generic\s+api\s+wrapper)\b/i;
const PUBLISHED_LINKS = [
  "https://github.com/shanyukollipara/entitlement-aware-ai-router",
  "https://github.com/shanyukollipara/local-privacy-egress-gateway",
  "https://github.com/shanyukollipara/screen-reader-regression-lab",
  "https://github.com/shanyukollipara/counterfactual-market-amm",
  "https://github.com/shanyukollipara/verifiable-agent-trail",
  "https://github.com/shanyukollipara/agent-tool-permission-broker",
];

check(Array.isArray(catalog.projects), "projects must be an array");
check(catalog.projects.length === EXPECTED_TOTAL, `expected ${EXPECTED_TOTAL} projects, found ${catalog.projects.length}`);
check(Array.isArray(catalog.domains), "domains must be an array");
check(catalog.domains.length === 17, `expected 17 domains, found ${catalog.domains.length}`);
check(new Set(catalog.domains).size === 17, "domain names must be unique");
check(catalog.generated_without_external_services === true, "catalog must require no external services");
check(/append-only publication rank/.test(catalog.ranking_tiebreaker ?? ""), "ranking metadata must describe append-only ranks");

const semanticDigest = crypto
  .createHash("sha256")
  .update(JSON.stringify(catalog.projects.slice(0, LEGACY_TOTAL)))
  .digest("hex");
check(
  semanticDigest === LEGACY_SEMANTIC_SHA256,
  `ranks 1-${LEGACY_TOTAL} changed semantically: expected ${LEGACY_SEMANTIC_SHA256}, found ${semanticDigest}`,
);

const names = new Set();
const slugs = new Set();
const ranks = new Set();
const domainCounts = new Map(catalog.domains.map((domain) => [domain, 0]));

for (const [index, item] of catalog.projects.entries()) {
  const label = `project ${index + 1} (${item?.repo_slug ?? "missing slug"})`;
  check(item && typeof item === "object" && !Array.isArray(item), `${label} must be an object`);
  if (!item || typeof item !== "object" || Array.isArray(item)) continue;

  check(
    JSON.stringify(Object.keys(item)) === JSON.stringify(EXPECTED_FIELDS),
    `${label} fields/order differ from the canonical schema`,
  );
  check(item.rank === index + 1, `${label} must have rank ${index + 1}`);
  check(!ranks.has(item.rank), `${label} has duplicate rank ${item.rank}`);
  ranks.add(item.rank);

  const normalizedName = typeof item.name === "string" ? item.name.trim().toLowerCase() : "";
  const normalizedSlug = typeof item.repo_slug === "string" ? item.repo_slug.trim().toLowerCase() : "";
  check(normalizedName.length > 0, `${label} name must be populated`);
  check(!names.has(normalizedName), `${label} has duplicate name ${item.name}`);
  names.add(normalizedName);
  check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.repo_slug ?? ""), `${label} slug must be lowercase kebab-case`);
  check(!slugs.has(normalizedSlug), `${label} has duplicate slug ${item.repo_slug}`);
  slugs.add(normalizedSlug);

  check(domainCounts.has(item.domain), `${label} uses unknown domain ${item.domain}`);
  if (domainCounts.has(item.domain)) domainCounts.set(item.domain, domainCounts.get(item.domain) + 1);

  for (const field of EXPECTED_FIELDS) {
    const value = item[field];
    if (typeof value === "string") check(value.trim().length > 0, `${label}.${field} must be populated`);
    else if (Array.isArray(value)) check(value.length > 0, `${label}.${field} must be populated`);
    else check(value !== null && value !== undefined, `${label}.${field} must be populated`);
  }
  for (const field of ARRAY_FIELDS) {
    check(Array.isArray(item[field]), `${label}.${field} must be an array`);
    if (Array.isArray(item[field])) {
      check(item[field].every((value) => typeof value === "string" && value.trim()), `${label}.${field} contains an empty value`);
    }
  }
  check(Array.isArray(item.target_users) && item.target_users.length >= 2, `${label} needs at least 2 target users`);
  check(Array.isArray(item.architecture) && item.architecture.length >= 3 && item.architecture.length <= 6, `${label} needs 3-6 architecture components`);
  check(Array.isArray(item.technically_hard_parts) && item.technically_hard_parts.length >= 3, `${label} needs at least 3 hard parts`);
  check(Array.isArray(item.stretch_goals) && item.stretch_goals.length >= 1, `${label} needs stretch goals`);
  check(typeof item.concrete_problem === "string" && !item.concrete_problem.includes("\n"), `${label} problem must be one line`);
  check(!SHALLOW_CATEGORY.test([item.name, item.one_sentence, item.concrete_problem, item.differentiator].join(" ")), `${label} is a forbidden shallow category`);
  check(Number.isInteger(item.estimated_build_days) && item.estimated_build_days > 0, `${label} build days must be a positive integer`);
  for (const field of SCORE_FIELDS) {
    check(Number.isInteger(item[field]) && item[field] >= 1 && item[field] <= 10, `${label}.${field} must be an integer from 1 to 10`);
  }
  const expectedWeighted = Number((
    0.35 * item.usefulness_score +
    0.30 * item.technical_depth_score +
    0.20 * item.feasibility_score +
    0.15 * item.portfolio_signal_score
  ).toFixed(2));
  check(item.weighted_score === expectedWeighted, `${label} weighted score should be ${expectedWeighted}, found ${item.weighted_score}`);

  if (item.rank > LEGACY_TOTAL) {
    const milestoneCount = [...item.local_first_mvp.matchAll(/(?:^|; |: )(\d)\) /g)].length;
    check(milestoneCount >= 3 && milestoneCount <= 5, `${label} needs 3-5 numbered MVP milestones, found ${milestoneCount}`);
    check(/Dependency policy:/i.test(item.data_and_api_constraints), `${label} needs an explicit dependency policy`);
    check(/no paid APIs or credentials/i.test(item.data_and_api_constraints), `${label} must require no paid APIs or credentials`);
    check(/Risk:/i.test(item.misuse_or_safety_notes), `${label} needs an explicit risk`);
    check(/Non-goal:/i.test(item.misuse_or_safety_notes), `${label} needs an explicit non-goal`);
    check(item.build_wave_1 === false, `${label} must set build_wave_1=false`);
  }
}

for (const [domain, count] of domainCounts) {
  check(count === 10, `domain ${domain} must contain 10 projects, found ${count}`);
}
check(ranks.size === EXPECTED_TOTAL, `expected ${EXPECTED_TOTAL} unique ranks, found ${ranks.size}`);
check(names.size === EXPECTED_TOTAL, `expected ${EXPECTED_TOTAL} unique names, found ${names.size}`);
check(slugs.size === EXPECTED_TOTAL, `expected ${EXPECTED_TOTAL} unique slugs, found ${slugs.size}`);

const selectedWave = catalog.projects.filter((item) => item.build_wave_1).map((item) => item.repo_slug).sort();
check(
  JSON.stringify(selectedWave) === JSON.stringify([...catalog.build_wave_1].sort()),
  "top-level build_wave_1 must exactly match selected projects",
);
check(catalog.build_wave_1.length === 4, "exactly four projects must be in Build Wave 1");

check(/\*\*170 technically deep, useful CS student projects\*\*/.test(readme), "README total must say 170 projects");
check(/17 domains/.test(readme), "README methodology must mention 17 domains");
for (const domain of catalog.domains) {
  check(readme.includes(`**${domain[0].toUpperCase()}${domain.slice(1)}:**`), `README domain coverage missing ${domain}`);
}
for (const link of PUBLISHED_LINKS) check(readme.includes(link), `README lost published implementation link ${link}`);

const tableRows = [...readme.matchAll(/^\| (\d+) \| `([^`]+)` \| ([^|]+?) \| (\d+\.\d{2}) \|([^|]*)\|$/gm)]
  .map((match) => ({ rank: Number(match[1]), slug: match[2], domain: match[3].trim(), score: Number(match[4]), wave: match[5].trim() }));
check(tableRows.length === EXPECTED_TOTAL, `README ranking must contain ${EXPECTED_TOTAL} rows, found ${tableRows.length}`);
for (const [index, row] of tableRows.entries()) {
  const item = catalog.projects[index];
  if (!item) continue;
  check(row.rank === item.rank, `README row ${index + 1} rank mismatch`);
  check(row.slug === item.repo_slug, `README rank ${item.rank} slug mismatch`);
  check(row.domain === item.domain, `README rank ${item.rank} domain mismatch`);
  check(row.score === item.weighted_score, `README rank ${item.rank} score mismatch`);
  check(row.wave === (item.build_wave_1 ? "Wave 1" : ""), `README rank ${item.rank} Wave mismatch`);
}

if (errors.length) {
  console.error(`Catalog validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Catalog validation passed: ${EXPECTED_TOTAL} projects, 17 domains, 10 projects per domain.`);
console.log(`Legacy semantic digest verified for ranks 1-${LEGACY_TOTAL}: ${LEGACY_SEMANTIC_SHA256}`);
console.log(`README ranking verified: ${tableRows.length} rows and ${PUBLISHED_LINKS.length} published links preserved.`);
