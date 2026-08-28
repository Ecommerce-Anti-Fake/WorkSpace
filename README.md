# AntiFake Documentation Workspace

Canonical documentation and visual-evidence repository for the AntiFake
production UAT program.

- `docs/` contains the preserved QA artifacts, Vietnamese user guide, journey
  maps, registry, visual manifest, source audit, handoffs, and evidence assets.
- `docs/UAT_REPORT.md`, `docs/UAT_TEST_MATRIX.md`, and `docs/UAT_ISSUES.md`
  remain the QA/UAT source documents.
- `docs/user-guide/` is the canonical guide and Journey Center content source.
- `docs/images/` is retained at its existing path so current relative links and
  evidence references remain valid; future assets should follow the manifest.

The application runtime remains in the separate `Front-End` and `back-end`
repositories. This repository stores documentation and sanitized evidence only.

Production evidence in the current acceptance package is scoped to revision
`8157ffa`. Credentials, cookies, tokens, auth state, traces, and real personal
or payment data must never be committed here.

Repository: `Ecommerce-Anti-Fake/WorkSpace`
