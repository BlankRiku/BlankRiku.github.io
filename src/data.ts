import { Project, SkillGroup, TimelineItem } from "./types";

const PROJECTS_DATA_RAW: Project[] = [
  {
    id: "rag-assistant",
    title: "Assistente AI Aziendale (RAG)",
    shortDescription: "Architettura Retrieval-Augmented Generation per supportare l'ecosistema aziendale e gestire in automatico email e flussi dati.",
    fullDescription: "Sviluppo avanzato della struttura core per un sistema di assistenza aziendale intelligente basato su Large Language Models (LLM), noto internamente come progetto Geppo. L'applicazione sfrutta tecniche RAG (Retrieval-Augmented Generation) per connettere la conoscenza interna securizzata con modelli di intelligenza artificiale. Il core è realizzato come flotta di microservizi Flask (main, mqtt, import, audit) che orchestrano molteplici provider LLM (Gemini, Anthropic, OpenAI, DeepSeek, Qwen) con streaming SSE e generazione/editing immagini, mentre il recupero documentale combina ricerca vettoriale su ChromaDB con ranking lessicale BM25 e un reranker pesato per dominio. La piattaforma espone inoltre un catalogo di servizi di sincronizzazione e ingestion file (Google Drive, web crawling e fogli Excel), la selezione di preset configurabili, la gestione delle voci e servizi IVR per l'assistenza telefonica.",
    category: "ai",
    tags: ["AI", "RAG", "LLM", "Google Drive API", "Web Crawling", "Excel", "IVR", "Node.js", "Python", "Flask", "ChromaDB", "BM25"],
    accentColor: "cyan-500",
    achievements: [
      "Ideazione e sviluppo dell'architettura core di indexing e retrieval documentale.",
      "Integrazione di un sistema potenziato dall'intelligenza artificiale per il parsing, la classificazione e la risposta automatizzata alle email aziendali.",
      "Implementazione di flussi di sincronizzazione massiva (batch-import) tramite web crawler appositamente realizzati e connettori cloud per cartelle Google Drive condivise.",
      "Ingestion multi-sorgente: sincronizzazione Google Drive, web crawling e import di fogli Excel nel knowledge base RAG.",
      "Selezione di preset configurabili, gestione delle voci e servizi IVR per l'assistenza vocale e telefonica.",
      "Evoluzione del core a microservizi Flask con orchestrazione multi-LLM, ricerca ibrida (ChromaDB + BM25) e audit logging centralizzato."
    ],
    metrics: [
      { label: "Documenti indicizzati", value: "50.000+" },
      { label: "Provider LLM", value: "5" }
    ]
  },
  {
    id: "geppo-voice-chat",
    title: "Geppo Voice Chat (STT/TTS)",
    shortDescription: "Interfaccia conversazionale mobile-first con riconoscimento e sintesi vocale, multilingua e rinnovo sessione trasparente.",
    fullDescription: "Frontend Angular 20 basato su signals per l'assistente aziendale, progettato per un uso mobile-first tramite semplice scansione di un QR code. Gestisce l'input vocale (Speech-to-Text) con visualizzazione dello spettro audio e la risposta parlata (Text-to-Speech), con selettore multilingua alimentato dal backend e workaround specifici per iOS.",
    category: "ai",
    tags: ["Angular 20", "Signals", "Web Speech API", "TTS", "STT", "Mobile-first"],
    accentColor: "cyan-400",
    achievements: [
      "Ciclo voce completo (registrazione, trascrizione, riproduzione) con Web Audio API e visualizzazione del segnale.",
      "Workaround iOS documentati per lo sblocco del TTS e per viewport/safe-area.",
      "Rinnovo sessione automatico e trasparente al timeout, con caching delle lingue disponibili."
    ]
  },
  {
    id: "ceposto-platform",
    title: "CePosto Platform",
    shortDescription: "Creazione e manutenzione avanzata del sistema SaaS leader per la prenotazione online di appuntamenti e la gestione delle code.",
    fullDescription: "Sviluppo ordinario ed evolutivo sull'ecosistema SaaS di CePosto (www.ceposto.it). La piattaforma è utilizzata ampiamente da Comuni, Pubbliche Amministrazioni, studi professionali ed aziende per la prenotazione online di appuntamenti flessibili, la pianificazione degli slot orari e l'eliminazione delle code, con integrazione nativa per App mobile iOS/Android e portali web.",
    category: "web",
    tags: ["SaaS", "Yii2 PHP", "MariaDB", "REST APIs", "Booking Engine", "Web App"],
    accentColor: "cyan-400",
    achievements: [
      "Ingegnerizzazione di logiche calendarizzanti complesse con gestione flessibile di eccezioni, ricorrenze e disponibilità degli operatori.",
      "Sviluppo di backend API e ottimizzazione delle tabelle MariaDB ad alto traffico, riducendo i tempi di restituzione degli slot orari.",
      "Coordinamento e manutenzione dei servizi server di interfacciamento con le app mobili native per la cittadinanza."
    ],
    metrics: [
      { label: "Prenotazioni totali", value: "3M+" },
      { label: "Utenti/mese", value: "50k+" },
      { label: "Attività gestite", value: "400+" }
    ]
  },
  {
    id: "todo-workflow",
    title: "ToDo (Enterprise Workflow Manager)",
    shortDescription: "Applicativo Angular e Spring Boot aziendale per la gestione completa di sprint, bug, integrazione Git e CRM d'assistenza.",
    fullDescription: "Ingegnerizzazione completa e manutenzione di ToDo, un sistema integrato di Task & Sprint Management ispirato a Jira per governare l'intero ciclo del codice. Dalla segnalazione del bug del cliente alla creazione automatizzata dei branch git corrispondenti. Gestisce inoltre la contrattualizzazione commerciale e un helpdesk per connettere ticket tecnici e contatti clienti. Con il tempo è evoluto in una piattaforma aziendale più ampia, integrando KPI e metriche commerciali e la gestione delle ore lavorative dei dipendenti. Distribuito sia come app desktop Electron sia come PWA installabile.",
    category: "web",
    tags: ["Angular 20", "Spring Boot", "Electron", "PWA", "NgRx", "Git Hooks", "CRM"],
    accentColor: "indigo-500",
    achievements: [
      "Integrazione profonda con le API di Git per l'auto-creazione automatica dei branch di lavoro partendo dalla segnalazione sul task manager.",
      "Sviluppo del motore di transizione degli stati del bug tracking per disciplinare metodicamente il flusso (Bug -> Development -> Code Review -> QA -> Deploy).",
      "Evoluzione in piattaforma aziendale con CRM, KPI/metriche commerciali e gestione delle ore lavorative, con doppio target desktop (Electron) e mobile (PWA)."
    ],
    metrics: [
      { label: "Ticket gestiti/anno", value: "15.000+" }
    ]
  },
  {
    id: "monitor-accettazione",
    title: "Monitor Accettazione (Realtime Kiosk)",
    shortDescription: "Display di coda in tempo reale per sale d'attesa, con aggiornamenti MQTT e annuncio vocale su Raspberry Pi.",
    fullDescription: "Applicazione Angular standalone che mostra in tempo reale la coda di prenotazione su schermi, reception e Raspberry Pi in modalità kiosk. Tre modalità operative (Desk, Sala, Mobile) selezionate dai query parameter, aggiornamenti push via MQTT over WebSocket, text-to-speech e temi grafici configurati lato server.",
    category: "web",
    tags: ["Angular 18", "MQTT", "WebSocket", "Kiosk", "Raspberry Pi", "TTS"],
    accentColor: "cyan-400",
    achievements: [
      "Tre modalità operative con routing condizionale basato sui parametri di accesso.",
      "Aggiornamento realtime via MQTT/WSS con filtro servizi e sportelli applicato sia su HTTP sia sui messaggi push.",
      "Annuncio vocale con servizio TTS esterno su Raspberry Pi e autostart kiosk (LXDE e Wayland)."
    ]
  },
  {
    id: "survey-platform",
    title: "Survey & Customer Satisfaction",
    shortDescription: "Piattaforma Angular per questionari e customer satisfaction con cinque modalità di erogazione.",
    fullDescription: "Frontend Angular per la somministrazione e la consultazione di questionari e customer satisfaction. Supporta la compilazione live associata a una prenotazione, la revisione delle risposte con tre livelli di esito, l'anteprima del questionario, l'erogazione su tablet di sportello via MQTT e l'inserimento manuale del ticket.",
    category: "web",
    tags: ["Angular", "Survey Engine", "MQTT", "Video Embed", "Multi-canale"],
    accentColor: "indigo-500",
    achievements: [
      "Motore di review con tre modalità di visualizzazione dell'esito (neutro, esito, soluzioni).",
      "Somministrazione su tablet di sportello tramite configurazione MQTT in tempo reale.",
      "Supporto multi-canale (email, sportello, custom) con validazione tramite hash di sicurezza."
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
      { label: "Team member coordinati", value: "4 persone" },
      { label: "Tempo di sviluppo", value: "36 ore" }
    ]
  },
  {
    id: "container-infrastructure",
    title: "Infrastruttura Docker & Reverse Proxy",
    shortDescription: "Containerizzazione e pubblicazione di un ecosistema multi-dominio con reverse proxy Nginx e Portainer.",
    fullDescription: "Progettazione e manutenzione dell'infrastruttura containerizzata che ospita l'intero ecosistema CePosto: decine di applicazioni (test, playground, BDI, survey, monitor, n8n, xotp) pubblicate su domini dedicati dietro un reverse proxy Nginx, con stack docker-compose replicabili e procedure di aggiornamento codice/database senza rebuild completo.",
    category: "devops",
    tags: ["Docker", "Docker Compose", "Nginx", "Reverse Proxy", "Portainer", "Rocky Linux"],
    accentColor: "emerald-500",
    achievements: [
      "Gestione di decine di puntamenti DNS e domini dietro un unico reverse proxy.",
      "Stack docker-compose replicabili per installazioni multiple e ambienti (test, collaudo BDI, produzione).",
      "Procedura di aggiornamento codice e database automatizzata, senza distruzione dei volumi persistenti."
    ]
  },
  {
    id: "sempliswitch",
    title: "SempliSwitch Backend",
    shortDescription: "Backend Spring Boot per il dominio switch/finanziario, deployato su Kubernetes con documentazione API Swagger.",
    fullDescription: "Backend dell'applicativo SempliSwitch: API REST documentate via Swagger/OpenAPI, gestione di contratti, offerte e provvigioni, e snapshot di stato ottimizzati per grandi volumi. Il progetto include la containerizzazione e l'orchestrazione su cluster Kubernetes/k3s con manuale operativo dedicato.",
    category: "devops",
    tags: ["Spring Boot", "Java", "Kubernetes", "k3s", "Swagger", "Docker"],
    accentColor: "emerald-500",
    achievements: [
      "Definizione di contratti API e permessi documentati con report dedicato.",
      "Ottimizzazione tecnica degli snapshot di stato per grandi volumi di dati.",
      "Deploy orchestrato su Kubernetes/k3s con stack e manuale operativo."
    ]
  },
  {
    id: "email-mqtt-bridge",
    title: "Email–MQTT Bridge (AIMAP)",
    shortDescription: "App desktop Electron che collega caselle IMAP/SMTP a MQTT e a un backend AI per l'automazione delle email.",
    fullDescription: "Applicazione desktop Electron (main process TypeScript + UI Angular) che monitora una casella IMAP in tempo reale via IDLE ed elabora in batch le email già presenti. Ogni email viene inviata a un'API AI che restituisce comandi eseguiti dal bridge (spostamento email, invio risposte), con comunicazione MQTT per stato e notifiche per dominio.",
    category: "devops",
    tags: ["Electron", "Angular", "IMAP", "SMTP", "MQTT", "AI Automation"],
    accentColor: "indigo-500",
    achievements: [
      "Elaborazione parallela batch e real-time con cartella di work-in-progress dedicata.",
      "Parser dei comandi restituiti dall'AI (MOVE, SEND) ed esecuzione sulle email.",
      "Bridge MQTT bidirezionale con pubblicazione di stato e notifiche per dominio."
    ]
  },
  {
    id: "ceposto-biz-app",
    title: "CePosto Biz App (Ionic)",
    shortDescription: "App mobile multipiattaforma per la gestione business di agende, servizi e operatori.",
    fullDescription: "Applicazione Ionic/Angular distribuita su iOS, Android e web tramite Capacitor, pensata per la gestione operativa e business della piattaforma CePosto. Integra componenti PrimeNG, mappe Leaflet, grafici Chart.js/D3, gestione stato con Akita, comunicazione realtime via MQTT e supporto multi-lingua.",
    category: "mobile",
    tags: ["Ionic", "Angular", "Capacitor", "PrimeNG", "Leaflet", "Akita", "MQTT"],
    accentColor: "indigo-500",
    achievements: [
      "Distribuzione multipiattaforma (iOS/Android/Web) da un'unica codebase Angular.",
      "Integrazione di mappe interattive, grafici e componenti UI enterprise.",
      "Sincronizzazione realtime e gestione stato reattiva con Akita."
    ]
  }
];

