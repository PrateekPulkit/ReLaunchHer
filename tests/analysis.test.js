const test = require("node:test");
const assert = require("node:assert/strict");

const { analyzeProfile, personaLibrary } = require("../logic.js");

test("personas produce distinct readiness or gap profiles", () => {
  const returningMother = analyzeProfile(personaLibrary["returning-mother"]);
  const careerSwitcher = analyzeProfile(personaLibrary["career-switcher"]);
  const midCareer = analyzeProfile(personaLibrary["mid-career"]);

  assert.notDeepEqual(returningMother.missingSkills, careerSwitcher.missingSkills);
  assert.notDeepEqual(careerSwitcher.missingSkills, midCareer.missingSkills);
  assert.notEqual(returningMother.score, midCareer.score);
});

test("longer career breaks bias roadmap toward structured returnships", () => {
  const longBreak = analyzeProfile({
    previousRole: "Marketing Manager",
    yearsExperience: 5,
    careerBreakYears: 4,
    breakReason: "caregiving",
    targetRole: "Digital Marketing Lead",
    existingSkills: "campaign strategy, content marketing, communication",
    confidenceLevel: 4,
  });

  const shortBreak = analyzeProfile({
    previousRole: "Marketing Manager",
    yearsExperience: 5,
    careerBreakYears: 1,
    breakReason: "caregiving",
    targetRole: "Digital Marketing Lead",
    existingSkills: "campaign strategy, content marketing, communication",
    confidenceLevel: 4,
  });

  assert.match(longBreak.roadmap[2].items[2], /structured returnships/i);
  assert.match(shortBreak.roadmap[2].items[2], /direct hires/i);
});

test("caregiving profiles include supportive transferables and coach note", () => {
  const analysis = analyzeProfile(personaLibrary["returning-mother"]);

  assert.ok(analysis.transferableSkills.includes("Resilience"));
  assert.match(analysis.coachNote, /caregiving/i);
  assert.ok(analysis.interviewPrompts.length >= 3);
});
