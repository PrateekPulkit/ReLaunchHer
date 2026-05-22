import db, { createUser, savePlan } from "./db.js";

console.log("🌸 Seeding database with demo data...");

try {
  // 1. Create Demo Recruiter
  const recruiter = createUser({
    id: "user-recruiter-1",
    name: "Elena Carter",
    email: "recruiter@techcorp.com",
    password: "password123",
    role: "recruiter",
    language: "en"
  });

  // 2. Create Demo Mentor
  const mentor = createUser({
    id: "user-mentor-1",
    name: "Dr. Asha Menon",
    email: "mentor@techcorp.com",
    password: "password123",
    role: "mentor",
    language: "en"
  });

  // 3. Create another Demo Returnee
  const returnee = createUser({
    id: "user-returnee-1",
    name: "Sarah Jenkins",
    email: "sarah@example.com",
    password: "password123",
    role: "returnee",
    language: "en"
  });

  // Add a sample plan for the returnee
  savePlan(returnee.id, {
    targetRole: "Software Engineer",
    previousRole: "QA Engineer"
  }, {
    role: "Software Engineer",
    readinessScore: 82,
    matchLabel: "Strong fit"
  });

  // 4. Create Tables for Jobs and Mentors (We will migrate from storage.js)
  // Let's create these tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS posted_jobs (
      id TEXT PRIMARY KEY,
      recruiter_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      type TEXT NOT NULL,
      mode TEXT NOT NULL,
      location TEXT NOT NULL,
      match_role TEXT NOT NULL,
      summary TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS mentor_profiles (
      id TEXT PRIMARY KEY,
      mentor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
      role_title TEXT NOT NULL,
      specialty TEXT NOT NULL
    );
  `);

  // Insert seed jobs
  db.prepare(`INSERT OR IGNORE INTO posted_jobs 
    (id, recruiter_id, title, company, type, mode, location, match_role, summary, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  .run(
    "job-seed-1", recruiter.id, "Software Engineer Returnship", "TechCorp", 
    "Returnship", "Hybrid", "San Francisco", "Software Engineer", 
    "12-week paid relaunch path with mentorship and onboarding support.", new Date().toISOString()
  );

  db.prepare(`INSERT OR IGNORE INTO posted_jobs 
    (id, recruiter_id, title, company, type, mode, location, match_role, summary, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  .run(
    "job-seed-2", recruiter.id, "Data Analyst Relaunch Program", "Insights Inc", 
    "Full-time", "Remote", "New York", "Data Analyst", 
    "Career restart track focused on analytics, dashboards, and business reporting.", new Date().toISOString()
  );

  // Insert seed mentor profile
  db.prepare(`INSERT OR IGNORE INTO mentor_profiles (id, mentor_id, role_title, specialty) VALUES (?, ?, ?, ?)`)
    .run("prof-mentor-1", mentor.id, "Career Mentor", "Confidence rebuilding and interview narratives");

  console.log("✅ Database seeded successfully!");
  console.log("Test Accounts:");
  console.log("  Recruiter: recruiter@techcorp.com / password123");
  console.log("  Mentor: mentor@techcorp.com / password123");
  console.log("  Returnee: sarah@example.com / password123");

} catch (err) {
  if (err.message.includes("UNIQUE constraint failed")) {
    console.log("⚠️ Database is already seeded. Using existing data.");
  } else {
    console.error("❌ Failed to seed database:", err);
  }
}