// Ordine di rilevanza: prima i progetti più grandi e complessi.
const PROJECT_PRIORITY = [
  "ceposto-platform",
  "rag-assistant",
  "gender-hack-2026",
  "todo-workflow",
  "container-infrastructure",
  "sempliswitch",
  "email-mqtt-bridge",
  "monitor-accettazione",
  "survey-platform",
  "ceposto-biz-app",
  "geppo-voice-chat"
];

export const PROJECTS_DATA: Project[] = [...PROJECTS_DATA_RAW].sort(
  (a, b) => PROJECT_PRIORITY.indexOf(a.id) - PROJECT_PRIORITY.indexOf(b.id)
);

export const SKILLS_DATA: SkillGroup[] = [
  {
    category: "Backend & Database",
    description: "Creazione di logiche reattive, strutturazione dati e ottimizzazione queries.",
    iconName: "server",
    skills: [
      { name: "Spring Boot (Java)", level: 88, isCore: true },
      { name: "PHP / Yii2", level: 85, isCore: true },
      { name: "MariaDB / MySQL", level: 90, isCore: true },
      { name: "Node.js / Express", level: 82, isCore: false }
    ]
  },
  {
    category: "Frontend & Mobile",
    description: "Sviluppo di interfacce interattive moderne, scalabili e mobile-ready.",
    iconName: "layout",
    skills: [
      { name: "Angular", level: 85, isCore: true },
      { name: "Ionic / Capacitor", level: 82, isCore: true },
      { name: "HTML5 & CSS3 / Tailwind", level: 95, isCore: true },
      { name: "Electron (Desktop)", level: 80, isCore: false }
    ]
  },
  {
    category: "DevOps & Automation",
    description: "Amministrazione di infrastrutture agili e automatizzate.",
    iconName: "terminal",
    skills: [
      { name: "Docker & Containerization", level: 88, isCore: true },
      { name: "n8n Workflow Automation", level: 92, isCore: true },
      { name: "Kubernetes / k3s", level: 78, isCore: false },
      { name: "Nginx & Reverse Proxy", level: 82, isCore: false },
      { name: "GitLab CI/CD Pipelines", level: 80, isCore: false }
    ]
  },
  {
    category: "AI & Data",
    description: "Architetture AI generative, pipeline dati e ricerca semantica.",
    iconName: "cpu",
    skills: [
      { name: "RAG Architectures", level: 85, isCore: true },
      { name: "Multi-LLM Orchestration", level: 82, isCore: true },
      { name: "Prompt Engineering", level: 90, isCore: true },
      { name: "Model Context Protocol (MCP)", level: 80, isCore: false },
      { name: "Vector DB (ChromaDB) / BM25", level: 78, isCore: false }
    ]
  },
  {
    category: "Realtime, IoT & Edge",
    description: "Sistemi distribuiti in tempo reale, integrazione MQTT e dispositivi edge.",
    iconName: "radio",
    skills: [
      { name: "MQTT & Broker", level: 88, isCore: true },
      { name: "WebSocket / SSE", level: 82, isCore: true },
      { name: "Raspberry Pi / Kiosk", level: 80, isCore: false },
      { name: "Web Speech (TTS/STT)", level: 82, isCore: false },
      { name: "Python (Data & Monitoring)", level: 80, isCore: false }
    ]
  }
];

export const TIMELINE_DATA: TimelineItem[] = [
  {
    id: "icsone",
    role: "Software Engineer (Full-Stack & AI)",
    institution: "Icsone (Azienda IT)",
    location: "Salento, Italia",
    period: "2023 - Presente",
    isEducation: false,
    description: "Progetto e sviluppo di applicativi proprietari su tutto lo spettro del software: dal backend al frontend, dall'AI all'infrastruttura. Mi occupo di architetture AI (RAG multi-provider), integrazione di sistemi realtime/IoT via MQTT, containerizzazione e pubblicazione multi-dominio, oltre allo sviluppo di app mobile e desktop. Lavoro continuativamente in metodologia Agile all'interno di un team organico.",
    achievements: [
      "Co-responsabile dell'infrastruttura containerizzata (Docker, Nginx, Portainer) e delle migrazioni a zero downtime.",
      "Sviluppo del cuore AI aziendale: microservizi RAG multi-provider con ricerca ibrida vettoriale/BM25.",
      "Realizzazione di applicativi realtime/IoT (monitor e totem) e di app mobile (Ionic) e desktop (Electron)."
    ],
    tags: ["Spring Boot", "Angular", "Python/Flask", "Docker", "MQTT", "RAG"]
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
