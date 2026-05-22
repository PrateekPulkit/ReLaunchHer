import { 
    Document, 
    Packer, 
    Paragraph, 
    TextRun, 
    HeadingLevel, 
    AlignmentType, 
    PageBreak, 
    ImageRun, 
    Header, 
    Footer,
    InternalHyperlink,
    Bookmark,
    ExternalHyperlink
} from "docx";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const INPUT_FILE = "Records.md";
const OUTPUT_FILE = "Records.docx";
const TEMP_DIR = "temp_diagrams";

// Ensure temp dir exists
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

function parseMarkdown(content) {
    const lines = content.split("\n");
    const sections = [];
    let currentText = "";
    let inMermaid = false;
    let mermaidCode = "";
    let mermaidCount = 0;

    for (let line of lines) {
        if (line.trim().startsWith("```mermaid")) {
            if (currentText.trim()) {
                sections.push({ type: "text", content: currentText.trim() });
                currentText = "";
            }
            inMermaid = true;
            mermaidCode = "";
            continue;
        }

        if (line.trim().startsWith("```") && inMermaid) {
            inMermaid = false;
            mermaidCount++;
            const fileName = `diagram_${mermaidCount}.png`;
            const filePath = path.join(TEMP_DIR, fileName);
            const mmFile = path.join(TEMP_DIR, `diagram_${mermaidCount}.mmd`);
            
            fs.writeFileSync(mmFile, mermaidCode);
            
            console.log(`Generating diagram ${mermaidCount}...`);
            try {
                // Remove existing file if any
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                
                execSync(`npx -y mmdc -i ${mmFile} -o ${filePath} -t forest -b transparent -w 1200`, { stdio: 'inherit' });
                
                if (fs.existsSync(filePath)) {
                    sections.push({ type: "image", path: filePath });
                } else {
                    sections.push({ type: "text", content: `[Error: Diagram ${mermaidCount} file not created]` });
                }
            } catch (e) {
                console.error(`Failed to generate diagram ${mermaidCount}`);
                sections.push({ type: "text", content: `[Diagram Placeholder: ${mermaidCount}]` });
            }
            continue;
        }

        if (inMermaid) {
            mermaidCode += line + "\n";
        } else {
            currentText += line + "\n";
        }
    }

    if (currentText.trim()) {
        sections.push({ type: "text", content: currentText.trim() });
    }

    return sections;
}

async function generate() {
    console.log("Reading Records.md...");
    const mdContent = fs.readFileSync(INPUT_FILE, "utf-8");
    const sections = parseMarkdown(mdContent);

    const docChildren = [];

    // Title Page
    docChildren.push(new Paragraph({ text: "", spacing: { before: 1000 } }));
    docChildren.push(new Paragraph({ 
        text: "LAB RECORD", 
        heading: HeadingLevel.TITLE, 
        alignment: AlignmentType.CENTER 
    }));
    docChildren.push(new Paragraph({ 
        text: "SYSTEM DESIGN & ANALYSIS", 
        heading: HeadingLevel.HEADING_1, 
        alignment: AlignmentType.CENTER 
    }));
    docChildren.push(new Paragraph({ text: "", spacing: { before: 1000 } }));
    docChildren.push(new Paragraph({ 
        text: "Project: ReLaunchHer Platform", 
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_2
    }));
    docChildren.push(new Paragraph({ 
        text: "May 2026", 
        alignment: AlignmentType.CENTER 
    }));
    docChildren.push(new PageBreak());

    // Content
    for (const section of sections) {
        if (section.type === "text") {
            const lines = section.content.split("\n");
            for (let line of lines) {
                line = line.trim();
                if (!line) continue;

                if (line.startsWith("## ")) {
                    docChildren.push(new Paragraph({
                        text: line.replace("## ", ""),
                        heading: HeadingLevel.HEADING_2,
                    }));
                } else if (line.startsWith("### ")) {
                    docChildren.push(new Paragraph({
                        text: line.replace("### ", ""),
                        heading: HeadingLevel.HEADING_3,
                    }));
                } else if (line.startsWith("- ")) {
                    docChildren.push(new Paragraph({
                        text: line.replace("- ", ""),
                        bullet: { level: 0 },
                    }));
                } else {
                    docChildren.push(new Paragraph({
                        text: line,
                        alignment: AlignmentType.JUSTIFY,
                    }));
                }
            }
        } else if (section.type === "image") {
            try {
                const imageData = fs.readFileSync(section.path);
                docChildren.push(new Paragraph({
                    children: [
                        new ImageRun({
                            data: imageData,
                            transformation: { width: 500, height: 300 }, 
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 200, after: 200 }
                }));
            } catch (e) {
                docChildren.push(new Paragraph({ text: `[Error loading image: ${section.path}]` }));
            }
        }
    }

    const doc = new Document({
        creator: "ReLaunchHer Team",
        title: "Lab Record: System Design & Analysis",
        styles: {
            paragraphStyles: [
                {
                    id: "Normal",
                    name: "Normal",
                    run: {
                        font: "Times New Roman",
                        size: 24, // 12pt
                    },
                    paragraph: {
                        spacing: { line: 360, before: 120, after: 120 }, // 1.5 line spacing
                    },
                },
            ],
        },
        sections: [{
            children: docChildren,
        }],
    });

    console.log("Packing document...");
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(OUTPUT_FILE, buffer);
    console.log(`✅ Success! ${OUTPUT_FILE} generated.`);
}

generate().catch(console.error);
