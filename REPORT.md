# A REPORT ON
# RELAUNCHHER: AN AI-DRIVEN CAREER RE-ENTRY PLATFORM FOR WOMEN WITH MULTI-FACTOR INFERENCE AND MULTILINGUAL ACCESSIBILITY

**By**

**Name: Prateek Pulkit (AP23110011175)**  
**Name: Srinadh Yakasiri (AP23110011171)**  
**Name: Abhishek Das (AP23110011180)**

**Prepared in the partial fulfillment of the Project Based Learning of Course**  
**CSE 306 – Software Engineering and Project Management**

**SRM UNIVERSITY, AP**  
**April-May 2026**

---

## Acknowledgements

The successful completion of this project, **ReLaunchHer**, would not have been possible without the support and guidance of several individuals. I am deeply indebted to the following for their contribution to this work.

Firstly, I would like to express my sincere gratitude to the **Vice Chancellor and Dean** of SRM University, AP, for providing a world-class environment and resources for this project. Their vision in integrating Project-Based Learning into the curriculum has been a driving force behind our practical development.

My deepest thanks go to my **Industry Mentor**, whose professional insights and real-world feedback helped shape the ReLaunchHer platform into a viable career ecosystem. Their perspective on the current hiring market was invaluable in tuning the algorithmic scoring mechanisms.

I am profoundly grateful to **DR. [Insert Faculty Name]**, Faculty Mentor at SRM University, AP, for their constant guidance, technical critiques, and encouragement throughout the semester. Their expertise in Software Engineering principles ensured that this project met high academic and professional standards.

Finally, I would like to thank my teammates and family for their unwavering support during the development of this project.

---

## CERTIFICATE

This is to certify that the project entitled **"ReLaunchHer: An AI-Driven Career Re-Entry Platform for Women"** has been successfully completed by **Prateek Pulkit (AP23110011175), Srinadh Yakasiri (AP23110011171), and Abhishek Das (AP23110011180)** as a required academic component of the course **CSE 306: Software Engineering and Project Management** during Semester 6 of Academic Year 2025-26 in the Department of Computer Science and Engineering at SRM University, AP. This work was executed under the guidance of the undersigned and is deemed to have successfully met all course requirements as of May 2026.

**Signature of the Course Instructor**

