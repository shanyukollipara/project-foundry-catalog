# Project Foundry Catalog

An offline-curated catalog of **200 technically deep, useful CS student projects**: exactly 10 projects in each of 20 domains. These are scoped as buildable systems with a concrete local vertical slice—not CRUD shells, generic dashboards, product clones, shallow model wrappers, or concepts that need a paid API to become demonstrable.

The machine-readable source of truth is [`catalog/projects.json`](catalog/projects.json). No application code is included in this repository.

## Quality bar and scoring

Every entry must have a real user and problem, a differentiating technical thesis, 3–6 architectural components, at least three hard engineering problems, a runnable local-first MVP, a deterministic demo, a test strategy, and explicit data/API and safety constraints. New extension entries also carry four numbered implementation milestones, an explicit dependency policy, a concrete risk, and a non-goal inside the existing schema fields. An MVP must work from synthetic, local, or openly available data without an account secret. The catalog deliberately excludes the existing Robinhood agentic backtester.

Scores use a 1–10 scale:

- **Usefulness (35%)** — severity/frequency of the problem and whether the MVP creates durable value.
- **Technical depth (30%)** — systems, algorithms, correctness, performance, security, or research difficulty beyond ordinary product plumbing.
- **Feasibility (20%)** — likelihood that a strong student can deliver the stated vertical slice in the estimated time.
- **Portfolio signal (15%)** — how clearly the result demonstrates engineering judgment and can be shown in a compelling demo.

The exact formula is:

```text
weighted_score = 0.35 × usefulness_score
               + 0.30 × technical_depth_score
               + 0.20 × feasibility_score
               + 0.15 × portfolio_signal_score
```

Ranks are append-only publication identifiers. The original 1–100 cohort retains its published order (which used descending weighted score and ascending `repo_slug` as its deterministic tiebreaker); the ten-domain extension occupies ranks 101–200 in stable ten-project domain cohorts and does not renumber the original catalog. Scores remain directly comparable across all entries, but rank is not a global score sort after the extension. The weights reward software worth keeping while preserving a hard technical bar. A lower-ranked project can still be the better choice for a particular student's background or intended specialty.

## Domain coverage

- **Distributed systems:** deterministic failure, causality, consistency, durability, consensus, and recovery.
- **Security/privacy:** least authority, provenance, protocol correctness, privacy accounting, and safe defensive analysis.
- **Developer tools:** semantic code analysis, deterministic builds/tests, migration safety, and resource-aware execution.
- **AI/agent infrastructure:** entitlements, verifiable execution, permissions, evaluation, context provenance, and stateful debugging—not chat wrappers.
- **Databases/search:** temporal data, indexing, incremental computation, query optimization, schema evolution, and crash consistency.
- **Networking/observability:** protocol replay, SLOs, inferred topology, sampling, clock correction, policy checking, and edge failure.
- **Markets/fintech:** mechanism simulation, accounting, payments, liquidity, fairness, and risk—with no live trading or brokerage dependency.
- **Accessibility/personal computing:** nonvisual regression testing, adaptive input, private assistive computing, AAC, attention, and sensory access.
- **Education/research tooling:** reproducibility, claim provenance, notebook state, misconception diagnosis, data lineage, and benchmark integrity.
- **Climate/civic/local infrastructure:** energy, transit, water, public budgets, buildings, logistics, air, resilience, meetings, and heat.
- **Programming languages/compilers:** incremental semantics, effect systems, verified rewrites, parsing recovery, ABI analysis, hygiene, and language-server determinism.
- **Operating systems/runtime systems:** syscall virtualization, process replay, CPU and cache scheduling, runtime pressure control, isolation, and portable snapshots.
- **Robotics/embedded systems:** calibration, estimation, real-time planning, runtime assurance, firmware updates, tactile sensing, and deterministic hardware simulation.
- **Computational science/engineering:** adaptive discretization, interval analysis, uncertainty, sparse solvers, reproducible sampling, inverse problems, and conservation.
- **Media/graphics systems:** codecs, color, procedural geometry, text shaping, audio restoration, GPU scheduling, spatial audio, and causal rendering diffs.
- **Geospatial systems:** offline map matching, terrain visibility, topology repair, robust routing, raster storage, positioning, generalization, and uncertain geometry.
- **Health/bioinformatics systems:** variant representation, temporal schedule verification, signal quality, provenance-safe timelines, private queries, and synthetic biological benchmarks.
- **Formal methods/verification:** linearizability, temporal logic, probabilistic and hybrid reachability, invariant synthesis, proof checking, and model-based conformance.
- **Storage/preservation systems:** erasure repair, format migration evidence, corruption triage, durable exports, media recovery, fixity planning, and software closure preservation.
- **Operations research/manufacturing systems:** disruption scheduling, cutting yield, inventory uncertainty, line balancing, repairable spares, quality drift, reverse logistics, and energy-aware production.

