import { Project, SkillGroup, TimelineItem } from "./types";

export const PROJECTS_DATA: Project[] = [
  {
    id: "rag-assistant",
    title: "Assistente AI Aziendale (RAG)",
    shortDescription: "Architettura Retrieval-Augmented Generation per supportare l'ecosistema aziendale e gestire in automatico email e flussi dati.",
    fullDescription: "Sviluppo avanzato della struttura core per un sistema di assistenza aziendale intelligente basato su Large Language Models (LLM). L'applicazione sfrutta tecniche RAG (Retrieval-Augmented Generation) per connettere la conoscenza interna securizzata con modelli di intelligenza artificiale.",
    category: "ai",
    tags: ["AI", "RAG", "LLM", "Google Drive API", "Web Crawling", "Node.js"],
    accentColor: "cyan-500",
    achievements: [
      "Ideazione e sviluppo dell'architettura core di indexing e retrieval documentale.",
      "Integrazione di un sistema potenziato dall'intelligenza artificiale per il parsing, la classificazione e la risposta automatizzata alle email aziendali.",
      "Implementazione di flussi di sincronizzazione massiva (batch-import) tramite web crawler appositamente realizzati e connettori cloud per cartelle Google Drive condivise."
    ],
    metrics: [
      { label: "Tempo risposta flussi", value: "-60%" },
      { label: "Documenti indicizzati", value: "10.000+" },
      { label: "Precisione di ricerca", value: "94%" }
    ]
  },
  {
    id: "ceposto-platform",
    title: "CePosto Platform",
    shortDescription: "Creazione e manutenzione avanzata del sistema SaaS leader per la prenotazione online di appuntamenti e la gestione delle code.",
    fullDescription: "Sviluppo ordinario ed evolutivo sull'ecosistema SaaS di CePosto (www.ceposto.it). La piattaforma è utilizzata ampiamente da Comuni, Pubbliche Amministrazioni, studi professionali ed aziende per la prenotazione online di appuntamenti flessibili, la pianificazione degli slot orari e l'eliminazione delle code, con integrazione nativa per App mobile iOS/Android e portali web.",
    category: "web",
    tags: ["SaaS", "Yii2 PHP", "PostgreSQL", "REST APIs", "Booking Engine", "Web App"],
    accentColor: "cyan-400",
    achievements: [
      "Ingegnerizzazione di logiche calendarizzanti complesse con gestione flessibile di eccezioni, ricorrenze e disponibilità degli operatori.",
      "Sviluppo di backend API e ottimizzazione delle tabelle PostgreSQL ad alto traffico, velocizzando del 35% il rendering degli slot orari.",
      "Coordinamento e manutenzione dei servizi server di interfacciamento con le app mobili native per la cittadinanza."
    ],
    metrics: [
      { label: "Prenotazioni/mese", value: "500k+" },
      { label: "Utenti registrati", value: "100k+" },
      { label: "Uptime dei Server", value: "99.9%" }
    ]
  },
  {
    id: "todo-workflow",
    title: "ToDo (Enterprise Workflow Manager)",
    shortDescription: "Applicativo Angular e Spring Boot aziendale per la gestione completa di sprint, bug, integrazione Git e CRM d'assistenza.",
    fullDescription: "Ingegnerizzazione completa e manutenzione di ToDo, un sistema integrato di Task & Sprint Management ispirato a Jira per governare l'intero ciclo del codice. Dalla segnalazione del bug del cliente alla creazione automatizzata dei branch git corrispondenti. Gestisce inoltre la contrattualizzazione commerciale e un helpdesk per connettere ticket tecnici e contatti clienti.",
    category: "web",
    tags: ["Angular", "Spring Boot", "Git Hooks", "Dev Workflows", "CRM", "Helpdesk"],
    accentColor: "indigo-500",
    achievements: [
      "Integrazione profonda con le API di Git per l'auto-creazione automatica dei branch di lavoro partendo dalla segnalazione sul task manager.",
      "Sviluppo del motore di transizione degli stati del bug tracking per disciplinare metodicamente il flusso (Bug -> Development -> Code Review -> QA -> Deploy).",
      "Sviluppo del modulo commerciale integrato e dell'agenda di helpdesk aziendale per collegare ticket e contratti di assistenza."
    ],
    metrics: [
      { label: "Workflow automatici", value: "100%" },
      { label: "Branch Git tracciati", value: "2.500+" },
      { label: "Ticket gestiti/anno", value: "15.000+" }
    ]
  },
  {
    id: "gender-hack-2026",
    title: "Gender Hack 2026 (1° Classificato)",
    shortDescription: "Vincitore dell'hackathon nazionale di Women in Big Data Italy con il progetto volto all'inclusione 'Mind the Gap'.",
    fullDescription: "Trionfo al concorso nazionale organizzato dall'associazione internazionale 'Women in Big Data' in Italia con la squadra 'Serendipity'. Abbiamo disegnato, implementato e presentato 'Mind the Gap', una piattaforma innovativa orientata all'analisi statistica e proattiva della parità di genere all'interno delle aziende.",
    category: "web",
    tags: ["Hackathon", "Data Viz", "Empowerment", "React", "Team Leadership"],
    accentColor: "indigo-500",
    achievements: [
      "Vincitore del 1° Premio Nazionale della giuria specialistica nell'edizione 2026.",
      "Sviluppo dell'interfaccia interattiva di data visualization per evidenziare gap retributivi e percorsi di carriera discriminatori.",
      "Presentazione (Pitch) di fronte ad un panel di leader di imprese tecnologiche nazionali."
    ],
    metrics: [
      { label: "Premio conquistato", value: "1° Posto" },
      { label: "Team member coordinati", value: "5 persone" },
      { label: "Tempo di sviluppo", value: "36 ore" }
    ]
  },
  {
    id: "n8n-migration",
    title: "Server & n8n Automation",
    shortDescription: "Migrazione strategica e completa dell'architettura di workflow automation con zero downtime per l'infrastruttura.",
    fullDescription: "Pianificazione logistica ed esecuzione tecnica del trasferimento dello stack di workflow automation basato sulle istanze n8n, portando workflows vitali, credenziali, code ed interi volumi persistent dal server di staging al server enterprise di produzione.",
    category: "devops",
    tags: ["n8n", "Docker", "Portainer", "Continuous Dev", "Backup & Recovery"],
    accentColor: "emerald-500",
    achievements: [
      "Migrazione senza interruzioni di servizio (Zero Downtime) per i flussi attivi.",
      "Integrazione e configurazione tramite pannello Portainer e containerizzazione Docker per backup automatici giornalieri.",
      "Sanitizzazione e cifratura di segreti, API Keys esterne e accessi a database remoti."
    ],
    metrics: [
      { label: "Downtime registrato", value: "0 ms" },
      { label: "Workflow migrati", value: "45+" },
      { label: "Velocità esecuzione", value: "+20%" }
    ]
  }
];