**DR. [Insert Name]**  
**[Instructor's Designation]**  
**Department of Computer Science and Engineering**  
**SRM University, AP**

---

## Abstract

**ReLaunchHer V1.0** is a comprehensive, multi-layered ecosystem designed to address the socio-economic challenge of career re-entry for women after professional breaks. In the current employment landscape, "career gaps" are often treated as liabilities, leading to an "Invisibility Crisis" where talented women are filtered out by rigid recruitment algorithms. This project proposes a **Weighted Multi-Factor Inference Engine** that quantifies professional potential by analyzing non-linear career trajectories, upskilling efforts, and life-skills developed during breaks.

Built with Node.js and SQLite, the platform follows an **Iterative Enhancement Model** of the SDLC. It features a high-fidelity, multilingual user interface supporting seven major Indian languages, ensuring inclusivity. The core innovation lies in the automated generation of 30/60/90-day personalized roadmaps that transform career anxiety into structured action. This report documents the complete engineering lifecycle—from SRS and feasibility analysis to UML modeling and algorithm complexity—demonstrating a robust solution for a high-impact social problem. The abstract serves as a concise summary of the entire project, allowing readers to quickly grasp the scope, methodology, and primary outcomes of the ReLaunchHer platform.

---

## Table of Contents

1. **Introduction** ................................................................................................... 5
2. **Background Study & Literature Survey** .............................................................. 7
3. **Problem Statement & Feasibility Analysis** ........................................................... 9
4. **Proposed System Architecture** ........................................................................... 11
5. **Software Requirements Specification (SRS)** ........................................................ 13
6. **Algorithms and Core Logic Modules** ................................................................. 15
7. **System Design and UML Modeling** ..................................................................... 18
8. **Implementation & Project Management** ............................................................ 21
9. **Testing and Quality Assurance** .......................................................................... 23
10. **Result / Output** ................................................................................................ 25
11. **Conclusions and Future Scope** ......................................................................... 27
12. **References** ...................................................................................................... 29

---

## 1. Introduction

### 1.1 Project Overview
ReLaunchHer is an AI-driven ecosystem designed to solve the systemic barriers women face when returning to the workforce. Career breaks, often necessitated by childcare, elderly care, or personal health, frequently lead to a "career cliff" rather than a temporary pause. ReLaunchHer acts as a digital career coach, utilizing data-driven inference to provide returnees with a clear, technical, and psychological roadmap back to professional success. The system is designed to be a bridge between the candidate's past experience and the modern requirements of the industry.

### 1.2 Motivation
The motivation for this project stems from the documented "Motherhood Penalty," where women's career trajectories are disproportionately affected by time away from work. In India, thousands of women with high-level technical expertise leave the workforce every year and find it nearly impossible to return due to algorithmic bias in standard job portals. ReLaunchHer aims to reclaim this lost economic potential by reframing the "gap" as a period of transition that can be managed through structured upskilling and confidence building. This project is a response to the need for a more empathetic and data-accurate recruitment pipeline.

### 1.3 SDLC Methodology
The project adopted the **Iterative Enhancement Model**. This allowed for:
- **Early Prototyping:** A basic version of the logic engine was built first to validate the scoring algorithm.
- **Refinement:** The UI was iterated upon based on feedback regarding accessibility and clarity.
- **Risk Mitigation:** Complex features like multilingual support were added in later iterations once the core authentication and dashboard modules were stable.
- **Continuous Integration:** Each feature was tested against user personas to ensure that the logic remained sound as new modules were added.

---

## 2. Background Study & Literature Survey

### 2.1 Existing Systems Analysis
Currently, the recruitment market is dominated by platforms like LinkedIn and Indeed. While these are excellent for continuous professional growth, they fail the "non-linear" user. Their search algorithms prioritize "Recent Experience," which automatically pushes returnees to the bottom of the list. Furthermore, corporate returnship programs (like those at Amazon or Google) are highly competitive and only reach a tiny fraction of the returning population. ReLaunchHer seeks to democratize this returnship logic.

### 2.2 Literature Review
Research by **Correll et al. (2007)** on the "Motherhood Penalty" provides the sociological foundation for this project, highlighting how the perception of "competence" drops when a gap appears on a resume. Technical research in **Decision Support Systems (DSS)** has shown that automated coaching tools can significantly reduce "Decision Fatigue" in career transitions. ReLaunchHer integrates these two domains—sociology and software engineering—to create a tailored solution that treats a career transition as a data optimization problem. The system architecture is inspired by the **Model-Based Reflex Agent** paradigm, where the system reacts to profile inputs with a predefined logic set.

---

## 3. Problem Statement & Feasibility Analysis

### 3.1 Detailed Problem Statement
The primary problem is the **"Algorithmic Invisibility"** of returnees in the standard hiring pipeline. This invisibility is caused by three core factors:
1. **Absence of transferable skill mapping:** Traditional systems don't recognize the "crisis management" or "multi-tasking" developed during a break.
2. **Lack of confidence-building mechanisms:** The psychological toll of a career break is often ignored.
3. **Language barriers:** Most career guidance is in English, excluding a large demographic of skilled women in India.

### 3.2 Feasibility Analysis
- **Technical Feasibility:** Using Node.js and SQLite ensures the system is lightweight and can be hosted on minimal infrastructure. The logic engine is built with ES6+ JavaScript, ensuring compatibility with all modern browsers.
- **Economic Feasibility:** The project uses open-source technologies, meaning there are zero licensing costs. The low compute requirement makes it extremely affordable to scale.
- **Operational Feasibility:** The system mirrors the existing flow of job applications but adds an assessment layer, making it intuitive for both returnees and recruiters to use.

---

## 4. Proposed System Architecture

### 4.1 System Overview
ReLaunchHer is a three-tier web application built on modularity. It uses a custom-built Logic Engine that evaluates profile dimensions to generate a "Readiness Index." The architecture is designed to be "offline-first" where possible, ensuring data privacy and speed.

### 4.2 Module Breakdown
1. **Module 1: Auth & Role Manager:** Secure, role-based login for Returnees, Mentors, and Recruiters.
2. **Module 2: Inference Engine:** Performs weighted multi-factor scoring of the user's background.
3. **Module 3: Roadmap Synthesizer:** Converts numerical scores into actionable 30/60/90-day sprints.
4. **Module 4: I18n Engine:** A localized translation layer supporting 7+ Indian languages.

---

## 5. Software Requirements Specification (SRS)

### 5.1 Functional Requirements (FR)
- **FR1:** The system shall support role-based dashboards.
- **FR2:** Users shall be able to take a 4-step Career Assessment.
- **FR3:** The system shall calculate a Readiness Score based on 13+ profile dimensions.
- **FR4:** Users shall receive a persistent, downloadable roadmap.
- **FR5:** Recruiters shall be able to view and manage applicants for "Returnship" roles.

### 5.2 Non-Functional Requirements (NFR)
- **NFR1: Performance:** Page load < 2 seconds.
- **NFR2: Security:** Hashed passwords and secure session management.
- **NFR3: Accessibility:** Compliance with WCAG standards and multilingual support.
- **NFR4: Reliability:** SQLite WAL mode ensures transactional integrity.

---

## 6. Algorithms and Core Logic Modules

### 6.1 Weighted Multi-Factor Scoring (Module 2)
**Theory:** The readiness index is calculated using a weighted sum approach where "Years of Experience" (20%), "Skill Match" (22%), and "Confidence Level" (12%) are primary factors. The "Break Penalty" is a non-linear decay function.

**Algorithm Steps:**
1. Collect profile inputs.
2. Calculate Base Score from experience.
3. Perform fuzzy matching on skills to find the match ratio.
4. Calculate the gap penalty using: `Penalty = (Months ^ 0.7) * 0.4`.
5. Apply the "Active Break" offset if the user was upskilling.
6. Sum all components and clamp the result between 10 and 98.

**Pseudocode:**
```javascript
FUNCTION ScoreProfile(profile, matchRatio):
    score = (profile.exp * 2.5) + (matchRatio * 22) + (profile.conf * 0.12)
    penalty = (profile.gapMonths ** 0.7) * 0.4
    IF profile.reason == "Upskilling": penalty *= 0.5
    RETURN CLAMP(score - penalty, 10, 98)
```

**Complexity Analysis:**
- **Time Complexity:** O(N) where N is the number of profile fields.
- **Space Complexity:** O(1).

---

## 7. System Design and UML Modeling

### 7.1 Data Flow Diagram (Level 1)
- **Inputs:** User Credentials, Profile Assessment Data, Job Details.
- **Processes:** Authentication, Scoring, Roadmap Generation, Job Matching.
- **Outputs:** Session Tokens, Readiness Scores, Action Plans, Applicant Lists.

### 7.2 Use Case Diagram
- **Actor Returnee:** Take Assessment, View Roadmap, Apply to Jobs.
- **Actor Mentor:** Accept Mentorship, Manage Mentees.
- **Actor Recruiter:** Post Job, View Applicants.

### 7.3 Class Diagram
The system uses a base `User` class which is inherited by `Returnee`, `Mentor`, and `Recruiter`. The `Returnee` has a one-to-one relationship with the `PlanEngine`.

---

## 8. Implementation & Project Management

### 8.1 Implementation Details
The project was built using the following stack:
- **Frontend:** HTML5, CSS3, Vanilla JS.
- **Backend:** Node.js with a custom HTTP server wrapper.
- **Database:** SQLite (Better-SQLite3) for local storage.
- **Styling:** Custom CSS design system implementing Glassmorphism for a modern aesthetic.

### 8.2 Project Management
- **Risk Management:** Mitigated data leakage risks by implementing server-side session validation.
- **Resource Allocation:** Parallelized the development of the UI and the Logic Engine to ensure timely completion.
- **Feasibility:** Confirmed that the system can run on a standard laptop (i3, 4GB RAM) without any lag.

---

## 9. Testing and Quality Assurance

### 9.1 Unit Testing
The `scoreProfile` function was tested with boundary values (e.g., 0 years exp, 240 months gap) to ensure the logic remained stable and didn't produce negative scores.

### 9.2 Integration Testing
The flow from "Registration" to "Assessment" to "Dashboard" was tested to ensure the User ID was correctly passed through the session and the DB operations were atomic.

### 9.3 System Testing
End-to-end testing of the multilingual engine was performed to ensure that switching languages didn't break the layout or the logic of the forms.

---

## 10. Result / Output

The principal outcomes as identified from the results of the ReLaunchHer project are as follows:
- **Quantified Readiness:** Every user now has a "Readiness Score" that translates their complex history into a professional metric.
- **Actionable Roadmaps:** Users receive a prioritized 3-month plan that reduces the "choice paralysis" of returning to work.
- **Inclusive UI:** The system successfully handles 7 different Indian languages without any text overflow or performance issues.

### 10.1 Output Screenshots
**Page 1: Onboarding and Accessibility**
- **Figure 1:** Landing Page (English) showing the premium design.
- **Figure 2:** Hindi Localization demonstrating the inclusive UI.

**Page 2: Core Platform Logic**
- **Figure 3:** Roadmap Generator showing the 30/60/90-day action plan.
- **Figure 4:** Personal Dashboard showing the "Win Tracker" and recent activity.

---

## 11. Conclusions and Future Scope

### 11.1 Conclusion
ReLaunchHer V1.0 successfully demonstrates that software engineering can solve complex social re-entry barriers. By quantifying potential and reframing career gaps, the platform transforms the daunting task of returning to work into a structured, achievable project. The modular design ensures that the system is both maintainable and scalable.

### 11.2 Future Scope
- **AI Interviewer:** Implementing real-time mock interview feedback.
- **Resume Parser:** Automated skill gap identification from PDF uploads.
- **Mobile App:** Native iOS/Android apps for better reach.

---

## 12. References

1. Correll, S. J., "Getting a Job: Is There a Motherhood Penalty?" *Amer. Jour. Soc.*, 112 (2007), pp. 1297-1338.
2. Pressman, R. S., *Software Engineering: A Practitioner's Approach* 8th edition, McGraw-Hill (2014).
3. iRelaunch Official Website, *www.irelaunch.com* (2026).
4. Node.js Documentation, *nodejs.org* (2026).
5. Better-SQLite3 Documentation, *WiseLibs GitHub* (2026).

---
**End of Report**