# Changelog

_All notable changes to this project will be documented in this file._
_The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)._

## [1.0.1]

### Security

- Fix CWD-based binary hijack via `npx` by using absolute path to danger binary
- Remove workspace `node_modules/` before execution to prevent Node.js module resolution hijack from fork PRs

## [Unreleased]