## Build Wave 1

Wave 1 selects four high-scoring projects from four different domains. They use substantially different engineering kernels, can be developed concurrently, and share no paid service dependency. Diversity is an explicit portfolio constraint, so the selection is not simply the first four ranking rows. Their interfaces can later interoperate without making one project block another.

### 1. Entitlement-Aware AI Subscription Router — `entitlement-aware-ai-router`

Model subscription plans as versioned temporal entitlements rather than a flat model list. Import synthetic/manual usage events, implement fixed and rolling reset-window accounting, normalize task requirements, and route across usefulness, privacy, quota scarcity, and latency constraints. The demo should show a long-context task moving to an already-paid plan while preserving scarce reasoning quota. Terms must always be tied to a dated user-supplied snapshot; the MVP neither logs into providers nor scrapes accounts.

### 2. Local Privacy Egress Gateway — `local-privacy-egress-gateway`

Build a loopback HTTP/SOCKS proxy, streaming classifiers, destination-aware policy engine, format-preserving redactor, and encrypted local decision ledger. The decisive demo is a mock agent attempting to upload seeded secrets and health data: the gateway blocks an unapproved destination and permits a safely redacted retry. The fixture uses a local echo server, and HTTPS interception remains explicit and limited to opted-in clients.

### 3. Screen Reader Regression Lab — `screen-reader-regression-lab`

Capture accessibility trees and semantic events, express keyboard workflows in a small action DSL, and align traces across builds. The MVP uses two local fixture applications to catch a focus trap and a missing live-region announcement that visual screenshots miss. This is a strong independent workstream because its core is browser semantics and accessible interaction testing, not AI or financial simulation. Automated results must be positioned as support for—not replacement of—testing by disabled users.

### 4. Counterfactual Prediction-Market AMM — `counterfactual-market-amm`

Implement deterministic event schemas, an LMSR-style AMM and compact limit-order engine, partial fills/fees, resolution rules, and a branchable counterfactual runner. Replay a bundled 5,000-event synthetic market, branch before a liquidity shock, and compare slippage, calibration, liquidity-provider exposure, and subsidy cost. The project is market-mechanism research software, not a trading agent: it has no wallet, brokerage integration, or profit claim.

### Parallel development boundaries

- Subscription Router owns entitlement/usage schemas and constrained routing.
- Privacy Gateway owns egress classification, redaction, and destination policy.
- Screen Reader Lab owns browser accessibility capture and trace alignment.
- Market AMM owns market event semantics and counterfactual execution.

All four can agree on simple JSON event envelopes for later integration, but no Wave 1 MVP depends on another repository. Each project should ship seeded fixtures, deterministic commands, invariant tests, and one end-to-end demo before adding adapters.

## Published implementations

The following repositories have passed an independent Codex review, their declared local quality gates, and a real end-to-end demo before publication:

- [`entitlement-aware-ai-router`](https://github.com/shanyukollipara/entitlement-aware-ai-router) — 50 deterministic tests plus coverage, type, lint, validation, build, and routing demo gates.
- [`local-privacy-egress-gateway`](https://github.com/shanyukollipara/local-privacy-egress-gateway) — 35 security-focused tests plus format, lint, type, packaging, and blocked/redacted egress demo gates.
- [`screen-reader-regression-lab`](https://github.com/shanyukollipara/screen-reader-regression-lab) — 26 semantic interaction tests plus format, lint, type, build, and two-regression demo gates.
- [`counterfactual-market-amm`](https://github.com/shanyukollipara/counterfactual-market-amm) — 29 mechanism/accounting tests plus deterministic 5,000-event data, type, lint, and counterfactual replay gates.
- [`verifiable-agent-trail`](https://github.com/shanyukollipara/verifiable-agent-trail) — 30 integrity and replay tests plus format, lint, type, selective-disclosure, and tamper-detection demo gates.
- [`agent-tool-permission-broker`](https://github.com/shanyukollipara/agent-tool-permission-broker) — 35 capability, revocation, replay, path-hardening, concurrency, and end-to-end enforcement tests plus lint, type, and demo gates.
- [`semantic-merge-engine`](https://github.com/shanyukollipara/semantic-merge-engine) — independently reviewed semantic merge engine with deterministic fixtures and declared local quality gates.
- [`home-energy-tariff-simulator`](https://github.com/shanyukollipara/home-energy-tariff-simulator) — independently reviewed tariff simulation engine with deterministic fixtures and declared local quality gates.
- [`citation-claim-graph`](https://github.com/shanyukollipara/citation-claim-graph) — independently reviewed evidence graph with deterministic fixtures and declared local quality gates.
- [`hybrid-retrieval-engine`](https://github.com/shanyukollipara/hybrid-retrieval-engine) — independently reviewed local retrieval engine with deterministic fixtures and declared local quality gates.
- [`network-policy-model-checker`](https://github.com/shanyukollipara/network-policy-model-checker) — independently reviewed layered-policy verifier with deterministic fixtures and declared local quality gates.
- [`agent-regression-simulator`](https://github.com/shanyukollipara/agent-regression-simulator) — independently reviewed agent environment simulator with deterministic fixtures and declared local quality gates.
- [`deterministic-chaos-cluster`](https://github.com/shanyukollipara/deterministic-chaos-cluster) — independently reviewed replicated-system simulator with deterministic fault injection and declared local quality gates.
- [`reproducible-paper-runner`](https://github.com/shanyukollipara/reproducible-paper-runner) — independently reviewed artifact-reproduction harness with deterministic fixtures and declared local quality gates.

## Full ranking

| Rank | Repository | Domain | Score | Wave |
|---:|---|---|---:|---|
| 1 | `verifiable-agent-trail` | AI/agent infrastructure | 9.60 | |
| 2 | `entitlement-aware-ai-router` | AI/agent infrastructure | 9.50 | Wave 1 |
| 3 | `screen-reader-regression-lab` | accessibility/personal computing | 9.50 | Wave 1 |
| 4 | `counterfactual-market-amm` | markets/fintech | 9.45 | Wave 1 |
| 5 | `agent-tool-permission-broker` | AI/agent infrastructure | 9.40 | |
| 6 | `semantic-merge-engine` | developer tools | 9.40 | |
| 7 | `home-energy-tariff-simulator` | climate/civic/local infrastructure | 9.35 | |
| 8 | `citation-claim-graph` | education/research tooling | 9.30 | |
| 9 | `hybrid-retrieval-engine` | databases/search | 9.30 | |
| 10 | `local-privacy-egress-gateway` | security/privacy | 9.30 | Wave 1 |
| 11 | `network-policy-model-checker` | networking/observability | 9.30 | |
| 12 | `reproducible-paper-runner` | education/research tooling | 9.30 | |
| 13 | `deterministic-chaos-cluster` | distributed systems | 9.25 | |
| 14 | `agent-regression-simulator` | AI/agent infrastructure | 9.15 | |
| 15 | `benchmark-leakage-detector` | education/research tooling | 9.15 | |
| 16 | `flaky-test-causality` | developer tools | 9.15 | |
| 17 | `migration-rehearsal-harness` | developer tools | 9.15 | |
| 18 | `notebook-provenance-kernel` | education/research tooling | 9.15 | |
| 19 | `semantic-filesystem-index` | databases/search | 9.15 | |
| 20 | `adaptive-trace-tail-sampler` | networking/observability | 9.10 | |
| 21 | `microgrid-outage-simulator` | climate/civic/local infrastructure | 9.10 | |
| 22 | `capability-plugin-sandbox` | security/privacy | 9.05 | |
| 23 | `causal-event-replay-debugger` | distributed systems | 9.05 | |
| 24 | `context-provenance-compiler` | AI/agent infrastructure | 9.05 | |
| 25 | `double-entry-reconciliation-engine` | markets/fintech | 9.05 | |
| 26 | `exactly-once-stream-lab` | distributed systems | 9.05 | |
| 27 | `packet-replay-digital-twin` | networking/observability | 9.05 | |
| 28 | `algorithm-misconception-debugger` | education/research tooling | 9.00 | |
| 29 | `api-compatibility-oracle` | developer tools | 9.00 | |
| 30 | `food-rescue-routing-lab` | climate/civic/local infrastructure | 9.00 | |
| 31 | `payment-routing-simulator` | markets/fintech | 9.00 | |
| 32 | `runtime-dependency-inference` | networking/observability | 9.00 | |
| 33 | `schema-evolution-proofkit` | databases/search | 9.00 | |
| 34 | `accessible-document-remediator` | accessibility/personal computing | 8.95 | |
| 35 | `artifact-provenance-verifier` | security/privacy | 8.95 | |
| 36 | `deterministic-build-explainer` | developer tools | 8.95 | |
| 37 | `durable-workflow-kernel` | distributed systems | 8.95 | |
| 38 | `bitemporal-embedded-store` | databases/search | 8.90 | |
| 39 | `concurrency-schedule-explorer` | developer tools | 8.85 | |
| 40 | `data-egress-policy-compiler` | security/privacy | 8.85 | |
| 41 | `offline-aac-composer` | accessibility/personal computing | 8.85 | |
| 42 | `agent-checkpoint-debugger` | AI/agent infrastructure | 8.80 | |
| 43 | `architecture-boundary-guard` | developer tools | 8.80 | |
| 44 | `building-retrofit-planner` | climate/civic/local infrastructure | 8.80 | |
| 45 | `personal-memory-provenance-index` | accessibility/personal computing | 8.80 | |
| 46 | `query-plan-counterfactuals` | databases/search | 8.80 | |
| 47 | `transit-reliability-replay` | climate/civic/local infrastructure | 8.80 | |
| 48 | `crash-consistency-page-lab` | databases/search | 8.75 | |
| 49 | `offline-crdt-workspace` | distributed systems | 8.75 | |
| 50 | `slo-burn-rate-lab` | networking/observability | 8.75 | |
| 51 | `adaptive-input-remapper` | accessibility/personal computing | 8.70 | |
| 52 | `budget-aware-local-model-router` | AI/agent infrastructure | 8.70 | |
| 53 | `distributed-systems-fault-tutor` | education/research tooling | 8.70 | |
| 54 | `incremental-view-kernel` | databases/search | 8.70 | |
| 55 | `offline-eval-corpus-forge` | AI/agent infrastructure | 8.70 | |
| 56 | `patch-risk-mapper` | developer tools | 8.70 | |
| 57 | `prompt-injection-fixture-lab` | AI/agent infrastructure | 8.70 | |
| 58 | `secret-history-exposure-planner` | security/privacy | 8.70 | |
| 59 | `auction-mechanism-laboratory` | markets/fintech | 8.65 | |
| 60 | `counterexample-proof-coach` | education/research tooling | 8.65 | |
| 61 | `dns-failure-workbench` | networking/observability | 8.65 | |
| 62 | `fencing-token-lock-lab` | distributed systems | 8.65 | |
| 63 | `passkey-protocol-lab` | security/privacy | 8.65 | |
| 64 | `synthetic-fraud-ring-graph` | markets/fintech | 8.65 | |
| 65 | `tamper-evident-file-ledger` | security/privacy | 8.65 | |
| 66 | `content-addressed-backup-swarm` | distributed systems | 8.60 | |
| 67 | `literature-contradiction-map` | education/research tooling | 8.60 | |
| 68 | `cognitive-load-reader` | accessibility/personal computing | 8.55 | |
| 69 | `local-ci-resource-scheduler` | developer tools | 8.55 | |
| 70 | `notification-attention-firewall` | accessibility/personal computing | 8.55 | |
| 71 | `offline-caption-quality-lab` | accessibility/personal computing | 8.55 | |
| 72 | `portable-document-lake` | databases/search | 8.55 | |
| 73 | `privacy-budget-telemetry` | security/privacy | 8.55 | |
| 74 | `research-data-lineage-packager` | education/research tooling | 8.55 | |
| 75 | `smoke-sensor-calibrator` | climate/civic/local infrastructure | 8.55 | |
| 76 | `stormwater-capacity-model` | climate/civic/local infrastructure | 8.55 | |
| 77 | `trace-structure-compressor` | networking/observability | 8.55 | |
| 78 | `civic-meeting-claim-tracker` | climate/civic/local infrastructure | 8.50 | |
| 79 | `clock-skew-forensics` | networking/observability | 8.50 | |
| 80 | `edge-outage-replay` | networking/observability | 8.50 | |
| 81 | `geo-consistency-tuner` | distributed systems | 8.50 | |
| 82 | `municipal-budget-diff` | climate/civic/local infrastructure | 8.50 | |
| 83 | `reserve-stress-engine` | markets/fintech | 8.50 | |
| 84 | `stream-dedup-index` | databases/search | 8.50 | |
| 85 | `tax-lot-optimizer` | markets/fintech | 8.50 | |
| 86 | `adaptive-shard-rebalancer` | distributed systems | 8.45 | |
| 87 | `binary-size-atlas` | developer tools | 8.45 | |
| 88 | `credit-fairness-simulator` | markets/fintech | 8.45 | |
| 89 | `multi-agent-deadlock-detector` | AI/agent infrastructure | 8.45 | |
| 90 | `urban-canopy-cooling-model` | climate/civic/local infrastructure | 8.45 | |
| 91 | `byzantine-quorum-workbench` | distributed systems | 8.40 | |
| 92 | `liquidity-contagion-network` | markets/fintech | 8.40 | |
| 93 | `options-microstructure-sandbox` | markets/fintech | 8.40 | |
| 94 | `differential-query-sandbox` | security/privacy | 8.25 | |
| 95 | `dwell-typing-laboratory` | accessibility/personal computing | 8.20 | |
| 96 | `peer-review-consistency-auditor` | education/research tooling | 8.20 | |
| 97 | `quic-congestion-simulator` | networking/observability | 8.20 | |
| 98 | `sensory-environment-mapper` | accessibility/personal computing | 8.20 | |
| 99 | `learned-index-benchlab` | databases/search | 8.15 | |
| 100 | `phishing-behavior-range` | security/privacy | 7.85 | |
| 101 | `incremental-query-compiler` | programming languages/compilers | 9.10 | |
| 102 | `effect-capability-checker` | programming languages/compilers | 9.10 | |
| 103 | `verified-bytecode-optimizer` | programming languages/compilers | 8.70 | |
| 104 | `grammar-repair-parser` | programming languages/compilers | 8.65 | |
| 105 | `profile-guided-wasm-specializer` | programming languages/compilers | 8.90 | |
| 106 | `refactoring-proof-engine` | programming languages/compilers | 9.05 | |
| 107 | `macro-expansion-debugger` | programming languages/compilers | 8.65 | |
| 108 | `memory-layout-abi-auditor` | programming languages/compilers | 9.00 | |
| 109 | `deterministic-language-server-core` | programming languages/compilers | 9.10 | |
| 110 | `binary-lifting-analysis-lab` | programming languages/compilers | 8.70 | |
| 111 | `userspace-kernel-sandbox` | operating systems/runtime systems | 9.05 | |
| 112 | `deterministic-process-replayer` | operating systems/runtime systems | 9.20 | |
| 113 | `scheduler-tail-latency-lab` | operating systems/runtime systems | 9.00 | |
| 114 | `page-cache-policy-lab` | operating systems/runtime systems | 8.65 | |
| 115 | `priority-inversion-explorer` | operating systems/runtime systems | 9.10 | |
| 116 | `zero-copy-pipeline-profiler` | operating systems/runtime systems | 8.60 | |
| 117 | `process-snapshot-migrator` | operating systems/runtime systems | 8.70 | |
| 118 | `sandboxed-driver-runtime` | operating systems/runtime systems | 9.05 | |
| 119 | `runtime-memory-pressure-controller` | operating systems/runtime systems | 8.90 | |
| 120 | `syscall-contract-miner` | operating systems/runtime systems | 8.80 | |
| 121 | `sensor-fusion-calibration-bench` | robotics/embedded systems | 9.05 | |
| 122 | `real-time-motion-planner` | robotics/embedded systems | 9.05 | |
| 123 | `fault-tolerant-robot-supervisor` | robotics/embedded systems | 9.15 | |
| 124 | `embedded-power-budget-profiler` | robotics/embedded systems | 9.00 | |
| 125 | `deterministic-hardware-loop-lab` | robotics/embedded systems | 8.85 | |
| 126 | `multi-robot-coverage-simulator` | robotics/embedded systems | 8.70 | |
| 127 | `safe-firmware-update-prover` | robotics/embedded systems | 9.60 | |
| 128 | `tactile-signal-decoder` | robotics/embedded systems | 8.45 | |
| 129 | `visual-inertial-odometry-lab` | robotics/embedded systems | 8.85 | |
| 130 | `constraint-robot-calibrator` | robotics/embedded systems | 8.75 | |
| 131 | `adaptive-pde-mesh-workbench` | computational science/engineering | 8.85 | |
| 132 | `interval-numerics-auditor` | computational science/engineering | 9.25 | |
| 133 | `differentiable-physics-checker` | computational science/engineering | 8.70 | |
| 134 | `uncertainty-propagation-engine` | computational science/engineering | 9.35 | |
| 135 | `sparse-solver-autotuner` | computational science/engineering | 8.95 | |
| 136 | `reproducible-monte-carlo-kernel` | computational science/engineering | 9.10 | |
| 137 | `inverse-problem-regularization-lab` | computational science/engineering | 9.10 | |
| 138 | `conservation-law-simulator` | computational science/engineering | 8.55 | |
| 139 | `floating-point-stability-forensics` | computational science/engineering | 8.95 | |
| 140 | `multiphysics-coupling-orchestrator` | computational science/engineering | 8.85 | |
| 141 | `perceptual-video-encoder-lab` | media/graphics systems | 8.70 | |
| 142 | `color-pipeline-verifier` | media/graphics systems | 9.15 | |
| 143 | `procedural-geometry-compiler` | media/graphics systems | 8.90 | |
| 144 | `font-shaping-conformance-lab` | media/graphics systems | 9.05 | |
| 145 | `audio-restoration-workbench` | media/graphics systems | 9.00 | |
| 146 | `gpu-framegraph-scheduler` | media/graphics systems | 9.25 | |
| 147 | `media-provenance-watermark-lab` | media/graphics systems | 8.65 | |
| 148 | `spatial-audio-renderer` | media/graphics systems | 8.90 | |
| 149 | `texture-streaming-simulator` | media/graphics systems | 8.65 | |
| 150 | `scene-difference-renderer` | media/graphics systems | 8.90 | |
| 151 | `offline-map-matching-engine` | geospatial systems | 8.80 | |
| 152 | `terrain-visibility-planner` | geospatial systems | 8.75 | |
| 153 | `geospatial-topology-repair` | geospatial systems | 9.05 | |
| 154 | `evacuation-accessibility-router` | geospatial systems | 8.95 | |
| 155 | `spatiotemporal-raster-cube` | geospatial systems | 9.05 | |
| 156 | `gps-drift-corrector` | geospatial systems | 8.80 | |
| 157 | `map-generalization-compiler` | geospatial systems | 8.90 | |
| 158 | `indoor-positioning-fusion-lab` | geospatial systems | 8.75 | |
| 159 | `boundary-uncertainty-engine` | geospatial systems | 8.75 | |
| 160 | `offline-geofence-query-engine` | geospatial systems | 9.00 | |
| 161 | `genome-variant-normalizer` | health/bioinformatics systems | 9.25 | |
| 162 | `medication-schedule-verifier` | health/bioinformatics systems | 9.35 | |
| 163 | `physiological-signal-quality-lab` | health/bioinformatics systems | 9.00 | |
| 164 | `clinical-timeline-reconciler` | health/bioinformatics systems | 9.10 | |
| 165 | `pedigree-consistency-checker` | health/bioinformatics systems | 9.10 | |
| 166 | `sequencing-error-simulator` | health/bioinformatics systems | 8.65 | |
| 167 | `protein-motif-search-engine` | health/bioinformatics systems | 8.75 | |
| 168 | `medical-image-deid-auditor` | health/bioinformatics systems | 9.15 | |
| 169 | `outbreak-nowcast-simulator` | health/bioinformatics systems | 8.80 | |
| 170 | `wearable-anomaly-explainer` | health/bioinformatics systems | 9.00 | |
| 171 | `linearizability-witness-checker` | formal methods/verification | 9.10 | |
| 172 | `temporal-monitor-compiler` | formal methods/verification | 9.10 | |
| 173 | `probabilistic-model-checker` | formal methods/verification | 8.75 | |
| 174 | `hybrid-reachability-workbench` | formal methods/verification | 8.70 | |
| 175 | `refinement-invariant-synthesizer` | formal methods/verification | 8.90 | |
| 176 | `smt-theory-solver-lab` | formal methods/verification | 8.70 | |
| 177 | `proof-carrying-transform-pipeline` | formal methods/verification | 8.80 | |
| 178 | `stateful-conformance-explorer` | formal methods/verification | 9.00 | |
| 179 | `separation-logic-heap-lab` | formal methods/verification | 8.55 | |
| 180 | `unsat-proof-stream-verifier` | formal methods/verification | 8.75 | |
| 181 | `erasure-archive-scrubber` | storage/preservation systems | 9.00 | |
| 182 | `format-migration-evidence-lab` | storage/preservation systems | 8.80 | |
| 183 | `filesystem-corruption-triage` | storage/preservation systems | 9.05 | |
| 184 | `reproducible-export-capsule` | storage/preservation systems | 9.00 | |
| 185 | `optical-media-recovery-planner` | storage/preservation systems | 8.65 | |
| 186 | `metadata-roundtrip-conformance` | storage/preservation systems | 8.65 | |
| 187 | `tape-restore-scheduler` | storage/preservation systems | 9.00 | |
| 188 | `archive-fixity-sampling-planner` | storage/preservation systems | 8.50 | |
| 189 | `versioned-dataset-compactor` | storage/preservation systems | 8.80 | |
| 190 | `dependency-closure-vault` | storage/preservation systems | 8.95 | |
| 191 | `job-shop-disruption-rescheduler` | operations research/manufacturing systems | 9.00 | |
| 192 | `cutting-stock-yield-optimizer` | operations research/manufacturing systems | 8.80 | |
| 193 | `inventory-service-level-simulator` | operations research/manufacturing systems | 8.85 | |
| 194 | `assembly-line-balance-verifier` | operations research/manufacturing systems | 9.00 | |
| 195 | `maintenance-spares-allocator` | operations research/manufacturing systems | 8.80 | |
| 196 | `quality-drift-control-engine` | operations research/manufacturing systems | 9.00 | |
| 197 | `reverse-logistics-network-planner` | operations research/manufacturing systems | 8.80 | |
| 198 | `warehouse-slotting-simulator` | operations research/manufacturing systems | 9.00 | |
| 199 | `cold-chain-excursion-reconciler` | operations research/manufacturing systems | 9.00 | |
| 200 | `production-energy-load-shaper` | operations research/manufacturing systems | 8.80 | |

## Data shape

`catalog/projects.json` contains catalog metadata, the canonical 20-domain list, Wave 1 slugs, and the append-only ranked `projects` array. Every project contains all requested narrative, architecture, MVP, safety, estimate, score, rank, and selection fields. Array fields are used for target users, components, hard parts, and stretch goals so downstream tools do not need to parse comma-separated prose. To preserve the exact established object schema, extension milestones live in `local_first_mvp`, dependency policies and data plans live in `data_and_api_constraints`, and risks/non-goals live in `misuse_or_safety_notes`.

## Validation contract

The catalog is intended to satisfy these machine-checkable invariants:

- valid JSON with exactly 200 project objects;
- exactly 20 canonical domains and exactly 10 projects in each;
- unique project names, slugs, and ranks, with contiguous ranks 1–200;
- the original ranks 1–170 matching the committed semantic SHA-256 baseline;
- the exact canonical field set on every project and populated required values;
- globally unique lowercase kebab-case repository slugs;
- 3–6 architecture components and at least 3 technically hard parts per project;
- integer component scores from 1 through 10 and positive integer build-day estimates;
- weighted scores equal to the published formula;
- 3–5 numbered milestones, explicit dependency policy, deterministic tests, risk, failure mode, non-goal, and `build_wave_1=false` on every rank 171–200 entry;
- no forbidden shallow project categories;
- a 200-row README ranking synchronized to the JSON while all published implementation links remain present; and
- exactly four Wave 1 entries, matching the top-level Wave 1 slug list.

Run the dependency-free deterministic check with:

```sh
node scripts/validate-catalog.mjs
```
