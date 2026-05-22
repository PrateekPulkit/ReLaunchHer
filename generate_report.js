import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  PageBreak,
  ImageRun
} from "docx";
import * as fs from "fs";
import * as path from "path";

const SCREENSHOT_DIR = "screenshots";

function getScreenshot(pattern) {
  try {
    const files = fs.readdirSync(SCREENSHOT_DIR);
    const match = files.find(f => f.toLowerCase().includes(pattern.toLowerCase()));
    return match ? path.join(SCREENSHOT_DIR, match) : null;
  } catch (e) {
    return null;
  }
}

// ─────────────────────────────────────────────
// PRE-READ ALL IMAGES
// ─────────────────────────────────────────────
const images = {};
const keys = ["landing", "hindi", "login", "register", "planner_step1", "planner_results", "dashboard", "opportunities"];
keys.forEach(k => {
  const p = getScreenshot(k);
  if (p && fs.existsSync(p)) {
    images[k] = fs.readFileSync(p);
  }
});

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      new Paragraph({ text: "PROJECT REPORT", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
      new Paragraph({ text: "RELAUNCHHER: AI CAREER PLATFORM", alignment: AlignmentType.CENTER }),
      new Paragraph({ text: "", spacing: { before: 400, after: 400 } }),
      new Paragraph({ text: "Submitted for: Software Engineering & Project Management", alignment: AlignmentType.CENTER }),
      new PageBreak(),

      new Paragraph({ text: "1. Abstract", heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: "ReLaunchHer is an AI-driven platform for women returning to work. It uses a weighted scoring model to analyze career gaps and provide structured roadmaps. The platform supports 7 languages and provides a momentum-based dashboard for tracking progress." }),
      new PageBreak(),

      new Paragraph({ text: "2. Introduction", heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: "Career breaks for women are often penalized in the workforce. This project seeks to bridge that gap by using algorithmic inference to quantify potential and provide clear, actionable steps for a professional comeback." }),
      new PageBreak(),

      new Paragraph({ text: "3. Problem Statement", heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: "The primary challenge is the loss of professional confidence and the algorithmic bias against career gaps. ReLaunchHer addresses this by reframing gaps as periods of transferable strength development." }),
      new PageBreak(),

      new Paragraph({ text: "4. Objectives", heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: "1. Quantify readiness using a multi-factor model.", bullet: { level: 0 } }),
      new Paragraph({ text: "2. Generate 30/60/90 day roadmaps.", bullet: { level: 0 } }),
      new Paragraph({ text: "3. Provide multilingual support for accessibility.", bullet: { level: 0 } }),
      new PageBreak(),

      new Paragraph({ text: "5. Proposed System", heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: "A Node.js and SQLite powered platform that evaluates profile data through a logic engine to generate personalized career trajectories." }),
      new PageBreak(),

      new Paragraph({ text: "6. Methodology", heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: "Data is collected via a multi-step planner, processed through a weighted algorithm, and stored securely. Results are delivered via a momentum-tracking dashboard." }),
      new PageBreak(),

      new Paragraph({ text: "7. Implementation", heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: "Built with Vanilla JS, custom CSS glassmorphism, and a Node.js backend. Features a custom i18n engine for 7-language support." }),
      new PageBreak(),

      new Paragraph({ text: "8. Screenshots", heading: HeadingLevel.HEADING_1 }),
      
      ...(Object.entries(images).map(([key, data], i) => {
        return [
          new Paragraph({ text: `Figure ${i + 1}: ${key.toUpperCase()}`, alignment: AlignmentType.CENTER }),
          new Paragraph({
            children: [
              new ImageRun({
                data: data,
                transformation: { width: 400, height: 250 }
              })
            ],
            alignment: AlignmentType.CENTER
          }),
          new PageBreak()
        ];
      }).flat()),

      new Paragraph({ text: "9. Conclusion", heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: "ReLaunchHer is a proof-of-concept that demonstrates how technology can solve social re-entry barriers for women globally." }),
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("report.docx", buffer);
  console.log("✅ Minimalist Report generated successfully: report.docx");
});
