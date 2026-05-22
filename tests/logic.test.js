import test from "node:test";
import assert from "node:assert/strict";

import { analyzeProfile, samplePersonas } from "../logic.js";

test("personas produce distinct readiness scores", () => {
  const scores = samplePersonas.map((persona) => analyzeProfile(persona).readinessScore);
  assert.equal(new Set(scores).size, samplePersonas.length);
});

test("analysis includes dynamic dashboard and planner data", () => {
  const result = analyzeProfile(samplePersonas[0]);

  assert.equal(result.roadmap.length, 3);
  assert.equal(result.weeklySprint.length, 5);
  assert.equal(result.learningPlan.length >= 5, true);
  assert.equal(typeof result.narrativeSummary, "string");
  assert.equal(typeof result.nextMilestone, "string");
});

test("transferable strengths include reason-based and role-based signals", () => {
  const result = analyzeProfile(samplePersonas[1]);
  assert.ok(result.transferables.includes("empathy under pressure"));
  assert.ok(result.transferables.includes("experience from marketing specialist"));
});

test("different targets produce different missing skills and labels", () => {
  const engineerPlan = analyzeProfile(samplePersonas[0]);
  const analystPlan = analyzeProfile(samplePersonas[2]);

  assert.notDeepEqual(engineerPlan.missingSkills, analystPlan.missingSkills);
  assert.notEqual(engineerPlan.role, analystPlan.role);
  assert.ok(engineerPlan.matchLabel.length > 0);
  assert.ok(analystPlan.matchLabel.length > 0);
});
