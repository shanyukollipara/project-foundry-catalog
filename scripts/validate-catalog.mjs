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

const EXPECTED_TOTAL = 200;
const EXPECTED_DOMAIN_TOTAL = 20;
const EXPECTED_PROJECTS_PER_DOMAIN = 10;
const LEGACY_TOTAL = 170;
const LEGACY_SEMANTIC_SHA256 = "4c31140e51fdaa1b45f569d9acda1c1e77254c6f1b6554a2c957f2fc21936f9e";
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
const INTEGER_FIELDS = ["estimated_build_days", ...SCORE_FIELDS, "rank"];
const BOOLEAN_FIELDS = ["build_wave_1"];
const STRING_FIELDS = EXPECTED_FIELDS.filter(
  (field) => !ARRAY_FIELDS.includes(field) && !INTEGER_FIELDS.includes(field) &&
    !BOOLEAN_FIELDS.includes(field) && field !== "weighted_score",
);
const SHALLOW_CATEGORY = /\b(?:crud\s+(?:app|wrapper)|dashboard\s+app|product\s+clone|application\s+clone|prompt\s+collection|thin\s+api\s+client|generic\s+api\s+wrapper)\b/i;
const PUBLISHED_LINKS = [
  "https://github.com/shanyukollipara/entitlement-aware-ai-router",
  "https://github.com/shanyukollipara/local-privacy-egress-gateway",
  "https://github.com/shanyukollipara/screen-reader-regression-lab",
  "https://github.com/shanyukollipara/counterfactual-market-amm",
  "https://github.com/shanyukollipara/verifiable-agent-trail",
  "https://github.com/shanyukollipara/agent-tool-permission-broker",
  "https://github.com/shanyukollipara/semantic-merge-engine",
  "https://github.com/shanyukollipara/home-energy-tariff-simulator",
  "https://github.com/shanyukollipara/citation-claim-graph",
  "https://github.com/shanyukollipara/hybrid-retrieval-engine",
  "https://github.com/shanyukollipara/network-policy-model-checker",
  "https://github.com/shanyukollipara/agent-regression-simulator",
  "https://github.com/shanyukollipara/deterministic-chaos-cluster",
  "https://github.com/shanyukollipara/reproducible-paper-runner",
];

check(Array.isArray(catalog.projects), "projects must be an array");
check(catalog.projects.length === EXPECTED_TOTAL, `expected ${EXPECTED_TOTAL} projects, found ${catalog.projects.length}`);
check(Array.isArray(catalog.domains), "domains must be an array");
check(catalog.domains.length === EXPECTED_DOMAIN_TOTAL, `expected ${EXPECTED_DOMAIN_TOTAL} domains, found ${catalog.domains.length}`);
check(new Set(catalog.domains).size === EXPECTED_DOMAIN_TOTAL, "domain names must be unique");
check(catalog.domains.every((domain) => typeof domain === "string" && domain.trim()), "domain names must be populated strings");
check(catalog.generated_without_external_services === true, "catalog must require no external services");
check(/append-only publication rank/.test(catalog.ranking_tiebreaker ?? ""), "ranking metadata must describe append-only ranks");
check(catalog.score_scale?.minimum === 1 && catalog.score_scale?.maximum === 10, "score scale must remain 1 through 10");

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

  const normalizedName = typeof item.name === "string" ? item.name.normalize("NFKC").trim().toLowerCase() : "";
  const normalizedSlug = typeof item.repo_slug === "string" ? item.repo_slug.normalize("NFKC").trim().toLowerCase() : "";
  check(normalizedName.length > 0, `${label} name must be populated`);
  check(!names.has(normalizedName), `${label} has duplicate name ${item.name}`);
  names.add(normalizedName);
  check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.repo_slug ?? ""), `${label} slug must be lowercase kebab-case`);
  check(!slugs.has(normalizedSlug), `${label} has duplicate slug ${item.repo_slug}`);
  slugs.add(normalizedSlug);

  check(domainCounts.has(item.domain), `${label} uses unknown domain ${item.domain}`);
  if (domainCounts.has(item.domain)) domainCounts.set(item.domain, domainCounts.get(item.domain) + 1);

  for (const field of EXPECTED_FIELDS) {
    check(Object.hasOwn(item, field), `${label}.${field} must be present`);
    const value = item[field];
    if (typeof value === "string") check(value.trim().length > 0, `${label}.${field} must be populated`);
    else if (Array.isArray(value)) check(value.length > 0, `${label}.${field} must be populated`);
    else check(value !== null && value !== undefined, `${label}.${field} must be populated`);
  }
  for (const field of STRING_FIELDS) check(typeof item[field] === "string", `${label}.${field} must be a string`);
  for (const field of INTEGER_FIELDS) check(Number.isInteger(item[field]), `${label}.${field} must be an integer`);
  for (const field of BOOLEAN_FIELDS) check(typeof item[field] === "boolean", `${label}.${field} must be a boolean`);
  check(typeof item.weighted_score === "number" && Number.isFinite(item.weighted_score), `${label}.weighted_score must be a finite number`);
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
    check(/Failure mode:/i.test(item.misuse_or_safety_notes), `${label} needs an explicit failure mode`);
    check(/Non-goal:/i.test(item.misuse_or_safety_notes), `${label} needs an explicit non-goal`);
    check(/Deterministic/i.test(item.test_strategy), `${label} needs an explicit deterministic test strategy`);
    check(item.build_wave_1 === false, `${label} must set build_wave_1=false`);
  }
}

for (const [domain, count] of domainCounts) {
  check(count === EXPECTED_PROJECTS_PER_DOMAIN, `domain ${domain} must contain ${EXPECTED_PROJECTS_PER_DOMAIN} projects, found ${count}`);
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

check(/\*\*200 technically deep, useful CS student projects\*\*/.test(readme), "README total must say 200 projects");
check(/20 domains/.test(readme), "README methodology must mention 20 domains");
for (const domain of catalog.domains) {
  check(readme.includes(`**${domain[0].toUpperCase()}${domain.slice(1)}:**`), `README domain coverage missing ${domain}`);
}

const implementationSection = readme.match(/## Published implementations\n([\s\S]*?)\n## /)?.[1] ?? "";
const implementationRows = [...implementationSection.matchAll(/^- \[`([^`]+)`\]\((https:\/\/github\.com\/[^)]+)\)/gm)]
  .map((match) => ({ slug: match[1], link: match[2] }));
check(implementationRows.length === PUBLISHED_LINKS.length, `README must contain exactly ${PUBLISHED_LINKS.length} published implementation links, found ${implementationRows.length}`);
check(
  JSON.stringify(implementationRows.map((row) => row.link)) === JSON.stringify(PUBLISHED_LINKS),
  "README published implementation links or order changed",
);
for (const row of implementationRows) {
  check(row.link.endsWith(`/${row.slug}`), `README implementation link does not match slug ${row.slug}`);
  check(slugs.has(row.slug), `README implementation slug ${row.slug} is absent from the catalog`);
}

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

console.log(`Catalog validation passed: ${EXPECTED_TOTAL} projects, ${EXPECTED_DOMAIN_TOTAL} domains, ${EXPECTED_PROJECTS_PER_DOMAIN} projects per domain.`);
console.log(`Legacy semantic digest verified for ranks 1-${LEGACY_TOTAL}: ${LEGACY_SEMANTIC_SHA256}`);
console.log(`README ranking verified: ${tableRows.length} rows and ${implementationRows.length} published links preserved.`);