export const SKILLS_DATA: SkillGroup[] = [
  {
    category: "Backend & Database",
    description: "Creazione di logiche reattive, strutturazione dati e ottimizzazione queries.",
    iconName: "server",
    skills: [
      { name: "Spring Boot (Java)", level: 88, isCore: true },
      { name: "PHP / Yii2", level: 85, isCore: true },
      { name: "MariaDB / MySQL", level: 90, isCore: true },
      { name: "PostgreSQL", level: 85, isCore: false }
    ]
  },
  {
    category: "Frontend & Mobile",
    description: "Sviluppo di interfacce interattive moderne, scalabili e mobile-ready.",
    iconName: "layout",
    skills: [
      { name: "Angular", level: 82, isCore: true },
      { name: "Ionic Framework", level: 80, isCore: true },
      { name: "React (Vite)", level: 85, isCore: false },
      { name: "HTML5 & CSS3 / Tailwind", level: 95, isCore: true }
    ]
  },
  {
    category: "DevOps & Automation",
    description: "Amministrazione di infrastrutture agili e automatizzate.",
    iconName: "terminal",
    skills: [
      { name: "Docker & Containerization", level: 88, isCore: true },
      { name: "Portainer Management", level: 85, isCore: false },
      { name: "n8n Workflow Automation", level: 92, isCore: true },
      { name: "GitLab CI/CD Pipelines", level: 80, isCore: false }
    ]
  },
  {
    category: "AI & Innovazione",
    description: "Integrazione di intelligenze artificiali generative ed architetture MCP locali.",
    iconName: "cpu",
    skills: [
      { name: "RAG Architectures", level: 85, isCore: true },
      { name: "Model Context Protocol (MCP)", level: 80, isCore: true },
      { name: "Local LLM Deploy (LM Studio)", level: 82, isCore: false },
      { name: "Prompt Engineering", level: 90, isCore: true }
    ]
  }
];

export const TIMELINE_DATA: TimelineItem[] = [
  {
    id: "icsone",
    role: "Full-Stack Developer",
    institution: "Icsone (Azienda IT)",
    location: "Salento, Italia",
    period: "2023 - Presente",
    isEducation: false,
    description: "Incaricato dello sviluppo di applicativi proprietari avanzati. Gestisco l'integrazione di flussi operativi automatizzati, migrazioni complesse di server e la modernizzazione delle interfacce. Lavoro continuativamente in metodologia Agile all'interno di un team organico.",
    achievements: [
      "Responsabile unico per l'orchestrazione dello stack di automazione n8n.",
      "Refactoring dell'interfaccia di molteplici gestionali riducendo significativamente il tempo di caricamento ed incrementando l'esperienza utente.",
      "Progettazione di sistemi di intelligence integrando modelli AI (RAG)."
    ],
    tags: ["Spring Boot", "Yii2 PHP", "n8n", "Docker", "DevOps"]
  },
  {
    id: "unisalento",
    role: "Studente in Ingegneria Informatica",
    institution: "Università del Salento (UniSalento)",
    location: "Lecce, Italia",
    period: "2024 - 2027 (Previsto, 2° Anno in Corso)",
    isEducation: true,
    description: "Studio accademico approfondito focalizzato su algoritmi e strutture dati, calcolo numerico, architetture hardware dei sistemi d'elaborazione, basi di dati relazionali, reti e fondamenti di fisica ed elettronica.",
    achievements: [
      "Media accademica eccellente coniugando lo studio a tempo pieno con la professione di sviluppatore.",
      "Approfondimenti pratici sui sistemi distribuiti e logica dell'informazione applicata."
    ],
    tags: ["Algoritmi", "Architetture S.O.", "Calcolo Scientifico", "Sistemi Operativi"]
  }
];
