# Lab Record: System Design & Analysis
**Target Project Phase:** ReLaunchHer Platform (V1.2)
**Date:** May 2026

---

## 1. Software Requirements Specification (SRS)

**1.1 Purpose:** 
The ReLaunchHer platform is a web-based ecosystem designed to assist women in returning to the workforce after a career break. It provides tools for career planning, mentorship matching, and returnship job discovery.

**1.2 Scope:** 
The application acts as a bridge between candidates (Returnees), industry guides (Mentors), and hiring managers (Recruiters). Key functions include generating personalized re-entry roadmaps via a model-based planner algorithm, maintaining user-specific progress checklists, applying for jobs, and managing mentorship requests.

**1.3 Functional Requirements:**
- **FR1 (Authentication):** The system shall allow users to register and log in under three distinct roles: Returnee, Mentor, Recruiter with secure password hashing.
- **FR2 (Profile Assessment):** Returnees shall be able to submit a 4-step dynamic form detailing their career background, previous experience, and career break reasons.
- **FR3 (Weighted Inference):** The system shall execute a multi-factor weighted algorithm to calculate a Readiness Score (10-98) based on skills, experience, and break duration.
- **FR4 (Dynamic Roadmap):** The system shall generate a personalized 30/60/90-day roadmap with specific weekly sprints based on the user's top blockers.
- **FR5 (Multilingual UI):** The system shall support real-time language switching across 7+ Indian languages (Hindi, Telugu, Tamil, etc.) using a custom i18n engine.
- **FR6 (Job Board):** Recruiters shall be able to post "Returnship" opportunities and manage applicants through a dedicated dashboard.
- **FR7 (Mentorship):** Mentors shall be able to set availability and approve/reject mentorship requests from returnees.
- **FR8 (Progress Tracking):** Returnees shall have a "Momentum Dashboard" that tracks their completion status of roadmap milestones.
- **FR9 (Skill Gap Analysis):** The system shall identify specific missing skills for a target role and suggest relevant courses/certifications.
- **FR10 (Secure Storage):** All profile and plan data shall be stored in a local SQLite database for privacy-first persistence.

**1.4 Non-Functional Requirements:**
- **Performance:** All core dashboard pages must render in under 1.5 seconds.
- **Security:** User sessions must be managed through server-side encrypted cookies; passwords must be stored using industry-standard hashing (bcrypt).
- **Usability:** The interface must maintain a 90+ accessibility score, using ARIA labels and high-contrast glassmorphism.
- **Reliability:** The system must handle database locks gracefully using the WAL (Write-Ahead Logging) mode in SQLite.

---

## 2. DFD Model (Data Flow Diagram)

### 2.1 Level-0 DFD (Context Diagram)

```mermaid
graph TD
    classDef returnee fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef recruiter fill:#f3e5f5,stroke:#4a148c,stroke-width:2px;
    classDef mentor fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px;
    classDef system fill:#fff3e0,stroke:#e65100,stroke-width:4px,stroke-dasharray: 5 5;

    RET[Returnee]:::returnee -->|Profile Data, Action Logs| SYS((ReLaunchHer System)):::system
    SYS -->|Generated Plans, Job List| RET
    
    REC[Recruiter]:::recruiter -->|Job Posts| SYS
    SYS -->|Applicant Data| REC
    
    MEN[Mentor]:::mentor -->|Guidance Availability| SYS
    SYS -->|Mentorship Requests| MEN
```

### 2.2 Level-1 DFD

```mermaid
graph TD
    classDef process fill:#fff9c4,stroke:#fbc02d,stroke-width:2px;
    classDef store fill:#f5f5f5,stroke:#616161,stroke-width:2px;
    classDef entity fill:#e1f5fe,stroke:#01579b,stroke-width:2px;

    RET[Returnee]:::entity -->|Credentials| P1(1.0 Auth System):::process
    P1 -->|Session Token| DB[(User DB)]:::store
    
    RET -->|Profile Factors| P2(2.0 Plan Engine):::process
    P2 -->|Plan JSON| DB
    DB -->|Dashboard Updates| P3(3.0 Activity Tracker):::process
    P3 -->|Win/Loss Progress| RET
    
    REC[Recruiter]:::entity -->|Job Details| P4(4.0 Opportunities System):::process
    P4 -->|Job Match| RET
    DB -->|Candidate Match| P4
```

### 2.3 Data Dictionary
- `User`: `{id: string, name: string, email: string, role: string, created_at: Date}`
- `PlanNode`: `{targetRole: string, matchPercent: int, readinessScore: int, weeklySprint: Array<String>}`
- `JobPost`: `{id: string, recruiterId: string, title: string, company: string, location: string, matchRole: string}`

---

