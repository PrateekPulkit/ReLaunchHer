import { loadUiState, saveUiState } from "./storage.js";

export const languages = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { id: "te", label: "తెలుగు", flag: "🇮🇳" },
  { id: "ml", label: "മലയാളം", flag: "🇮🇳" },
  { id: "ta", label: "தமிழ்", flag: "🇮🇳" },
  { id: "or", label: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { id: "bn", label: "বাংলা", flag: "🇮🇳" },
];


const translations = {
  en: {
    "nav.home": "Home",
    "nav.planner": "Planner",
    "nav.dashboard": "Dashboard",
    "nav.personas": "Personas",
    "nav.opportunities": "Opportunities",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.logout": "Logout",
    "nav.openDashboard": "Open dashboard",
    "roles.returnee": "Returnee",
    "roles.mentor": "Mentor",
    "roles.recruiter": "Recruiter",
    "home.eyebrow": "AI / ML for women empowerment",
    "home.title": "A smarter re-entry platform for women returning to work.",
    "home.lead": "Clear guidance. Role-ready plans. Mentor support. Opportunity discovery.",
    "home.ctaPrimary": "Start planning",
    "home.ctaSecondary": "Explore opportunities",
    "home.feature1Title": "Simple journey",
    "home.feature1Text": "Plan, practice, apply, and track progress in one place.",
    "home.feature2Title": "Made for confidence",
    "home.feature2Text": "Short steps, clear cards, and supportive language.",
    "home.feature3Title": "Role-based platform",
    "home.feature3Text": "Returnees, mentors, and recruiters each get a focused workspace.",
    "auth.loginTitle": "Welcome back",
    "auth.loginLead": "Log in to continue your job re-entry journey.",
    "auth.registerTitle": "Create your account",
    "auth.registerLead": "Choose your role and start using the platform.",
    "auth.name": "Full name",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.role": "Role",
    "auth.language": "Language",
    "auth.loginButton": "Login",
    "auth.registerButton": "Register",
    "auth.invalidCredentials": "Incorrect email or password.",
    "auth.emailExists": "An account with this email already exists.",
    "auth.toRegister": "Need an account? Register",
    "auth.toLogin": "Already have an account? Login",
    "planner.title": "Build your comeback plan",
    "planner.lead": "Short steps. Clear outputs. Saved to your dashboard.",
    "planner.step1": "Background",
    "planner.step2": "Direction",
    "planner.step3": "Confidence",
    "planner.previousRole": "Previous role",
    "planner.yearsExperience": "Years of experience",
    "planner.breakYears": "Career break (years)",
    "planner.reason": "Reason category",
    "planner.targetRole": "Target role",
    "planner.skills": "Existing skills",
    "planner.confidence": "Confidence level",
    "planner.back": "Back",
    "planner.next": "Next",
    "planner.generate": "Generate plan",
    "planner.saved": "Saved to dashboard.",
    "dashboard.emptyTitle": "Create a plan to unlock your dashboard.",
    "dashboard.emptyLead": "Your saved roadmap, notes, jobs, and progress will appear here.",
    "dashboard.checklist": "Momentum checklist",
    "dashboard.notes": "Career notes",
    "dashboard.wins": "Wins tracker",
    "dashboard.addWin": "Add win",
    "dashboard.interview": "Interview practice",
    "dashboard.nextMilestone": "Next milestone",
    "dashboard.savedJobs": "Saved jobs",
    "dashboard.appliedJobs": "Applied jobs",
    "opps.title": "Jobs, mentors, and learning",
    "opps.lead": "Find the next right step for your re-entry journey.",
    "opps.filterAll": "All",
    "opps.filterJobs": "Jobs",
    "opps.filterMentors": "Mentors",
    "opps.filterLearning": "Learning",
    "opps.save": "Save",
    "opps.saved": "Saved",
    "opps.apply": "Apply",
    "opps.applied": "Applied",
    "opps.requestMentor": "Request mentor",
    "opps.postJob": "Post opening",
    "personas.title": "Persona-driven demo mode",
    "personas.lead": "Show how the platform adapts to different comeback journeys.",
    "common.quickDemo": "Quick demo personas",
    "common.language": "Language",
    "common.profile": "Profile",
    "common.savedAt": "Saved",
    "common.noData": "No data yet",
    "common.clear": "Clear",
  },
  hi: {
    "nav.home": "होम", "nav.planner": "प्लानर", "nav.dashboard": "डैशबोर्ड", "nav.personas": "पर्सोना", "nav.opportunities": "अवसर", "nav.login": "लॉगिन", "nav.register": "रजिस्टर", "nav.logout": "लॉगआउट", "nav.openDashboard": "डैशबोर्ड खोलें", "roles.returnee": "वापसी उम्मीदवार", "roles.mentor": "मेंटोर", "roles.recruiter": "रिक्रूटर", "home.eyebrow": "महिला सशक्तिकरण के लिए AI / ML", "home.title": "काम पर लौटने वाली महिलाओं के लिए स्मार्ट री-एंट्री प्लेटफॉर्म।", "home.lead": "स्पष्ट मार्गदर्शन। तैयार योजना। मेंटर सहायता। अवसर खोज।", "home.ctaPrimary": "प्लान शुरू करें", "home.ctaSecondary": "अवसर देखें", "home.feature1Title": "सरल यात्रा", "home.feature1Text": "योजना, अभ्यास, आवेदन और प्रगति ट्रैकिंग एक ही जगह।", "home.feature2Title": "आत्मविश्वास के लिए", "home.feature2Text": "छोटे कदम, साफ कार्ड और सहायक भाषा।", "home.feature3Title": "रोल-आधारित प्लेटफॉर्म", "home.feature3Text": "हर भूमिका के लिए अलग कार्यक्षेत्र।", "auth.loginTitle": "फिर से स्वागत है", "auth.loginLead": "अपनी जॉब री-एंट्री यात्रा जारी रखने के लिए लॉगिन करें।", "auth.registerTitle": "अपना अकाउंट बनाएं", "auth.registerLead": "अपनी भूमिका चुनें और प्लेटफॉर्म शुरू करें।", "auth.name": "पूरा नाम", "auth.email": "ईमेल", "auth.password": "पासवर्ड", "auth.role": "भूमिका", "auth.language": "भाषा", "auth.loginButton": "लॉगिन", "auth.registerButton": "रजिस्टर", "auth.invalidCredentials": "ईमेल या पासवर्ड गलत है।", "auth.emailExists": "इस ईमेल से अकाउंट पहले से मौजूद है।", "auth.toRegister": "अकाउंट नहीं है? रजिस्टर करें", "auth.toLogin": "पहले से अकाउंट है? लॉगिन करें", "planner.title": "अपनी वापसी योजना बनाएं", "planner.lead": "छोटे कदम। स्पष्ट परिणाम। डैशबोर्ड में सेव।", "planner.step1": "पृष्ठभूमि", "planner.step2": "दिशा", "planner.step3": "आत्मविश्वास", "planner.previousRole": "पिछली भूमिका", "planner.yearsExperience": "अनुभव के वर्ष", "planner.breakYears": "करियर ब्रेक (वर्ष)", "planner.reason": "कारण श्रेणी", "planner.targetRole": "लक्षित भूमिका", "planner.skills": "मौजूदा कौशल", "planner.confidence": "आत्मविश्वास स्तर", "planner.back": "पीछे", "planner.next": "आगे", "planner.generate": "योजना बनाएं", "planner.saved": "डैशबोर्ड में सेव हो गया।", "dashboard.emptyTitle": "डैशबोर्ड खोलने के लिए पहले एक योजना बनाएं।", "dashboard.emptyLead": "आपकी रोडमैप, नोट्स, जॉब्स और प्रगति यहां दिखेगी।", "dashboard.checklist": "गति चेकलिस्ट", "dashboard.notes": "करियर नोट्स", "dashboard.wins": "छोटी जीतें", "dashboard.addWin": "जीत जोड़ें", "dashboard.interview": "इंटरव्यू अभ्यास", "dashboard.nextMilestone": "अगला माइलस्टोन", "dashboard.savedJobs": "सेव की गई जॉब्स", "dashboard.appliedJobs": "अप्लाई की गई जॉब्स", "opps.title": "जॉब्स, मेंटर्स और लर्निंग", "opps.lead": "अपनी री-एंट्री यात्रा के लिए सही अगला कदम चुनें।", "opps.filterAll": "सभी", "opps.filterJobs": "जॉब्स", "opps.filterMentors": "मेंटर्स", "opps.filterLearning": "लर्निंग", "opps.save": "सेव", "opps.saved": "सेव्ड", "opps.apply": "अप्लाई", "opps.applied": "अप्लाई किया", "opps.requestMentor": "मेंटोर अनुरोध", "opps.postJob": "ओपनिंग पोस्ट करें", "personas.title": "पर्सोना डेमो मोड", "personas.lead": "दिखाएं कि प्लेटफॉर्म अलग-अलग वापसी यात्राओं के अनुसार कैसे बदलता है।", "common.quickDemo": "क्विक डेमो पर्सोना", "common.language": "भाषा", "common.profile": "प्रोफाइल", "common.savedAt": "सेव", "common.noData": "अभी डेटा नहीं है", "common.clear": "साफ करें"
  },
  te: {
    "nav.home": "హోమ్", "nav.planner": "ప్లానర్", "nav.dashboard": "డాష్‌బోర్డ్", "nav.personas": "పర్సోనాలు", "nav.opportunities": "అవకాశాలు", "nav.login": "లాగిన్", "nav.register": "రిజిస్టర్", "nav.logout": "లాగౌట్", "nav.openDashboard": "డాష్‌బోర్డ్ తెరవండి", "roles.returnee": "తిరిగి చేరే అభ్యర్థి", "roles.mentor": "మెంటర్", "roles.recruiter": "రిక్రూటర్", "home.eyebrow": "మహిళా సాధికారత కోసం AI / ML", "home.title": "మళ్లీ ఉద్యోగంలోకి రావాలనుకునే మహిళల కోసం స్మార్ట్ రీ-ఎంట్రీ ప్లాట్‌ఫారమ్.", "home.lead": "స్పష్టమైన మార్గదర్శకం. సిద్ధమైన ప్లాన్. మెంటర్ సపోర్ట్. అవకాశాల కనుగొనడం.", "home.ctaPrimary": "ప్లాన్ ప్రారంభించండి", "home.ctaSecondary": "అవకాశాలు చూడండి", "home.feature1Title": "సులభమైన ప్రయాణం", "home.feature1Text": "ప్లాన్, ప్రాక్టీస్, అప్లై, ప్రోగ్రెస్ ట్రాక్ అన్నీ ఒకేచోట.", "home.feature2Title": "ఆత్మవిశ్వాసానికి రూపొందించబడింది", "home.feature2Text": "చిన్న దశలు, స్పష్టమైన కార్డులు, సహాయక భాష.", "home.feature3Title": "రోల్ ఆధారిత ప్లాట్‌ఫారమ్", "home.feature3Text": "ప్రతి పాత్రకు ప్రత్యేక వర్క్‌స్పేస్.", "auth.loginTitle": "మళ్లీ స్వాగతం", "auth.loginLead": "మీ జాబ్ రీ-ఎంట్రీ ప్రయాణాన్ని కొనసాగించడానికి లాగిన్ చేయండి.", "auth.registerTitle": "మీ ఖాతాను సృష్టించండి", "auth.registerLead": "మీ పాత్రను ఎంచుకుని ప్లాట్‌ఫారమ్ ఉపయోగించండి.", "auth.name": "పూర్తి పేరు", "auth.email": "ఇమెయిల్", "auth.password": "పాస్‌వర్డ్", "auth.role": "పాత్ర", "auth.language": "భాష", "auth.loginButton": "లాగిన్", "auth.registerButton": "రిజిస్టర్", "auth.invalidCredentials": "తప్పు ఇమెయిల్ లేదా పాస్‌వర్డ్.", "auth.emailExists": "ఈ ఇమెయిల్‌తో ఖాతా ఇప్పటికే ఉంది.", "auth.toRegister": "ఖాతా లేదా? రిజిస్టర్ చేయండి", "auth.toLogin": "ఇప్పటికే ఖాతా ఉందా? లాగిన్ చేయండి", "planner.title": "మీ రీ-ఎంట్రీ ప్లాన్ రూపొందించండి", "planner.lead": "చిన్న దశలు. స్పష్టమైన ఫలితాలు. డాష్‌బోర్డ్‌లో సేవ్.", "planner.step1": "నేపథ్యం", "planner.step2": "దిశ", "planner.step3": "ఆత్మవిశ్వాసం", "planner.previousRole": "మునుపటి పాత్ర", "planner.yearsExperience": "అనుభవ సంవత్సరాలు", "planner.breakYears": "కెరీర్ విరామం (సంవత్సరాలు)", "planner.reason": "కారణం", "planner.targetRole": "లక్ష్య పాత్ర", "planner.skills": "ప్రస్తుత నైపుణ్యాలు", "planner.confidence": "ఆత్మవిశ్వాస స్థాయి", "planner.back": "వెనుకకు", "planner.next": "తదుపరి", "planner.generate": "ప్లాన్ రూపొందించండి", "planner.saved": "డాష్‌బోర్డ్‌లో సేవ్ అయ్యింది.", "dashboard.emptyTitle": "మీ డాష్‌బోర్డ్ కోసం ముందుగా ఒక ప్లాన్ తయారు చేయండి.", "dashboard.emptyLead": "మీ రోడ్‌మ్యాప్, నోట్స్, ఉద్యోగాలు, పురోగతి ఇక్కడ కనిపిస్తాయి.", "dashboard.checklist": "మొమెంటమ్ చెక్‌లిస్ట్", "dashboard.notes": "కెరీర్ నోట్స్", "dashboard.wins": "చిన్న విజయాలు", "dashboard.addWin": "విజయం జోడించండి", "dashboard.interview": "ఇంటర్వ్యూ ప్రాక్టీస్", "dashboard.nextMilestone": "తదుపరి మైలురాయి", "dashboard.savedJobs": "సేవ్ చేసిన ఉద్యోగాలు", "dashboard.appliedJobs": "అప్లై చేసిన ఉద్యోగాలు", "opps.title": "ఉద్యోగాలు, మెంటర్లు, లెర్నింగ్", "opps.lead": "మీ రీ-ఎంట్రీ ప్రయాణానికి సరైన తదుపరి అడుగు కనుగొనండి.", "opps.filterAll": "అన్నీ", "opps.filterJobs": "ఉద్యోగాలు", "opps.filterMentors": "మెంటర్లు", "opps.filterLearning": "లెర్నింగ్", "opps.save": "సేవ్", "opps.saved": "సేవ్ అయింది", "opps.apply": "అప్లై", "opps.applied": "అప్లై అయింది", "opps.requestMentor": "మెంటర్ అభ్యర్థన", "opps.postJob": "ఉద్యోగం పోస్టు చేయండి", "personas.title": "పర్సోనా డెమో మోడ్", "personas.lead": "వివిధ రీ-ఎంట్రీ ప్రయాణాలకు ప్లాట్‌ఫారమ్ ఎలా మారుతుందో చూపించండి.", "common.quickDemo": "క్విక్ డెమో పర్సోనాలు", "common.language": "భాష", "common.profile": "ప్రొఫైల్", "common.savedAt": "సేవ్", "common.noData": "ఇంకా డేటా లేదు", "common.clear": "తుడిచేయండి"
  },
  ml: {
    "nav.home": "ഹോം", "nav.planner": "പ്ലാനർ", "nav.dashboard": "ഡാഷ്ബോർഡ്", "nav.personas": "പേഴ്സോണകൾ", "nav.opportunities": "അവസരങ്ങൾ", "nav.login": "ലോഗിൻ", "nav.register": "രജിസ്റ്റർ", "nav.logout": "ലോഗൗട്ട്", "nav.openDashboard": "ഡാഷ്ബോർഡ് തുറക്കുക", "roles.returnee": "തിരികെ എത്തുന്ന ഉപയോക്താവ്", "roles.mentor": "മെന്റർ", "roles.recruiter": "റിക്രൂട്ടർ", "home.eyebrow": "സ്ത്രീ ശാക്തീകരണത്തിനായുള്ള AI / ML", "home.title": "ജോലിയിലേക്ക് മടങ്ങുന്ന സ്ത്രീകൾക്കായുള്ള സ്മാർട്ട് റീ-എൻട്രി പ്ലാറ്റ്ഫോം.", "home.lead": "വ്യക്തമായ മാർഗ്ഗനിർദേശം. തയ്യാറായ പ്ലാൻ. മെന്റർ സഹായം. അവസരങ്ങൾ.", "home.ctaPrimary": "പ്ലാൻ ആരംഭിക്കുക", "home.ctaSecondary": "അവസരങ്ങൾ കാണുക", "home.feature1Title": "ലളിതമായ യാത്ര", "home.feature1Text": "പ്ലാൻ, പരിശീലനം, അപേക്ഷ, പുരോഗതി എന്നിവ ഒറ്റ ഇടത്ത്.", "home.feature2Title": "ആത്മവിശ്വാസത്തിനായി", "home.feature2Text": "ചെറിയ ഘട്ടങ്ങൾ, വ്യക്തമായ കാർഡുകൾ, സഹായകരമായ ഭാഷ.", "home.feature3Title": "റോൾ അടിസ്ഥാന പ്ലാറ്റ്ഫോം", "home.feature3Text": "ഓരോ റോളിനും പ്രത്യേക വർക്ക്സ്പേസ്.", "auth.loginTitle": "വീണ്ടും സ്വാഗതം", "auth.loginLead": "നിങ്ങളുടെ ജോലി റീ-എൻട്രി യാത്ര തുടരാൻ ലോഗിൻ ചെയ്യുക.", "auth.registerTitle": "നിങ്ങളുടെ അക്കൗണ്ട് സൃഷ്ടിക്കുക", "auth.registerLead": "റോൾ തിരഞ്ഞെടുക്കി പ്ലാറ്റ്ഫോം ആരംഭിക്കുക.", "auth.name": "പൂർണ്ണ പേര്", "auth.email": "ഇമെയിൽ", "auth.password": "പാസ്വേഡ്", "auth.role": "റോൾ", "auth.language": "ഭാഷ", "auth.loginButton": "ലോഗിൻ", "auth.registerButton": "രജിസ്റ്റർ", "auth.invalidCredentials": "തെറ്റായ ഇമെയിൽ അല്ലെങ്കിൽ പാസ്വേഡ്.", "auth.emailExists": "ഈ ഇമെയിലിൽ അക്കൗണ്ട് ഇതിനകം ഉണ്ട്.", "auth.toRegister": "അക്കൗണ്ട് ഇല്ലേ? രജിസ്റ്റർ ചെയ്യുക", "auth.toLogin": "അക്കൗണ്ട് ഉണ്ടോ? ലോഗിൻ ചെയ്യുക", "planner.title": "നിങ്ങളുടെ റീ-എൻട്രി പ്ലാൻ നിർമ്മിക്കുക", "planner.lead": "ചെറിയ ഘട്ടങ്ങൾ. വ്യക്തമായ ഔട്ട്പുട്ടുകൾ. ഡാഷ്ബോർഡിൽ സേവ്.", "planner.step1": "പശ്ചാത്തലം", "planner.step2": "ദിശ", "planner.step3": "ആത്മവിശ്വാസം", "planner.previousRole": "മുൻപത്തെ റോൾ", "planner.yearsExperience": "അനുഭവ വർഷങ്ങൾ", "planner.breakYears": "കരിയർ ഇടവേള (വർഷങ്ങൾ)", "planner.reason": "കാരണം", "planner.targetRole": "ലക്ഷ്യ റോൾ", "planner.skills": "നിലവിലെ കഴിവുകൾ", "planner.confidence": "ആത്മവിശ്വാസ നിരപ്പ്", "planner.back": "പിന്നിലേക്ക്", "planner.next": "അടുത്തത്", "planner.generate": "പ്ലാൻ സൃഷ്ടിക്കുക", "planner.saved": "ഡാഷ്ബോർഡിൽ സേവ് ചെയ്തു.", "dashboard.emptyTitle": "നിങ്ങളുടെ ഡാഷ്ബോർഡ് തുറക്കാൻ ആദ്യം ഒരു പ്ലാൻ സൃഷ്ടിക്കൂ.", "dashboard.emptyLead": "റോഡ്‌മാപ്പ്, നോട്ടുകൾ, ജോലികൾ, പുരോഗതി ഇവിടെ കാണാം.", "dashboard.checklist": "മൊമെന്റം ചെക്ക്ലിസ്റ്റ്", "dashboard.notes": "കരിയർ നോട്ടുകൾ", "dashboard.wins": "ചെറിയ വിജയങ്ങൾ", "dashboard.addWin": "വിജയം ചേർക്കുക", "dashboard.interview": "ഇന്റർവ്യൂ പരിശീലനം", "dashboard.nextMilestone": "അടുത്ത മൈൽസ്റ്റോൺ", "dashboard.savedJobs": "സേവ് ചെയ്ത ജോലികൾ", "dashboard.appliedJobs": "അപേക്ഷിച്ച ജോലികൾ", "opps.title": "ജോലികൾ, മെന്റർമാർ, പഠനം", "opps.lead": "നിങ്ങളുടെ റീ-എൻട്രി യാത്രയ്ക്ക് അടുത്ത ശരിയായ ഘട്ടം കണ്ടെത്തൂ.", "opps.filterAll": "എല്ലാം", "opps.filterJobs": "ജോലികൾ", "opps.filterMentors": "മെന്റർമാർ", "opps.filterLearning": "പഠനം", "opps.save": "സേവ്", "opps.saved": "സേവ് ചെയ്തു", "opps.apply": "അപേക്ഷിക്കുക", "opps.applied": "അപേക്ഷിച്ചു", "opps.requestMentor": "മെന്റർ അഭ്യർത്ഥിക്കുക", "opps.postJob": "ഓപ്പണിംഗ് പോസ്റ്റ് ചെയ്യുക", "personas.title": "പേഴ്സോണ ഡെമോ മോഡ്", "personas.lead": "വിവിധ റീ-എൻട്രി യാത്രകൾക്ക് പ്ലാറ്റ്ഫോം എങ്ങനെ മാറുന്നു എന്ന് കാണിക്കുക.", "common.quickDemo": "ക്വിക് ഡെമോ പേഴ്സോണകൾ", "common.language": "ഭാഷ", "common.profile": "പ്രൊഫൈൽ", "common.savedAt": "സേവ്", "common.noData": "ഡാറ്റയില്ല", "common.clear": "ക്ലിയർ"
  },
  ta: {
    "nav.home": "முகப்பு", "nav.planner": "திட்டம்", "nav.dashboard": "டாஷ்போர்டு", "nav.personas": "பெர்சோனாக்கள்", "nav.opportunities": "வாய்ப்புகள்", "nav.login": "உள்நுழைவு", "nav.register": "பதிவு", "nav.logout": "வெளியேறு", "nav.openDashboard": "டாஷ்போர்டை திறக்கவும்", "roles.returnee": "மீண்டும் வேலைக்கு வருபவர்", "roles.mentor": "மென்டர்", "roles.recruiter": "ஆள்சேர்ப்பு நிபுணர்", "home.eyebrow": "பெண்கள் அதிகாரமடைய AI / ML", "home.title": "வேலையில் மீண்டும் சேர விரும்பும் பெண்களுக்கான ஸ்மார்ட் ரீ-என்ட்ரி தளம்.", "home.lead": "தெளிவான வழிகாட்டல். தயார் திட்டம். மென்டர் ஆதரம். வாய்ப்பு தேடல்.", "home.ctaPrimary": "தொடங்குங்கள்", "home.ctaSecondary": "வாய்ப்புகளை பார்க்கவும்", "home.feature1Title": "எளிய பயணம்", "home.feature1Text": "திட்டம், பயிற்சி, விண்ணப்பம், முன்னேற்றம் அனைத்தும் ஒரே இடத்தில்.", "home.feature2Title": "தன்னம்பிக்கைக்காக", "home.feature2Text": "சிறிய படிகள், தெளிவான கார்டுகள், ஆதரவு மொழி.", "home.feature3Title": "பங்கு அடிப்படையிலான தளம்", "home.feature3Text": "ஒவ்வொரு பங்குக்கும் தனி workspace.", "auth.loginTitle": "மீண்டும் வரவேற்கிறோம்", "auth.loginLead": "உங்கள் வேலை மறுபிரவேச பயணத்தை தொடர உள்நுழைக.", "auth.registerTitle": "உங்கள் கணக்கை உருவாக்குங்கள்", "auth.registerLead": "பங்கைக் தேர்ந்தெடுத்து தளத்தை தொடங்குங்கள்.", "auth.name": "முழு பெயர்", "auth.email": "மின்னஞ்சல்", "auth.password": "கடவுச்சொல்", "auth.role": "பங்கு", "auth.language": "மொழி", "auth.loginButton": "உள்நுழைவு", "auth.registerButton": "பதிவு", "auth.invalidCredentials": "தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்.", "auth.emailExists": "இந்த மின்னஞ்சலுடன் கணக்கு ஏற்கனவே உள்ளது.", "auth.toRegister": "கணக்கு இல்லையா? பதிவு செய்யுங்கள்", "auth.toLogin": "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக", "planner.title": "உங்கள் மீள்சேரல் திட்டத்தை உருவாக்குங்கள்", "planner.lead": "சிறிய படிகள். தெளிவான வெளியீடுகள். டாஷ்போர்டில் சேமிப்பு.", "planner.step1": "பின்னணி", "planner.step2": "திசை", "planner.step3": "தன்னம்பிக்கை", "planner.previousRole": "முந்தைய பங்கு", "planner.yearsExperience": "அனுபவ ஆண்டுகள்", "planner.breakYears": "தொழில் இடைவேளை (ஆண்டுகள்)", "planner.reason": "காரணம்", "planner.targetRole": "இலக்கு பங்கு", "planner.skills": "தற்போதைய திறன்கள்", "planner.confidence": "தன்னம்பிக்கை நிலை", "planner.back": "பின்செல்", "planner.next": "அடுத்து", "planner.generate": "திட்டம் உருவாக்கு", "planner.saved": "டாஷ்போர்டில் சேமிக்கப்பட்டது.", "dashboard.emptyTitle": "டாஷ்போர்டை திறக்க முதலில் ஒரு திட்டம் உருவாக்குங்கள்.", "dashboard.emptyLead": "உங்கள் roadmap, notes, jobs, progress இங்கே வரும்.", "dashboard.checklist": "முன்னேற்றச் சரிபார்ப்பு பட்டியல்", "dashboard.notes": "தொழில் குறிப்புகள்", "dashboard.wins": "சிறிய வெற்றிகள்", "dashboard.addWin": "வெற்றி சேர்க்கவும்", "dashboard.interview": "நேர்முகப் பயிற்சி", "dashboard.nextMilestone": "அடுத்த இலக்கு", "dashboard.savedJobs": "சேமித்த வேலைகள்", "dashboard.appliedJobs": "விண்ணப்பித்த வேலைகள்", "opps.title": "வேலைகள், மென்டர்கள், கற்றல்", "opps.lead": "உங்கள் மறுபிரவேச பயணத்திற்கு சரியான அடுத்த படியை தேர்ந்தெடுக்கவும்.", "opps.filterAll": "அனைத்தும்", "opps.filterJobs": "வேலைகள்", "opps.filterMentors": "மென்டர்கள்", "opps.filterLearning": "கற்றல்", "opps.save": "சேமி", "opps.saved": "சேமிக்கப்பட்டது", "opps.apply": "விண்ணப்பிக்கவும்", "opps.applied": "விண்ணப்பித்தது", "opps.requestMentor": "மென்டர் கோரிக்கை", "opps.postJob": "வேலை பதிவிடு", "personas.title": "பெர்சோனா டெமோ மோட்", "personas.lead": "பல்வேறு மீள்சேரல் பயணங்களுக்கு தளம் எப்படி மாறுகிறது என்பதை காட்டுங்கள்.", "common.quickDemo": "விரைவு டெமோ பெர்சோனாக்கள்", "common.language": "மொழி", "common.profile": "ப்ரொஃபைல்", "common.savedAt": "சேமிப்பு", "common.noData": "இன்னும் தரவு இல்லை", "common.clear": "அழி"
  },
  or: {
    "nav.home": "ମୁଖ୍ୟ", "nav.planner": "ପ୍ଲାନର", "nav.dashboard": "ଡ୍ୟାଶବୋର୍ଡ", "nav.personas": "ପର୍ସୋନା", "nav.opportunities": "ସୁଯୋଗ", "nav.login": "ଲଗଇନ", "nav.register": "ନିବନ୍ଧନ", "nav.logout": "ଲଗଆଉଟ", "nav.openDashboard": "ଡ୍ୟାଶବୋର୍ଡ ଖୋଲନ୍ତୁ", "roles.returnee": "ପୁନଃ ଯୋଗଦାନକାରୀ", "roles.mentor": "ମେଣ୍ଟର", "roles.recruiter": "ରିକ୍ରୁଟର", "home.eyebrow": "ମହିଳା ସଶକ୍ତିକରଣ ପାଇଁ AI / ML", "home.title": "ପୁନଃ କାମକୁ ଫେରୁଥିବା ମହିଳାଙ୍କ ପାଇଁ ସ୍ମାର୍ଟ ରି-ଏଣ୍ଟ୍ରି ପ୍ଲାଟଫର୍ମ।", "home.lead": "ସ୍ପଷ୍ଟ ମାର୍ଗଦର୍ଶନ। ପ୍ରସ୍ତୁତ ପ୍ଲାନ। ମେଣ୍ଟର ସହାୟତା। ସୁଯୋଗ ଖୋଜ।", "home.ctaPrimary": "ପ୍ଲାନ ଆରମ୍ଭ କରନ୍ତୁ", "home.ctaSecondary": "ସୁଯୋଗ ଦେଖନ୍ତୁ", "home.feature1Title": "ସହଜ ଯାତ୍ରା", "home.feature1Text": "ପ୍ଲାନ, ଅଭ୍ୟାସ, ଆବେଦନ ଏବଂ ପ୍ରଗତି ସବୁ ଏକ ସ୍ଥାନରେ।", "home.feature2Title": "ଆତ୍ମବିଶ୍ୱାସ ପାଇଁ", "home.feature2Text": "ଛୋଟ ପଦକ୍ଷେପ, ସ୍ପଷ୍ଟ କାର୍ଡ ଏବଂ ସହାୟକ ଭାଷା।", "home.feature3Title": "ରୋଲ ଆଧାରିତ ପ୍ଲାଟଫର୍ମ", "home.feature3Text": "ପ୍ରତ୍ୟେକ ରୋଲ ପାଇଁ ଅଲଗା ୱର୍କସ୍ପେସ।", "auth.loginTitle": "ପୁନଃ ସ୍ୱାଗତ", "auth.loginLead": "ଆପଣଙ୍କର ଜବ ରି-ଏଣ୍ଟ୍ରି ଯାତ୍ରା ଜାରି ରଖିବା ପାଇଁ ଲଗଇନ କରନ୍ତୁ।", "auth.registerTitle": "ଆପଣଙ୍କ ଖାତା ତିଆରି କରନ୍ତୁ", "auth.registerLead": "ରୋଲ ଚୟନ କରନ୍ତୁ ଏବଂ ପ୍ଲାଟଫର୍ମ ଆରମ୍ଭ କରନ୍ତୁ।", "auth.name": "ପୂର୍ଣ୍ଣ ନାମ", "auth.email": "ଇମେଲ", "auth.password": "ପାସୱାର୍ଡ", "auth.role": "ରୋଲ", "auth.language": "ଭାଷା", "auth.loginButton": "ଲଗଇନ", "auth.registerButton": "ନିବନ୍ଧନ", "auth.invalidCredentials": "ଭୁଲ ଇମେଲ କିମ୍ବା ପାସୱାର୍ଡ।", "auth.emailExists": "ଏହି ଇମେଲରେ ଖାତା ଆଗରୁ ଅଛି।", "auth.toRegister": "ଖାତା ନାହିଁ? ନିବନ୍ଧନ କରନ୍ତୁ", "auth.toLogin": "ଖାତା ଅଛି? ଲଗଇନ କରନ୍ତୁ", "planner.title": "ଆପଣଙ୍କର ରି-ଏଣ୍ଟ୍ରି ପ୍ଲାନ ତିଆରି କରନ୍ତୁ", "planner.lead": "ଛୋଟ ପଦକ୍ଷେପ। ସ୍ପଷ୍ଟ ଫଳାଫଳ। ଡ୍ୟାଶବୋର୍ଡରେ ସେଭ।", "planner.step1": "ପୃଷ୍ଠଭୂମି", "planner.step2": "ଦିଗ", "planner.step3": "ଆତ୍ମବିଶ୍ୱାସ", "planner.previousRole": "ପୂର୍ବରୁ ଥିବା ରୋଲ", "planner.yearsExperience": "ଅନୁଭବ ବର୍ଷ", "planner.breakYears": "କ୍ୟାରିଅର ବିରତି (ବର୍ଷ)", "planner.reason": "କାରଣ", "planner.targetRole": "ଲକ୍ଷ୍ୟ ରୋଲ", "planner.skills": "ବର୍ତ୍ତମାନ କୌଶଳ", "planner.confidence": "ଆତ୍ମବିଶ୍ୱାସ ସ୍ତର", "planner.back": "ପଛକୁ", "planner.next": "ପରବର୍ତ୍ତୀ", "planner.generate": "ପ୍ଲାନ ସୃଷ୍ଟି କରନ୍ତୁ", "planner.saved": "ଡ୍ୟାଶବୋର୍ଡରେ ସେଭ ହେଲା।", "dashboard.emptyTitle": "ଡ୍ୟାଶବୋର୍ଡ ଖୋଲିବା ପୂର୍ବରୁ ଏକ ପ୍ଲାନ କରନ୍ତୁ।", "dashboard.emptyLead": "ଆପଣଙ୍କ roadmap, notes, jobs, progress ଏଠାରେ ଦେଖାଯିବ।", "dashboard.checklist": "ମୋମେଣ୍ଟମ ଚେକଲିଷ୍ଟ", "dashboard.notes": "କ୍ୟାରିଅର ନୋଟ୍ସ", "dashboard.wins": "ଛୋଟ ସଫଳତା", "dashboard.addWin": "ସଫଳତା ଯୋଡନ୍ତୁ", "dashboard.interview": "ଇଣ୍ଟରଭ୍ୟୁ ଅଭ୍ୟାସ", "dashboard.nextMilestone": "ପରବର୍ତ୍ତୀ ମାଇଲସ୍ଟୋନ", "dashboard.savedJobs": "ସେଭ୍ କରା ଜବ୍ସ", "dashboard.appliedJobs": "ଆବେଦନ କରା ଜବ୍ସ", "opps.title": "ଜବ୍ସ, ମେଣ୍ଟର ଏବଂ ଶିଖଣ", "opps.lead": "ଆପଣଙ୍କ ରି-ଏଣ୍ଟ୍ରି ଯାତ୍ରା ପାଇଁ ସଠିକ ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ ଖୋଜନ୍ତୁ।", "opps.filterAll": "ସବୁ", "opps.filterJobs": "ଜବ୍ସ", "opps.filterMentors": "ମେଣ୍ଟର", "opps.filterLearning": "ଶିଖଣ", "opps.save": "ସେଭ", "opps.saved": "ସେଭ୍", "opps.apply": "ଆବେଦନ", "opps.applied": "ଆବେଦନ ହେଲା", "opps.requestMentor": "ମେଣ୍ଟର ଅନୁରୋଧ", "opps.postJob": "ଜବ ପୋଷ୍ଟ କରନ୍ତୁ", "personas.title": "ପର୍ସୋନା ଡେମୋ ମୋଡ୍", "personas.lead": "ବିଭିନ୍ନ ରି-ଏଣ୍ଟ୍ରି ଯାତ୍ରା ପାଇଁ ପ୍ଲାଟଫର୍ମ କିପରି ବଦଳେ ଦେଖାନ୍ତୁ।", "common.quickDemo": "କ୍ୱିକ ଡେମୋ ପର୍ସୋନା", "common.language": "ଭାଷା", "common.profile": "ପ୍ରୋଫାଇଲ", "common.savedAt": "ସେଭ୍", "common.noData": "ଡାଟା ନାହିଁ", "common.clear": "ସଫା କରନ୍ତୁ"
  },
  bn: {
    "nav.home": "হোম", "nav.planner": "প্ল্যানার", "nav.dashboard": "ড্যাশবোর্ড", "nav.personas": "পার্সোনা", "nav.opportunities": "সুযোগ", "nav.login": "লগইন", "nav.register": "রেজিস্টার", "nav.logout": "লগআউট", "nav.openDashboard": "ড্যাশবোর্ড খুলুন", "roles.returnee": "ফিরে আসা প্রার্থী", "roles.mentor": "মেন্টর", "roles.recruiter": "রিক্রুটার", "home.eyebrow": "নারী ক্ষমতায়নের জন্য AI / ML", "home.title": "কর্মক্ষেত্রে ফিরতে চাওয়া নারীদের জন্য স্মার্ট রি-এন্ট্রি প্ল্যাটফর্ম।", "home.lead": "স্পষ্ট নির্দেশনা। প্রস্তুত পরিকল্পনা। মেন্টর সহায়তা। সুযোগ খোঁজা।", "home.ctaPrimary": "প্ল্যান শুরু করুন", "home.ctaSecondary": "সুযোগ দেখুন", "home.feature1Title": "সহজ যাত্রা", "home.feature1Text": "প্ল্যান, প্র্যাকটিস, আবেদন, অগ্রগতি এক জায়গায়।", "home.feature2Title": "আত্মবিশ্বাসের জন্য", "home.feature2Text": "ছোট ধাপ, পরিষ্কার কার্ড, সহায়ক ভাষা।", "home.feature3Title": "রোল-ভিত্তিক প্ল্যাটফর্ম", "home.feature3Text": "প্রতিটি রোলের জন্য আলাদা workspace।", "auth.loginTitle": "আবার স্বাগতম", "auth.loginLead": "আপনার job re-entry যাত্রা চালিয়ে যেতে লগইন করুন।", "auth.registerTitle": "আপনার অ্যাকাউন্ট তৈরি করুন", "auth.registerLead": "আপনার রোল বেছে নিয়ে প্ল্যাটফর্ম শুরু করুন।", "auth.name": "পূর্ণ নাম", "auth.email": "ইমেল", "auth.password": "পাসওয়ার্ড", "auth.role": "রোল", "auth.language": "ভাষা", "auth.loginButton": "লগইন", "auth.registerButton": "রেজিস্টার", "auth.invalidCredentials": "ভুল ইমেল বা পাসওয়ার্ড।", "auth.emailExists": "এই ইমেলে আগেই অ্যাকাউন্ট আছে।", "auth.toRegister": "অ্যাকাউন্ট নেই? রেজিস্টার করুন", "auth.toLogin": "আগে থেকেই অ্যাকাউন্ট আছে? লগইন করুন", "planner.title": "আপনার re-entry প্ল্যান তৈরি করুন", "planner.lead": "ছোট ধাপ। পরিষ্কার আউটপুট। ড্যাশবোর্ডে সেভ।", "planner.step1": "পটভূমি", "planner.step2": "দিক", "planner.step3": "আত্মবিশ্বাস", "planner.previousRole": "আগের রোল", "planner.yearsExperience": "অভিজ্ঞতার বছর", "planner.breakYears": "ক্যারিয়ার ব্রেক (বছর)", "planner.reason": "কারণ", "planner.targetRole": "টার্গেট রোল", "planner.skills": "বর্তমান স্কিল", "planner.confidence": "আত্মবিশ্বাসের স্তর", "planner.back": "পেছনে", "planner.next": "পরবর্তী", "planner.generate": "প্ল্যান তৈরি করুন", "planner.saved": "ড্যাশবোর্ডে সেভ হয়েছে।", "dashboard.emptyTitle": "ড্যাশবোর্ড খুলতে আগে একটি প্ল্যান তৈরি করুন।", "dashboard.emptyLead": "আপনার roadmap, notes, jobs, progress এখানে দেখা যাবে।", "dashboard.checklist": "মোমেন্টাম চেকলিস্ট", "dashboard.notes": "ক্যারিয়ার নোটস", "dashboard.wins": "ছোট জয়", "dashboard.addWin": "জয় যোগ করুন", "dashboard.interview": "ইন্টারভিউ প্র্যাকটিস", "dashboard.nextMilestone": "পরবর্তী মাইলস্টোন", "dashboard.savedJobs": "সেভ করা jobs", "dashboard.appliedJobs": "আবেদন করা jobs", "opps.title": "Jobs, mentors, learning", "opps.lead": "আপনার re-entry যাত্রার জন্য সঠিক পরের ধাপ খুঁজুন।", "opps.filterAll": "সব", "opps.filterJobs": "Jobs", "opps.filterMentors": "Mentors", "opps.filterLearning": "Learning", "opps.save": "সেভ", "opps.saved": "সেভড", "opps.apply": "আবেদন", "opps.applied": "আবেদন করা হয়েছে", "opps.requestMentor": "মেন্টর অনুরোধ", "opps.postJob": "Job পোস্ট করুন", "personas.title": "Persona demo mode", "personas.lead": "দেখান কীভাবে প্ল্যাটফর্ম ভিন্ন re-entry journey অনুযায়ী বদলায়।", "common.quickDemo": "Quick demo personas", "common.language": "ভাষা", "common.profile": "প্রোফাইল", "common.savedAt": "সেভ", "common.noData": "এখনও ডেটা নেই", "common.clear": "ক্লিয়ার"
  },
};

Object.values(translations).forEach((bundle) => {
  bundle["home.eyebrow"] = "Women power = Nation's power";
});

function translateString(lang, key) {
  return translations[lang]?.[key] || translations.en[key] || key;
}

export function getLanguage() {
  return loadUiState().language || "en";
}

export function setLanguage(language) {
  const state = loadUiState();
  saveUiState({
    ...state,
    language,
  });
  window.dispatchEvent(new CustomEvent("relaunchher:languagechange", { detail: language }));
}

export function t(key, language = getLanguage()) {
  return translateString(language, key);
}

export function applyTranslations(root = document, language = getLanguage()) {
  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;
  root.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n, language);
  });
  root.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder, language);
  });
}
