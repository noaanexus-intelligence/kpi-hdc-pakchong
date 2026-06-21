import type { HdcCoverageResponse } from "./hdc-types";

declare global {
  var __hdcPakchongLastCoverage: HdcCoverageResponse | undefined;
}

export function getLastCoverage() {
  return globalThis.__hdcPakchongLastCoverage;
}

export function setLastCoverage(coverage: HdcCoverageResponse) {
  globalThis.__hdcPakchongLastCoverage = coverage;
}