## 3. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o| PLAN : "generates"
    USER ||--o{ JOB_APPLICATION : "submits"
    RECRUITER ||--o{ JOB : "posts"
    JOB ||--o{ JOB_APPLICATION : "receives"
    MENTOR ||--o{ MENTORSHIP_REQUEST : "manages"
    RETURNEE ||--o{ MENTORSHIP_REQUEST : "requests"

    USER {
        string id PK
        string name
        string email
        string password_hash
        string role "Returnee | Mentor | Recruiter"
    }
    PLAN {
        int id PK
        string userId FK
        int readinessScore
        string roadmap_json
        string targetRole
    }
    JOB {
        int id PK
        string recruiterId FK
        string title
        string company
        string location
    }
    JOB_APPLICATION {
        int id PK
        int jobId FK
        string userId FK
        string status
    }
```

---

## 4. System Architecture: Component Diagram

```mermaid
graph LR
    classDef comp fill:#e0f7fa,stroke:#006064,stroke-width:2px;
    
    subgraph Client_Browser
        UI[UI Components - HTML/CSS]:::comp
        Logic[Frontend Logic - JS]:::comp
        I18n[i18n Engine]:::comp
    end

    subgraph Server_NodeJS
        Router[API Router]:::comp
        Auth[Auth Middleware]:::comp
        Engine[Inference Engine - logic.js]:::comp
    end

    subgraph Database_Layer
        SQLite[(SQLite DB)]:::comp
    end

    UI <--> Router
    Logic --> Engine
    Router --> Auth
    Auth --> SQLite
    Engine --> SQLite
    UI --> I18n
```

---

## 5. Deployment Diagram

```mermaid
graph TD
    classDef device fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef server fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef db fill:#f5f5f5,stroke:#616161,stroke-width:2px;

    subgraph User_Device [User Device - Laptop/Mobile]
        Browser[Web Browser - Chrome/Firefox]:::device
        SPA[ReLaunchHer SPA]:::device
    end

    subgraph App_Server [Application Server - Node.js]
        ServerJS[server.js]:::server
        LogicJS[logic.js]:::server
        DB[(relaunchher.db - SQLite)]:::db
    end

    Browser -- "HTTPS / JSON API" --> ServerJS
    ServerJS --> LogicJS
    LogicJS --> DB
```

---

## 6. Functional Design: Structured Chart

```mermaid
graph TD
    classDef root fill:#ffccbc,stroke:#e64a19,stroke-width:3px;
    classDef module fill:#c8e6c9,stroke:#388e3c,stroke-width:2px;

    Main[ReLaunchHer Core Controller]:::root
    
    Main --> Auth[Authentication Module]:::module
    Main --> Planner[Planner Inference Engine]:::module
    Main --> Ops[Opportunities Board]:::module
    
    Auth --> Reg[Register Function]
    Auth --> Log[Login Session]
    
    Planner --> Score[scoreProfile Algorithm]
    Planner --> Gen[genRoadmap Builder]
    
    Ops --> ViewJobs[Job Listing Fetch]
    Ops --> Apply[Job Application Engine]
```

---

## 7. User View Analysis (Use Case Diagram)

```mermaid
flowchart LR
    classDef actor fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef uc fill:#f3e5f5,stroke:#4a148c,stroke-width:2px;

    Ret((Returnee)):::actor
    Men((Mentor)):::actor
    Rec((Recruiter)):::actor
    
    subgraph ReLaunchHer Platform 
    UC1(Take Profile Assessment):::uc
    UC2(View Custom Dashboard):::uc
    UC3(Apply to Job):::uc
    UC4(Accept Mentorship Request):::uc
    UC5(Post Returnship Job):::uc
    UC6(Switch UI Language):::uc
    end
    
    Ret --> UC1
    Ret --> UC2
    Ret --> UC3
    Ret --> UC6
    
    Men --> UC4
    Rec --> UC5
```

---

## 8. Use Case Scenarios

**Use Case:** `Take Profile Assessment` (Generate Career Plan)
- **Primary Actor:** Returnee
- **Preconditions:** Returnee is logged into the system and has an empty dashboard.
- **Main Success Scenario:**
  1. Returnee navigates to the "Career Planner" module.
  2. The system presents a 4-step wizard.
  3. The returnee fills in their targeted role, previous experience, reasons for career break, and primary blockers.
  4. The system calculates empirical readiness metrics (Score out of 100).
  5. The system saves the Plan object to the SQLite Database.
  6. The returnee is redirected to the Dashboard where personalized sprints are displayed.
- **Alternative Paths:**
  - *Invalid Data:* If required fields are skipped, HTML native validation kicks in before API submission, alerting the user to fix the data.

---

## 9. Structural View: Class Diagram

```mermaid
classDiagram
    class User {
        +String id
        +String name
        +String email
        +String role
        +login()
        +logout()
    }
    
    class Returnee {
        +int readinessScore
        +completePlanner()
        +requestMentorship()
        +applyToJob()
    }
    
    class Mentor {
        +String expertise
        +acceptRequest()
        +manageMentees()
    }
    
    class PlanEngine {
        +float baseWeights
        +analyzeProfile(data)
        +calculateScore() : int
    }
    
    class Job {
        +String title
        +String company
        +saveJob()
    }

    User <|-- Returnee
    User <|-- Mentor
    Returnee "1" --> "1" PlanEngine : Generates
    Returnee "1" --> "*" Job : Applies
    
    style User fill:#e1f5fe,stroke:#01579b
    style Returnee fill:#e1f5fe,stroke:#01579b
    style Mentor fill:#e8f5e9,stroke:#1b5e20
    style PlanEngine fill:#fff3e0,stroke:#e65100
```

---

## 10. Structural View: Object Diagram

*This represents a specific point in time snapshot of the system.*

```mermaid
graph TD
    classDef obj fill:#fff9c4,stroke:#fbc02d,stroke-width:2px;

    UserObj[<u>Sarah : Returnee</u><br/>email='sarah@example.com']:::obj
    PlanObj[<u>Plan1 : PlanEngine</u><br/>role='Software Engineer'<br/>readinessScore=82]:::obj
    JobObj[<u>Job101 : Job</u><br/>title='Returnship Dev'<br/>company='TechCorp']:::obj

    UserObj -->|Owns| PlanObj
    UserObj -->|Applied To| JobObj
```

---

## 11. Behavioral View: Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant R as Returnee
    participant C as UI Controller (planner.js)
    participant L as Logic Engine (logic.js)
    participant API as Server (server.js)
    participant DB as SQLite Database
    
    Note over R,DB: Planner Submission Flow
    
    R->>C: Clicks 'Generate Plan'
    C->>L: getProfile() Data
    L->>L: scoreProfile(weighted_factors)
    L-->>C: Returns Computed Analysis Object
    C->>API: POST /api/plan (JSON)
    API->>DB: INSERT INTO plans
    DB-->>API: ACK 200 OK
    API-->>C: Success Response
    C->>R: Update UI & Redirect to Dashboard
```

---

## 12. Activity Diagram

**Scenario:** The overall user flow from landing on the platform.

```mermaid
stateDiagram-v2
    state if_state <<choice>>
    
    [*] --> LandingPage
    LandingPage --> CheckSession
    
    CheckSession --> if_state
    
    if_state --> Register : Not Logged In
    if_state --> Dashboard : Logged In
    
    Register --> TakeAssessment
    TakeAssessment --> ComputeEngine
    ComputeEngine --> SaveToDB
    SaveToDB --> Dashboard
    
    Dashboard --> [*]
```

---

## 13. Behavioral View: State Chart Diagram

**Scenario:** The lifecycle states of a Job Application in the ReLaunchHer system.

```mermaid
stateDiagram-v2
    [*] --> Discovered : Returnee Views Job
    
    Discovered --> Saved : Clicks ☆ Save
    Discovered --> Applied : Clicks Apply
    Saved --> Applied : Clicks Apply from Saved List
    
    Applied --> UnderReview : Recruiter dashboard sync
    UnderReview --> AcceptedForInterview
    UnderReview --> FastTrackBootcamp
    
    AcceptedForInterview --> [*]
    FastTrackBootcamp --> [*]
```

---

## 14. Technical Deep-Dive: Weighted Scoring Algorithm

The core of ReLaunchHer is the **Weighted Multi-Factor Scoring Model** located in `logic.js`. Unlike traditional systems that penalize gaps linearly, our model uses a non-linear decay function with mitigation factors.

### 14.1 Algorithm Logic:
1.  **Experience Depth (Max 20 pts):** `Score = clamp(years * 2.5, 0, 20)`.
2.  **Non-Linear Gap Penalty:** Penalty increases with time but is mitigated by the *Reason Category*. 
    - If reason is "Education" or "Entrepreneurship", penalty is reduced by 40%.
    - If "Skill Currency" is "Current", penalty is reduced by 60%.
3.  **Skill Match (Max 22 pts):** Direct comparison between user skills and Role Catalog requirements.
4.  **Soft Skill Multipliers:** Leadership experience and Networking activity provide bonus points (up to 14 pts).
5.  **Final Normalization:** All components are summed and clamped between 10 (Beginner) and 98 (Ready).

---

## 15. Testing & Quality Assurance

### 15.1 Unit Testing
Automated tests in `tests/analysis.test.js` verify the scoring engine:
- **Test Case 1:** User with 5 years exp + 2 year break (Target Score: ~75-80).
- **Test Case 2:** User with 0 years exp + 10 year break (Target Score: ~20-25).
- **Test Case 3:** Career switcher with high transferable skills.

### 15.2 Integration Testing
Verified the flow from `planner.html` -> `server.js` -> `relaunchher.db` ensuring no data loss during JSON serialization.

---

## 16. Conclusion
The ReLaunchHer platform successfully demonstrates a robust application of Software Engineering principles to solve the career re-entry crisis. By modularizing the design and using data-driven inference, we provide a scalable solution for women globally.
