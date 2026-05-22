import * as fs from "fs";
import { 
    Document, 
    Packer, 
    Paragraph, 
    TextRun, 
    HeadingLevel, 
    AlignmentType, 
    PageBreak
} from "docx";

/**
 * generate_docx.js - ULTRA MINIMALIST
 */

const team = [
    { name: "Prateek Pulkit", reg: "AP23110011175" },
    { name: "Srinadh Yakasiri", reg: "AP23110011171" },
    { name: "Abhishek Das", reg: "AP23110011180" }
];

const children = [];

const addHeading = (text) => {
    children.push(new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_2,
    }));
};

const addText = (text) => {
    children.push(new Paragraph({
        children: [new TextRun(text)],
    }));
};

const addBreak = () => children.push(new PageBreak());

// TITLE
children.push(new Paragraph({ text: "A REPORT ON", heading: HeadingLevel.TITLE }));
children.push(new Paragraph({ text: "RELAUNCHHER", heading: HeadingLevel.TITLE }));
team.forEach(m => addText(`${m.name} (${m.reg})`));

addBreak();

addHeading("Acknowledgements");
addText("The successful completion of this project, ReLaunchHer, was possible with the support of many. We thank the VC and Dean of SRM University, AP.");

addBreak();

addHeading("Certificate");
addText("This is to certify that the project ReLaunchHer has been completed by the team.");

addBreak();

addHeading("Abstract");
addText("ReLaunchHer is an AI-driven career re-entry platform for women.");

addBreak();

addHeading("1. Introduction");
addText("1.1 Project Overview");
addText("ReLaunchHer is an ecosystem for women returning to the workforce.");

addBreak();

addHeading("Conclusion");
addText("The project is a success.");

const doc = new Document({
    sections: [{
        children: children,
    }],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("report.docx", buffer);
    console.log("report.docx created successfully.");
});
