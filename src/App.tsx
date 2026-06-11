import React, { useState, useEffect, useRef } from "react";
import { 
  Server, 
  Layout, 
  Terminal, 
  Cpu, 
  BookOpen, 
  Briefcase, 
  Mail, 
  Github, 
  Linkedin, 
  ExternalLink, 
  Command, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  X, 
  FileText, 
  Database, 
  Code,
  ArrowRight,
  Phone,
  Compass,
  Award,
  ArrowUpRight,
  GraduationCap,
  Play,
  RefreshCw,
  GitBranch,
  Bell,
  Activity,
  Check,
  Plus,
  Minus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PROJECTS_DATA, SKILLS_DATA, TIMELINE_DATA } from "./data";
import { Project, SkillGroup, TimelineItem, ChatMessage, TerminalEntry } from "./types";

export default function App() {
  const [activeTab, setActiveTab ] = useState<"ai" | "devops" | "web" | "all">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Interactive Terminal State
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([
    {
      input: "welcome",
      output: "Benvenuto nel terminale di Alexandro Tornese.\nDigita 'help' per visualizzare i comandi disponibili per esplorare il mio CV.\nScrivi 'ai' per avviare l'assistente virtuale integrato.",
      timestamp: new Date().toLocaleTimeString(),
      dir: "~"
    }
  ]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const [terminalTheme, setTerminalTheme] = useState<"dark" | "matrix" | "nord">("dark");

  // Pipeline / Automation Simulator Settings
  const [selectedRecipe, setSelectedRecipe] = useState<"ai-triage" | "ceposto-cache" | "todo-git-sync">("ai-triage");
  const [pipelineStep, setPipelineStep] = useState<number>(-1);
  const [pipelineRunning, setPipelineRunning] = useState<boolean>(false);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);

  const RECIPES_DATA = {
    "ai-triage": {
      title: "AI Triage & Helpdesk Sync (RAG + AI)",
      description: "Classificazione avanzata ed instradamento dei ticket d'assistenza con RAG ed AI.",
      nodes: [
        { id: "trigger", label: "Webhook Mail", desc: "Arrivo nuova mail" },
        { id: "rag", label: "Vettoriale RAG", desc: "Lookup Embedding" },
        { id: "gemini", label: "Gemini 3.5 Flash", desc: "Classifica & Bozza reply" },
        { id: "todo", label: "SaaS ToDo Ticket", desc: "Generazione Task" }
      ],
      logs: [
        "In attesa del trigger... Rilevato webhook per evento email di supporto entrante.",
        "Lookup eseguito su database vettoriale per allineamento risposte FAQ e doc.",
        "Analisi semantica e generazione bozza con Gemini 3.5 Flash completata (Confidenza al 98%).",
        "Creato ticket correlato nell'applicativo ToDo e allineato canale helpdesk."
      ]
    },
    "ceposto-cache": {
      title: "CePosto Smart Buffer Engine (www.ceposto.it)",
      description: "Sincronia real-time ed ottimizzazione delle code e delle prenotazioni.",
      nodes: [
        { id: "trigger", label: "Cron Trigger", desc: "Schedulazione slot" },
        { id: "pg", label: "Postgres Optimizer", desc: "Ricerca slot liberi" },
        { id: "redis", label: "Redis Caching", desc: "Write-back memory pool" },
        { id: "app", label: "App Webhook", desc: "Notifiche native" }
      ],
      logs: [
        "Trigger orario scattato. Avvio sincronizzazione agende multisito.",
        "Eseguite query ad alte prestazioni su Postgres: calcolati i binari degli slot operatore.",
        "Salvati ed ottimizzati gli slot aggregati in Redis (+35% velocità caricamento sito).",
        "Dispacciata notifica di allineamento e push broadcast a 100k+ dispositivi mobile."
      ]
    },
    "todo-git-sync": {
      title: "ToDo Enterprise Git-to-Jira Workflow",
      description: "Auto-branching git automatico orchestrato dalle transizioni ticket di ToDo.",
      nodes: [
        { id: "trigger", label: "Apertura Bug", desc: "Nuova segnalazione" },
        { id: "spring", label: "Spring Boot Core", desc: "Transition Sprint engine" },
        { id: "git", label: "GitLab Hooks", desc: "Creazione branch Git" },
        { id: "notify", label: "DevOps Notice", desc: "Log sul canale d'assistenza" }
      ],
      logs: [
        "Bug prioritario 'Err#404 login' convalidato dal lead sul pannello ToDo.",
        "Modulo Spring Boot avvia la transition di stato in 'In Sviluppo' e alloca lo sprint.",
        "Invocate API GitLab remote: branch 'fix/todo-err404-login' creato da master con successo.",
        "Log del branch archiviato, avviato container di sandbox e inoltrata notifica Slack Team."
      ]
    }
  };

  const handleRunPipeline = () => {
    if (pipelineRunning) return;
    setPipelineRunning(true);
    setPipelineStep(0);
    setPipelineLogs([]);

    const recipe = RECIPES_DATA[selectedRecipe];
    let currentStep = 0;
    
    // Initial start log
    setPipelineLogs([`[${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}] ⚡ Inizializzazione pipeline per '${recipe.title}'...`]);

    const interval = setInterval(() => {
      const activeNode = recipe.nodes?.[currentStep];
      if (activeNode && currentStep < recipe.nodes.length) {
        setPipelineStep(currentStep);
        setPipelineLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}] ▶ [NODE_${currentStep + 1}] (${activeNode.label || 'Task'}): ${recipe.logs?.[currentStep] || 'Operazione in corso...'}`
        ]);
        currentStep++;
      } else {
        clearInterval(interval);
        setPipelineStep(-1);
        setPipelineRunning(false);
        setPipelineLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}] ✔ Pipeline eseguita con successo! Stato allineato in produzione (0.0 downtime).`
        ]);
      }
    }, 1300);
  };

  // DevOps Cluster Sandbox Simulator State
  const [clusterServices, setClusterServices] = useState([
    { id: "web", name: "docker:web-srv", label: "Web Portal (Nginx Proxy)", replicas: 2, max: 5, type: "container", color: "cyan" },
    { id: "core", name: "jvm:spring-core", label: "Spring Core (Java Engine)", replicas: 1, max: 4, type: "jvm", color: "indigo" },
    { id: "db", name: "pg:postgres-db", label: "Postgres Database", replicas: 1, max: 2, type: "db", color: "emerald" }
  ]);
  const [trafficScale, setTrafficScale] = useState<"idle" | "normal" | "surge">("normal");
  
  // Custom, ultra-responsive lightweight data stream history for SVG Chart (8 coordinates)
  const [customChartHistory, setCustomChartHistory] = useState<number[]>([15, 25, 42, 35, 50, 45, 62, 58]);
  const [clusterLogsList, setClusterLogsList] = useState<string[]>([
    "CLUSTER_INIT: Kubernetes orchestrator green light.",
    "SERVICE_DISCOVERY: web-srv attached on WAN port :3000.",
    "JVM_BOOT: spring-core instance active (256MB heap pool initialized).",
    "DB_CONNECT: Postgres master node connection pool established successfully."
  ]);
  const devopsLogsRef = useRef<HTMLDivElement>(null);

  // User contact form state
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-scroll for terminal inside their respective overflow containers
  useEffect(() => {
    if (terminalBottomRef.current) {
      const container = terminalBottomRef.current.parentElement;
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }
    }
  }, [terminalHistory]);

  // Infinite, organic live stream ticker for DevOps Sandbox Console
  useEffect(() => {
    const handleDevOpsTick = () => {
      // Calculate current performance variables based on configuration
      const webCount = clusterServices.find(s => s.id === "web")?.replicas || 1;
      const coreCount = clusterServices.find(s => s.id === "core")?.replicas || 1;
      const dbCount = clusterServices.find(s => s.id === "db")?.replicas || 1;

      let baseVal = 40;
      if (trafficScale === "idle") baseVal = 12;
      if (trafficScale === "surge") baseVal = 85;

      // Real formula where scaling actually resolves workload stress!
      const loadFactor = Math.max(8, baseVal - (webCount * 4 + coreCount * 6 + dbCount * 3));
      const actualLoad = Math.min(99, Math.round(loadFactor + Math.random() * 8));

      // Append new data to SVG coordinates and shift
      setCustomChartHistory(prev => {
        const next = [...prev.slice(1), actualLoad];
        return next;
      });

      // Spawn random organic live system log entry
      const timestamps = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const prefixes = ["INF", "DEB", "INF", "WRN", "INF"];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      
      let logBody = "";
      const randomMsg = Math.random();
      if (trafficScale === "surge") {
        if (randomMsg < 0.3) {
          logBody = `TRAFFIC_SWEEP: Dispatching batch of ${Math.floor(180 + Math.random() * 200)} rest-payloads to spring-core cluster.`;
        } else if (randomMsg < 0.6) {
          logBody = `REPL_HEALTH: Core health check response: 200 OK (latency: ${Math.floor(40 + Math.random() * 110)}ms).`;
        } else {
          logBody = actualLoad > 75 
            ? `SYS_PRESSURE: HIGH WORKLOAD detected (${actualLoad}% cluster load). Scaling spring-core core recommended!`
            : `SYS_BALANCED: Server load stabilized under surge due to active scaling pools.`;
        }
      } else if (trafficScale === "idle") {
        if (randomMsg < 0.5) logBody = `IDLE: System idling. DB ping loop: postgres-db responding in 1.4ms.`;
        else logBody = `CRON_SCHEDULED: n8n checking scheduled queue. No pending tasks found containing 'ceposto-sync'.`;
      } else {
        if (randomMsg < 0.25) logBody = `HTTP_GATEWAY: GET /api/v1/workforce - 200 OK (7.2ms via cache-hit).`;
        else if (randomMsg < 0.5) logBody = `REDIS_CACHE: CePosto buffer hit - bypassed SQL lookup for slot calendar.`;
        else if (randomMsg < 0.75) logBody = `JOB_DAEMON: n8n pipeline completed workflow: 'To-Do GitLab AutoBrancher'.`;
        else logBody = `POSTGRES_POOL: Active connections model: ${Math.floor(1 + Math.random() * 3)} active / 10 idle.`;
      }

      setClusterLogsList(prev => {
        const next = [...prev, `[${timestamps}] [${prefix}] ${logBody}`];
        if (next.length > 20) return next.slice(next.length - 20);
        return next;
      });
    };

    const interval = setInterval(handleDevOpsTick, 2800);
    return () => clearInterval(interval);
  }, [clusterServices, trafficScale]);

  // Auto-scroll for DevOps Console Logs
  useEffect(() => {
    if (devopsLogsRef.current) {
      devopsLogsRef.current.scrollTo({ top: devopsLogsRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [clusterLogsList]);

  // Terminal command executor
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = terminalInput.trim().toLowerCase();
    if (!cleanInput) return;

    let output = "";
    
    switch (cleanInput) {
      case "help":
        output = "Comandi supportati:\n" +
                 "  about       - Breve introduzione su Alexandro\n" +
                 "  skills      - Visualizza il tech stack completo\n" +
                 "  projects    - Mostra i progetti in evidenza\n" +
                 "  experience  - Esperienze professionali e formazione scolastica\n" +
                 "  contact     - Informazioni di contatto dirette\n" +
                 "  theme       - Cambia aspetto del terminale (theme matrix / theme nord / theme dark)\n" +
                 "  mcp         - Esegui una simulazione di query via Model Context Protocol (MCP)\n" +
                 "  clear       - Pulisce lo schermo\n" +
                 "  ai          - Spiega come funziona l'assistente virtuale integrato";
        break;
      case "about":
        output = "Alexandro Tornese - Sviluppatore Full-Stack con circa 3 anni di esperienza nell'IT.\n" +
                 "Attualmente lavora presso Icsone su applicativi aziendali complessi ed automazioni di sistema,\n" +
                 "e contemporaneamente frequenta il secondo anno di Ingegneria Informatica all'Università del Salento.\n" +
                 "I suoi principali ambiti d'interesse sono il DevOps, lo sviluppo Backend robusto e le architetture AI generative (RAG).";
        break;
      case "skills":
        output = "TECH STACK PRINCIPALE:\n" +
                 "--------------------------------------------------\n" +
                 "  Backend:  Spring Boot (Java), PHP (Yii2)\n" +
                 "  Database: MariaDB, PostgreSQL, MySQL\n" +
                 "  Frontend: Angular, Ionic, TypeScript, Tailwind CSS\n" +
                 "  DevOps:   Docker, Portainer, GitLab CI/CD, n8n Automation\n" +
                 "  AI:       RAG Architectures, MCP (Model Context Protocol), Local LLMs";
        break;
      case "projects":
        output = "PROGETTI CHIAVE:\n" +
                 "--------------------------------------------------\n" +
                 "1. Assistente AI Aziendale (RAG)\n" +
                 "   Core engine per indicizzazione documentale, lettura email e web crawling.\n\n" +
                 "2. CePosto Platform (www.ceposto.it)\n" +
                 "   Ottimizzazione, sviluppo evolutivo e manutenzione dell'ecosistema SaaS di prenotazione online e agende digitali.\n\n" +
                 "3. ToDo (Enterprise Workflows)\n" +
                 "   Task & Sprint manager Angular/Spring Boot sul modello Jira con integrazione git, CRM commerciale ed helpdesk.\n\n" +
                 "4. Gender Hack 2026 - 1° Classificato\n" +
                 "   Piattaforma 'Mind the Gap' per l'equità salariale, vincitrice nazionale.\n\n" +
                 "5. Server & n8n Automation\n" +
                 "   Migrazione a zero downtime di 45+ workflow strategici aziendali con Portainer.";
        break;
      case "experience":
        output = "PERCORSO PROFESSIONALE & ACCADEMICO:\n" +
                 "--------------------------------------------------\n" +
                 "💼 Full-Stack Developer | Icsone (2023 - Presente)\n" +
                 "   - Orchestrazione flussi e automazione con n8n.\n" +
                 "   - Sviluppo moduli RAG per automatizzare gestione mail e drive aziendale.\n\n" +
                 "🎓 Ingegneria Informatica (2° Anno) | UniSalento (2024 - In corso)\n" +
                 "   - Metodologie ingegneristiche applicate ed algoritmi fondamentali.";
        break;
      case "contact":
        output = "E-mail: alexandro4317@gmail.com\n" +
                 "Sito web: Puoi usare il modulo di contatto in fondo alla pagina per connetterti!";
        break;
      case "mcp":
        output = "MCP SIMULATION:\n" +
                 "L'AI invia una query protocollata MCP al database aziendale...\n" +
                 "Exec: maria_db->select_skills_by_mastery()\n" +
                 "Risultati recuperati via Model Context Protocol:\n" +
                 "  - { n8n_automation: 92%, status: 'Core Mastery' }\n" +
                 "  - { spring_boot: 88%, status: 'Core Mastery' }\n" +
                 "  - { docker_containers: 88%, status: 'Advanced' }";
        break;
      case "theme dark":
        setTerminalTheme("dark");
        output = "Tema terminale impostato su Dark Charcoal.";
        break;
      case "theme matrix":
        setTerminalTheme("matrix");
        output = "Tema terminale impostato su Cyber Matrix. Svegliati, Neo...";
        break;
      case "theme nord":
        setTerminalTheme("nord");
        output = "Tema terminale impostato su Frost Nord.";
        break;
      case "clear":
        setTerminalHistory([]);
        setTerminalInput("");
        return;
      case "ai":
        output = "L'assistente virtuale AT-AI è posizionato sulla destra dello schermo.\n" +
                 "Utilizza un server Express + SDK @google/genai con modello gemini-3.5-flash.\n" +
                 "Il modello è istruito con il contesto dettagliato sul curriculum di Alexandro.";
        break;
      default:
        // Check for theme shortcuts
        if (cleanInput.startsWith("theme ")) {
          const requestedTheme = cleanInput.replace("theme ", "").trim();
          if (requestedTheme === "matrix" || requestedTheme === "nord" || requestedTheme === "dark") {
            setTerminalTheme(requestedTheme as "matrix" | "nord" | "dark");
            output = `Tema modificato con successo: ${requestedTheme}`;
          } else {
            output = `Tema "${requestedTheme}" non riconosciuto. Usa: dark, matrix, nord.`;
          }
        } else {
          output = `Comando naturale non riconosciuto: "${cleanInput}".\nScrivi 'help' per consultare la lista dei comandi validi.`;
        }
    }

    setTerminalHistory(prev => [...prev, {
      input: terminalInput,
      output,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      dir: "~"
    }]);
    setTerminalInput("");
  };

  // Handle DevOps Replica Scaling Actions
  const scaleService = (id: string, dir: "up" | "down") => {
    setClusterServices(prev => prev.map(srv => {
      if (srv.id === id) {
        let newReplicas = srv.replicas;
        if (dir === "up" && srv.replicas < srv.max) newReplicas += 1;
        if (dir === "down" && srv.replicas > 1) newReplicas -= 1;
        
        if (newReplicas !== srv.replicas) {
          // Log the scaling event organically
          const timestamps = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
          setClusterLogsList(l => [
            ...l,
            `[${timestamps}] [INF] SCALING_EVENT: Scaled service '${srv.name}' to ${newReplicas} replicas.`
          ]);
        }
        return { ...srv, replicas: newReplicas };
      }
      return srv;
    }));
  };

  const setTrafficProfile = (mode: "idle" | "normal" | "surge") => {
    setTrafficScale(mode);
    const timestamps = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const profileLogs = {
      idle: "TRAFFIC_MODE_SET: Quiescent System Profile loaded. Minimizing computing resource demand.",
      normal: "TRAFFIC_MODE_SET: Standard Multi-User Web Traffic profile dispatched. Balanced limits.",
      surge: "TRAFFIC_MODE_SET: SURGE TRAFFIC wave enabled! Simulating concurrent request storm."
    };
    setClusterLogsList(l => [...l, `[${timestamps}] [WRN] ${profileLogs[mode]}`]);
  };

  // Contact form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setIsSubmitting(true);
    
    // Simulate API storing the message
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
    }, 1500);
  };

  const filteredProjects = activeTab === "all" 
    ? PROJECTS_DATA 
    : PROJECTS_DATA.filter(p => p.category === activeTab);

  // Helper for terminal styling classes
  const getTerminalColors = () => {
    switch (terminalTheme) {
      case "matrix":
        return {
          bg: "bg-black border-green-900/60 shadow-green-950/20",
          text: "text-green-400 font-mono text-sm selection:bg-green-900 selection:text-white",
          inputBg: "bg-transparent text-green-300 outline-none border-none font-mono",
          prompt: "text-green-500 font-bold",
          headerBg: "bg-green-950/30 border-green-900/40 text-green-400",
          dots: "bg-green-900"
        };
      case "nord":
        return {
          bg: "bg-slate-900 border-sky-900/40 shadow-sky-950/20",
          text: "text-slate-200 font-mono text-sm selection:bg-sky-800 selection:text-white",
          inputBg: "bg-transparent text-sky-200 outline-none border-none font-mono",
          prompt: "text-cyan-400 font-bold",
          headerBg: "bg-slate-800/40 border-sky-950/40 text-slate-300",
          dots: "bg-sky-800"
        };
      default:
        return {
          bg: "bg-zinc-950 border-zinc-800/80 shadow-black/40",
          text: "text-zinc-300 font-mono text-sm selection:bg-zinc-800 selection:text-white",
          inputBg: "bg-transparent text-zinc-100 outline-none border-none font-mono",
          prompt: "text-indigo-400 font-bold",
          headerBg: "bg-zinc-900/80 border-zinc-800/60 text-zinc-400",
          dots: "bg-zinc-800"
        };
    }
  };

  const currentTerminalClass = getTerminalColors();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/35 selection:text-white overflow-x-hidden antialiased">
      
      {/* Decorative ambient gradients matching the theme */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[550px] bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[800px] right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-[1600px] left-10 w-[500px] h-[500px] bg-cyan-900/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[400px] right-20 w-[450px] h-[450px] bg-blue-950/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Modern Navigation Header matching theme */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-slate-950">AT</div>
            <div>
              <span className="text-white font-semibold text-base tracking-tight block">Alexandro Tornese</span>
              <span className="text-[10px] text-cyan-400 font-mono tracking-wider block uppercase">Full Stack Developer</span>
            </div>
          </div>
          
          <div className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-widest text-slate-500 items-center">
            <a href="#about-section" className="hover:text-white transition-colors cursor-pointer">Chi Sono</a>
            <a href="#skills-section" className="hover:text-white transition-colors cursor-pointer">Competenze</a>
            <a href="#timeline-section" className="hover:text-white transition-colors cursor-pointer">Esperienza</a>
            <a href="#projects-section" className="text-cyan-400 border-b border-cyan-400 pb-0.5">Progetti</a>
            <a href="#terminal-section" className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-mono">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" /> console_cv
            </a>
          </div>

          <div>
            <a 
              href="#contact-section" 
              className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/20 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-300"
            >
              Contatti
            </a>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-32 pb-20">

        {/* HERO SECTION / LANDING */}
        <section id="hero-section" className="py-12 lg:py-20 flex flex-col lg:flex-row gap-12 items-center justify-between">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-block px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-bold rounded-full uppercase tracking-tighter">
              Full Stack Developer & DevOps
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
              Costruisco <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">architetture</span> <br />
              digitali scalabili & eleganti.
            </h1>
            
            <p className="text-lg text-slate-400 leading-relaxed pr-0 lg:pr-10">
              Specializzato in architetture moderne, trasformo visioni complesse in prodotti performanti. Unisco il rigore accademico di <strong>Ingegneria Informatica</strong> (UniSalento) all'esperienza di sviluppo sul campo presso <strong>Icsone</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start pt-2">
              <a 
                href="#projects-section" 
                className="px-8 py-3 bg-white text-slate-950 font-bold rounded-xl hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20 transition-all flex items-center gap-2"
              >
                Guarda canali <ArrowRight className="w-4 h-4 text-slate-950" />
              </a>
              <a 
                href="#terminal-section" 
                className="px-8 py-3 bg-slate-900 border border-slate-800 text-white font-bold rounded-xl hover:border-slate-600 hover:text-cyan-400 transition-all flex items-center gap-2"
              >
                <Terminal className="w-4 h-4 text-cyan-400" /> console_cv
              </a>
            </div>
            
            {/* Quick stats panel */}
            <div className="grid grid-cols-3 gap-6 max-w-md pt-8 mx-auto lg:mx-0 border-t border-slate-900">
              <div>
                <p className="text-3xl font-extrabold text-white font-mono hover:text-cyan-400 transition-colors">3+</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Anni di codice</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white font-mono hover:text-cyan-400 transition-colors">1°</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Hackathon 2026</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white font-mono hover:text-cyan-400 transition-colors">45+</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Task n8n attivi</p>
              </div>
            </div>
          </div>

          {/* Core Feature: Combined Interactive Dashboard (DevOps Sandbox Control Center) */}
          <div className="flex-1 w-full max-w-xl lg:max-w-none">
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl relative">
              <div className="absolute top-0 right-0 p-8 pointer-events-none">
                <div className="w-24 h-24 bg-cyan-500/5 rounded-full blur-3xl"></div>
              </div>

              {/* Header with live network status */}
              <div className="px-5 py-4 border-b border-slate-900 flex justify-between items-center bg-slate-950/60">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                    trafficScale === "surge" ? "bg-amber-500" : "bg-emerald-400"
                  }`} />
                  <span className="text-xs font-mono font-bold text-slate-200 tracking-wider">DEV-SANDBOX: ACTIVE DEVOPS NODE</span>
                </div>
                <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1.5 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/20">
                  <Activity className="w-3 h-3 animate-pulse" /> Uptime: 99.9%
                </div>
              </div>

              {/* Grid content split: Interactive controls & SVG graphics metrics */}
              <div className="p-5 space-y-5">
                
                {/* Section A: Replica Instance Tuner Blocks */}
                <div className="space-y-3">
                  <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Orchestratore Sandbox Repliche</p>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    {clusterServices.map((srv) => (
                      <div key={srv.id} className="p-3 bg-slate-950/80 rounded-xl border border-slate-850 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              srv.color === "cyan" ? "bg-cyan-400" : srv.color === "indigo" ? "bg-indigo-400" : "bg-emerald-400"
                            }`} />
                            <span className="text-[10px] font-mono text-slate-400">/{srv.name}</span>
                          </div>
                          <span className="text-xs font-bold text-white block leading-tight">{srv.label}</span>
                        </div>

                        {/* Interactive Scale Controls */}
                        <div className="flex items-center gap-3">
                          {/* Live Container instance dot badges */}
                          <div className="flex gap-1 items-center shrink-0 mr-1.5">
                            {Array.from({ length: srv.max }).map((_, bIdx) => {
                              const isActiveInstance = bIdx < srv.replicas;
                              return (
                                <span 
                                  key={bIdx} 
                                  className={`w-2 h-2 rounded-full transition-all duration-350 ${
                                    isActiveInstance
                                      ? srv.color === "cyan" ? "bg-cyan-400 animate-pulse" : srv.color === "indigo" ? "bg-indigo-400 animate-pulse" : "bg-emerald-400"
                                      : "bg-slate-800"
                                  }`}
                                />
                              );
                            })}
                          </div>

                          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 shrink-0">
                            <button
                              onClick={() => scaleService(srv.id, "down")}
                              disabled={srv.replicas <= 1}
                              className="p-1 px-1.5 hover:bg-slate-850 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer text-xs"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono font-bold px-2 text-white shrink-0 min-w-[14px] text-center">
                              {srv.replicas}
                            </span>
                            <button
                              onClick={() => scaleService(srv.id, "up")}
                              disabled={srv.replicas >= srv.max}
                              className="p-1 px-1.5 hover:bg-slate-850 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer text-xs"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section B: Traffic wave scale toggle controllers & Dynamic SVG performance metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Traffic Modes Selector */}
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Simulatore Carico Traffico</p>
                    <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-850 h-[115px] flex flex-col justify-between">
                      <div className="text-[10px] text-slate-400 leading-relaxed font-mono">
                        Seleziona un profilo d'utenza per scatenare richieste artificiali al cluster:
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {(["idle", "normal", "surge"] as const).map((m) => (
                          <button
                            key={m}
                            onClick={() => setTrafficProfile(m)}
                            className={`p-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                              trafficScale === m
                                ? m === "surge"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                  : m === "idle"
                                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                                    : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                                : "bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-350"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SVG Chart Rendering area */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Cluster Workload (%)</span>
                      <span className="text-[10px] text-cyan-400 font-mono font-bold">
                        Avg: {Math.round(customChartHistory.reduce((a, b) => a + b, 0) / customChartHistory.length)}%
                      </span>
                    </div>

                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-850 h-[115px] relative overflow-hidden flex flex-col justify-between">
                      {/* Interactive responsive SVG coordinates graph */}
                      <div className="w-full h-16 relative">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="svgGradientGlow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                            </linearGradient>
                          </defs>

                          {/* Grid background lines */}
                          <line x1="0%" y1="25%" x2="100%" y2="25%" stroke="#1e293b" strokeDasharray="2,3" strokeWidth="1" />
                          <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#1e293b" strokeDasharray="2,3" strokeWidth="1" />
                          <line x1="0%" y1="75%" x2="100%" y2="75%" stroke="#1e293b" strokeDasharray="2,3" strokeWidth="1" />

                          {/* Render Filled Area under the curve */}
                          <path
                            d={`
                              M 0,64
                              ${customChartHistory.map((val, idx) => {
                                const x = (idx / 7) * 100; // distribute on width
                                const y = 64 - (val / 100) * 58; // scale with reserve margin
                                return `L ${x}%,${y}`;
                              }).join(" ")}
                              L 100%,64 Z
                            `}
                            fill="url(#svgGradientGlow)"
                          />

                          {/* Render main curve line */}
                          <path
                            d={customChartHistory.map((val, idx) => {
                              const x = (idx / 7) * 100;
                              const y = 64 - (val / 100) * 58;
                              return `${idx === 0 ? "M" : "L"} ${x}%,${y}`;
                            }).join(" ")}
                            fill="none"
                            stroke="#22d3ee"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            className="transition-all duration-500 ease-in-out"
                          />

                          {/* Current data points node flashes */}
                          {customChartHistory.map((val, idx) => {
                            const x = `${(idx / 7) * 100}%`;
                            const y = 64 - (val / 100) * 58;
                            return (
                              <circle
                                key={idx}
                                cx={x}
                                cy={y}
                                r="2.5"
                                className={`${idx === 7 ? "fill-cyan-400 r-4 stroke-slate-900 stroke-2" : "fill-cyan-500/80"}`}
                              />
                            );
                          })}
                        </svg>
                      </div>

                      {/* Sparkline Axis values labels */}
                      <div className="flex justify-between items-center font-mono text-[9px] text-slate-600 border-t border-slate-900 pt-1">
                        <span>T-24s</span>
                        <span>T-16s</span>
                        <span>T-8s</span>
                        <span className="text-cyan-400/85">NOW: {customChartHistory[7]}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section C: Live Diagnostics rolling terminal logs */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider block">Live Node Diagnostics Logging</span>
                  <div 
                    ref={devopsLogsRef}
                    className="bg-slate-950 border border-slate-900 rounded-xl p-3 h-28 overflow-y-auto font-mono text-[10px] leading-relaxed text-slate-400 space-y-1 scrollbar-thin scrollbar-thumb-slate-800"
                  >
                    {clusterLogsList.map((log, idx) => {
                      const isWarn = log.includes("[WRN]");
                      return (
                        <div key={idx} className="flex gap-1.5 items-start">
                          <span className="text-cyan-500 shrink-0 select-none">❯</span>
                          <span className={isWarn ? "text-amber-400 font-medium" : "text-slate-300"}>
                            {log}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* BIO / CHI SONO */}
        <section id="about-section" className="py-16 border-t border-slate-900/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual illustration of Alexandro's tech node concept */}
            <div className="lg:col-span-12 xl:col-span-5 order-2 lg:order-1 relative">
              <div className="aspect-square max-w-sm mx-auto bg-slate-900/40 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between relative shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 p-8 pointer-events-none">
                  <div className="w-24 h-24 bg-cyan-500/10 rounded-full blur-3xl" />
                </div>
                
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] text-cyan-400 font-mono tracking-widest block uppercase">Developer Identity</span>
                    <h4 className="text-xl font-bold text-white tracking-tight">Alexandro Tornese</h4>
                  </div>
                  <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-md font-mono">Est. 2023</span>
                </div>

                {/* Structured mock details */}
                <div className="space-y-4 py-8">
                  <div className="flex gap-3 items-center">
                    <Briefcase className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="text-xs text-slate-500 leading-none uppercase tracking-wider">Ruolo Corrente</p>
                      <p className="text-sm text-slate-200 mt-1 font-semibold">Full-Stack Developer presso Icsone</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <GraduationCap className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="text-xs text-slate-500 leading-none uppercase tracking-wider">Formazione</p>
                      <p className="text-sm text-slate-200 mt-1 font-semibold">Ingegneria Informatica (UniSalento)</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="text-xs text-slate-500 leading-none uppercase tracking-wider">Focus Chiave</p>
                      <p className="text-sm text-slate-200 mt-1 font-semibold">Architetture AI RAG, DevOps & CI/CD</p>
                    </div>
                  </div>
                </div>

                {/* Simulated signature string */}
                <div className="border-t border-slate-800/80 pt-4 flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>NODE: ICS_SALENTO</span>
                  <span>STATUS: ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Structured textual content */}
            <div className="lg:col-span-12 xl:col-span-7 order-1 lg:order-2 space-y-6">
              <div className="space-y-2">
                <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">Chi sono</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Sviluppo con Metodo, Innovo con Precisione.</h2>
              </div>
              
              <div className="space-y-4 text-slate-400 leading-relaxed text-sm sm:text-base">
                <p>
                  Con circa tre anni di esperienza lavorativa continuativa nell'IT, ho concentrato il mio operato sulla scrittura di codice ordinato e la strutturazione di automazioni aziendali complesse. Operare regolarmente nello stack DevOps mi ha educato a concepire soluzioni software che non si limitino a funzionare in locale, ma che risultino scalabili, resilienti ed efficienti una volta distribuite in contesti Cloud.
                </p>
                <p>
                  Attualmente affronto la sfida quotidiana di coordinare il mio lavoro full-time come developer presso <strong>Icsone</strong> con il superamento accademico del corso di laurea in <strong>Ingegneria Informatica</strong> all'Università del Salento. Questa intersezione continua mi consente di applicare l'algebra lineare e le strutture dati direttamente all'interno delle pipeline Docker, delle interrogazioni PostgreSQL e degli agenti intelligenti.
                </p>
                <p>
                  Sono convinto che il vero progresso sia guidato dalla condivisione dei saperi e dal rispetto degli standard metodologici. Il mio approccio al lavoro di squadra si traduce in una documentazione meticolosa, in test rigorosi e nella costante semplificazione delle architetture inutilmente complesse.
                </p>
              </div>
              
              {/* Values grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-slate-100 text-sm">Pragmatismo & Teoria</h5>
                    <p className="text-xs text-slate-400 mt-1 font-normal">Nessun compromesso: basi scientifiche per affrontare bug complessi.</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-slate-100 text-sm">Automazione al Centro</h5>
                    <p className="text-xs text-slate-400 mt-1 font-normal">Azzerare le operazioni manuali ripetitive con script e workflow n8n robusti.</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </section>

        {/* BENTO GRID SKILLS */}
        <section id="skills-section" className="py-16 border-t border-slate-900/60 space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">Competenze</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">Il Mio Tech Stack Operativo</h2>
            <p className="text-slate-400 text-sm">Tecnologie studiate e applicate quotidianamente in contesti aziendali reali e infrastrutture complesse.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SKILLS_DATA.map((group, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-center text-cyan-400">
                      {group.iconName === "server" && <Server className="w-5 h-5" />}
                      {group.iconName === "layout" && <Layout className="w-5 h-5" />}
                      {group.iconName === "terminal" && <Terminal className="w-5 h-5" />}
                      {group.iconName === "cpu" && <Cpu className="w-5 h-5" />}
                    </span>
                    <div>
                      <h4 className="font-bold text-white text-base tracking-tight">{group.category}</h4>
                      <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-0.5">CATEGORY_0{idx + 1}</p>
                    </div>
                  </div>

                  <p className="text-slate-400 text-xs sm:text-[13px] leading-relaxed">
                    {group.description}
                  </p>

                  <div className="space-y-3.5 pt-4 border-t border-slate-900">
                    {group.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className={`font-medium ${skill.isCore ? "text-slate-200" : "text-slate-400"}`}>
                            {skill.name} {skill.isCore && <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-1 rounded font-semibold">Core</span>}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">{skill.level}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full" 
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-slate-600 font-mono mt-6 text-right">
                  AT_NODE_SYNC // OK
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EXPERIENCE & EDUCATION TIMELINE */}
        <section id="timeline-section" className="py-16 border-t border-slate-900/60 max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">Esperienza & Formazione</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">Percorso e Traguardi</h2>
            <p className="text-slate-400 text-sm">Un percorso che bilancia la pragmatica del mercato IT aziendale con le rigorose basi offerte dall'ingegneria informatica.</p>
          </div>

          <div className="relative border-l-2 border-slate-900 md:pl-8 ml-4 md:ml-6 space-y-12">
            {TIMELINE_DATA.map((item, idx) => (
              <div key={item.id} className="relative group">
                
                {/* Timeline node icon */}
                <span className="absolute -left-6 md:-left-[42px] top-1 w-6 h-6 rounded-full bg-slate-950 border-2 border-cyan-400/80 flex items-center justify-center text-cyan-400 z-10 shadow-lg shrink-0">
                  {item.isEducation ? <BookOpen className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                </span>

                <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-white tracking-tight">{item.role}</h4>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                          item.isEducation ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25" : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25"
                        }`}>
                          {item.isEducation ? "Studio" : "Professione"}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-300 mt-1">{item.institution} — <span className="text-slate-400 font-normal">{item.location}</span></p>
                    </div>
                    <span className="text-xs text-cyan-400 font-mono bg-cyan-950/20 border border-cyan-900/40 px-3 py-1 rounded-lg">
                      {item.period}
                    </span>
                  </div>

                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>

                  <div className="space-y-2">
                    <h5 className="text-xs font-semibold text-slate-200">Traguardi principali:</h5>
                    <ul className="text-xs sm:text-sm text-slate-400 space-y-1.5 list-disc pl-4 leading-relaxed">
                      {item.achievements?.map((ach, aIdx) => (
                        <li key={aIdx}>{ach}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Skills Tag Cloud */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.tags?.map((tag) => (
                      <span key={tag} className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects-section" className="py-16 border-t border-slate-900/60 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 max-w-4xl mx-auto">
            <div className="space-y-2">
              <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">Progetti in evidenza</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans m-0">Sviluppo ad Alto Impatto</h2>
              <p className="text-slate-400 text-sm">Architetture reali ed ingegneriose, create per ottimizzare le automazioni aziendali o vincere hackathon nazionali.</p>
            </div>
            
            {/* Project Category tabs */}
            <div className="flex flex-wrap gap-2 shrink-0 bg-slate-950 border border-slate-900 p-1.5 rounded-xl">
              <button 
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "all" ? "bg-cyan-505 bg-white text-slate-950 shadow-md shadow-white/10" : "text-slate-400 hover:text-white"
                }`}
              >
                Tutti
              </button>
              <button 
                onClick={() => setActiveTab("ai")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "ai" ? "bg-cyan-505 bg-white text-slate-950 shadow-md shadow-white/10" : "text-slate-400 hover:text-white"
                }`}
              >
                AI & RAG
              </button>
              <button 
                onClick={() => setActiveTab("devops")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "devops" ? "bg-cyan-505 bg-white text-slate-950 shadow-md shadow-white/10" : "text-slate-400 hover:text-white"
                }`}
              >
                DevOps
              </button>
              <button 
                onClick={() => setActiveTab("web")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "web" ? "bg-cyan-505 bg-white text-slate-950 shadow-md shadow-white/10" : "text-slate-400 hover:text-white"
                }`}
              >
                Web
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto pt-4">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  key={project.id} 
                  className="bg-gradient-to-br from-slate-900 to-slate-805 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-400/5 transition-all flex flex-col justify-between group relative"
                >
                  <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-cyan-500/10 rounded-full blur-2xl"></div>
                  </div>

                  <div className="p-6 space-y-4 relative z-10">
                    {/* Visual header with colored bar context */}
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] bg-cyan-550/10 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-md font-mono tracking-widest font-semibold capitalize text-cyan-400">
                        {project.category === "ai" ? "Artificial Intelligence" : project.category === "devops" ? "DevOps / Infr" : "Sviluppo & Team"}
                      </span>
                      <span className="text-slate-600 text-[10px] font-mono">PROJECT_{project.id.substring(0,3).toUpperCase()}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                    
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {project.shortDescription}
                    </p>

                    {/* Numeric key indicators metric row */}
                    {project.metrics && (
                      <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                        {project.metrics.map((met, mIdx) => (
                          <div key={mIdx} className="text-center">
                            <p className="text-cyan-450 text-cyan-400 font-mono font-bold text-[13px]">{met?.value || ''}</p>
                            <p className="text-[9px] text-slate-500 truncate mt-0.5">{met?.label || ''}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-slate-800 text-slate-350 px-2 py-0.5 rounded font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/40 border-t border-slate-900 flex justify-between items-center sm:px-6 relative z-10">
                    <button 
                      onClick={() => setSelectedProject(project)}
                      className="text-xs text-cyan-400 hover:text-cyan-350 font-bold tracking-wide flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      Dettagli tecnici <ChevronRight className="w-4 h-4 text-cyan-400" />
                    </button>
                    {!project.id.includes("hack") && (
                      <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1 px-2.5 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20">● Attivo</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* FULLY INTERACTIVE COMMAND LINE DEVELOPER TERMINAL */}
        <section id="terminal-section" className="py-16 border-t border-slate-900/60 max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">Terminal Console</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Retro Developer Console</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">Se preferisci riga di comando per consultare le mie competenze, ho sviluppato un emulatore terminale apposta per te.</p>
          </div>

          <div className={`border rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${currentTerminalClass.bg}`}>
            
            {/* OS Styled Window Header */}
            <div className={`px-4 py-3 border-b flex justify-between items-center ${currentTerminalClass.headerBg}`}>
              <div className="flex gap-2">
                <span className={`w-3 h-3 rounded-full ${currentTerminalClass.dots}`} />
                <span className={`w-3 h-3 rounded-full ${currentTerminalClass.dots}`} />
                <span className={`w-3 h-3 rounded-full ${currentTerminalClass.dots}`} />
              </div>
              <span className="text-xs font-mono font-bold flex items-center gap-1">
                <Command className="w-3 h-3 text-cyan-400 animate-pulse" /> alexandro@unisalento-icsone-node:~
              </span>
              <div className="flex gap-2">
                <button onClick={() => setTerminalTheme("dark")} className={`px-1.5 py-0.5 text-[9px] rounded border font-mono ${terminalTheme === "dark" ? "bg-zinc-800 text-white border-zinc-700" : "text-zinc-500 border-transparent"}`}>dark</button>
                <button onClick={() => setTerminalTheme("matrix")} className={`px-1.5 py-0.5 text-[9px] rounded border font-mono ${terminalTheme === "matrix" ? "bg-green-950 text-green-300 border-green-800" : "text-green-600 border-transparent"}`}>matrix</button>
                <button onClick={() => setTerminalTheme("nord")} className={`px-1.5 py-0.5 text-[9px] rounded border font-mono ${terminalTheme === "nord" ? "bg-slate-800 text-sky-200 border-slate-700" : "text-slate-500 border-transparent"}`}>nord</button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className={`p-5 h-80 overflow-y-auto leading-relaxed select-text space-y-4 ${currentTerminalClass.text}`}>
              {terminalHistory.map((item, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={currentTerminalClass.prompt}>{item.dir} $</span>
                    <span className="text-white font-medium">{item.input}</span>
                    <span className="text-[10px] text-zinc-600 ml-auto font-mono">{item.timestamp}</span>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-xs text-slate-300 pl-4 border-l border-indigo-950/50 py-0.5">
                    {item.output}
                  </pre>
                </div>
              ))}
              <div ref={terminalBottomRef} />
            </div>

            {/* Terminal Input Form */}
            <form onSubmit={handleTerminalSubmit} className="p-3 border-t border-slate-900 bg-black/40 flex items-center gap-2">
              <span className={`pl-2 font-mono ${currentTerminalClass.prompt}`}>~ $</span>
              <input 
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Digita 'help' o esplora i comandi come 'skills', 'about', 'mcp'..."
                className={`flex-1 ${currentTerminalClass.inputBg} focus:ring-0 focus:outline-none`}
                autoFocus={false}
              />
              <button 
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/20 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                Invia
              </button>
            </form>
          </div>
        </section>

        {/* MODEL CONTEXT PROTOCOL & AUTOMATION WORKFLOW INTERACTIVE SIMULATOR */}
        <section className="py-12 bg-slate-900/40 border border-slate-800 rounded-3xl max-w-4xl mx-auto p-6 sm:p-8 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 pointer-events-none">
            <div className="w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 pb-4 border-b border-slate-800/60">
            <div className="flex items-start gap-4">
              <span className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20 shadow-inner">
                <Cpu className="w-6 h-6 animate-pulse" />
              </span>
              <div className="space-y-1.5">
                <span className="text-[10px] text-cyan-400 font-mono tracking-widest block font-bold uppercase">Sandbox DevOps</span>
                <h3 className="text-2xl font-bold text-white tracking-tight">Simulatore Interattivo di Automazioni</h3>
                <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
                  Trascina l'attivazione ed esegui i workflow reali su cui lavoro ordinariamente (n8n, integrazioni ToDo e performance di CePosto).
                </p>
              </div>
            </div>
          </div>

          {/* Workflow Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 relative z-10">
            {(Object.keys(RECIPES_DATA) as Array<keyof typeof RECIPES_DATA>).map((recipeKey) => {
              const active = selectedRecipe === recipeKey;
              return (
                <button
                  key={recipeKey}
                  onClick={() => {
                    if (!pipelineRunning) {
                      setSelectedRecipe(recipeKey);
                      setPipelineStep(-1);
                      setPipelineLogs([]);
                    }
                  }}
                  disabled={pipelineRunning}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    active 
                      ? "bg-cyan-500/10 border-cyan-500/40 shadow-md shadow-cyan-500/5 text-white" 
                      : "bg-slate-950/60 border-slate-850 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                  } ${pipelineRunning ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <p className="text-xs font-bold font-mono text-cyan-400 mb-1 uppercase tracking-wider">
                    {recipeKey === "ai-triage" ? "🤖 AI RAG" : recipeKey === "ceposto-cache" ? "⚡ CEPOSTO" : "🛠️ TODO SYSTEM"}
                  </p>
                  <p className="text-xs font-bold truncate">{RECIPES_DATA[recipeKey].title.replace(" (RAG + AI)", "").replace(" Engine (www.ceposto.it)", "")}</p>
                </button>
              );
            })}
          </div>

          {/* Connected Flowchart Graph nodes */}
          <div className="p-6 bg-slate-950/40 rounded-2xl border border-slate-850 relative z-10 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 font-mono text-xs text-center">
              {RECIPES_DATA[selectedRecipe].nodes.map((node, nIdx) => {
                const isActive = pipelineStep === nIdx;
                const isCompleted = pipelineStep > nIdx || (pipelineStep === -1 && pipelineLogs.length > 2);
                
                return (
                  <React.Fragment key={node.id}>
                    {/* Visual Node */}
                    <div 
                      className={`flex flex-col items-center p-4 rounded-xl border w-full max-w-[170px] transition-all duration-350 bg-slate-900/90 relative ${
                        isActive 
                          ? "border-cyan-400/80 shadow-lg shadow-cyan-400/10 ring-1 ring-cyan-400/20 scale-105" 
                          : isCompleted 
                            ? "border-emerald-500/40 text-slate-300"
                            : "border-slate-800 text-slate-500"
                      }`}
                    >
                      {/* Active green/blue indicators */}
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
                      )}
                      
                      <span className={`p-1.5 rounded-lg mb-2 ${
                        isActive 
                          ? "bg-cyan-500/20 text-cyan-400" 
                          : isCompleted 
                            ? "bg-emerald-500/10 text-emerald-400" 
                            : "bg-slate-950 text-slate-650"
                      }`}>
                        {nIdx === 0 && <Activity className="w-4 h-4" />}
                        {nIdx === 1 && <Database className="w-4 h-4" />}
                        {nIdx === 2 && <Cpu className="w-4 h-4" />}
                        {nIdx === 3 && <GitBranch className="w-4 h-4" />}
                      </span>

                      <span className="font-bold text-[10px] uppercase block tracking-wider leading-none mb-1 text-white">
                        {node?.label}
                      </span>
                      <span className="text-[9px] text-slate-500 block leading-tight">
                        {node?.desc}
                      </span>
                    </div>

                    {/* Connecting Chevron Arrow */}
                    {nIdx < 3 && (
                      <div className={`hidden md:block transition-all duration-300 ${
                        isActive
                          ? "text-cyan-400 scale-125 animate-pulse"
                          : isCompleted
                            ? "text-emerald-500"
                            : "text-slate-800"
                      }`}>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Run Button and details description */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-900">
              <div className="text-slate-450 text-slate-400 text-xs max-w-md">
                <span className="text-cyan-400 font-bold">Concept: </span> 
                {RECIPES_DATA[selectedRecipe].description}
              </div>
              
              <button
                onClick={handleRunPipeline}
                disabled={pipelineRunning}
                className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                  pipelineRunning
                    ? "bg-cyan-500/5 text-cyan-300/60 border-cyan-500/10 animate-pulse cursor-not-allowed"
                    : "bg-cyan-500/15 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500 hover:text-slate-950 hover:border-cyan-400"
                }`}
              >
                {pipelineRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    In esecuzione...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Esegui Pipeline
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Debug System Logs Dashboard output */}
          <div className="space-y-2 relative z-10">
            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest block">Pipeline Diagnostics Logs</span>
            <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 h-40 overflow-y-auto font-mono text-[11px] leading-relaxed text-zinc-350 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
              {pipelineLogs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-600 italic">
                  Nessun log caricato. Clicca su "Esegui Pipeline" per avviare il simulatore di processi.
                </div>
              ) : (
                pipelineLogs.map((log, idx) => (
                  <div key={idx} className="animate-fade-in flex items-start gap-1">
                    <span className="text-cyan-500 shrink-0 select-none">❯</span>
                    <span className={log.includes("✔") ? "text-emerald-400 font-semibold" : log.includes("▶") ? "text-slate-300" : "text-cyan-400/80"}>
                      {log}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION / CONNECT WITH ME */}
        <section id="contact-section" className="py-16 border-t border-slate-900/60 max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">Contatti</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white m-0 font-sans">Iniziamo Qualcosa di Straordinario</h2>
            <p className="text-slate-400 text-sm">Discutiamo di nuove opportunità di sviluppo, progetti di intelligenza artificiale o integrazioni DevOps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left direct channel info details */}
            <div className="md:col-span-5 space-y-6">
              <h4 className="font-bold text-white tracking-tight text-lg">Canali Diretti</h4>
              
              <div className="space-y-4">
                <a 
                  href="mailto:alexandro4317@gmail.com" 
                  className="flex items-center gap-3.5 p-4 bg-slate-900/40 border border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-cyan-400/5 transition-all rounded-2xl group cursor-pointer"
                >
                  <Mail className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-mono leading-none uppercase">Scrivimi via E-mail</p>
                    <p className="text-sm text-slate-200 mt-1.5 font-bold select-all">alexandro4317@gmail.com</p>
                  </div>
                </a>

                <div 
                  className="flex items-center gap-3.5 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl"
                >
                  <Phone className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-mono leading-none uppercase">Zona e Disponibilità</p>
                    <p className="text-sm text-slate-200 mt-1.5 font-bold">Salento, Puglia / Remoto</p>
                  </div>
                </div>
              </div>

              {/* Social networking buttons row */}
              <div className="flex gap-3">
                <a 
                  href="https://github.com/alexandro4317" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-11 h-11 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:text-cyan-400 flex items-center justify-center text-slate-350 hover:text-white transition-colors cursor-pointer"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-11 h-11 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:text-cyan-400 flex items-center justify-center text-slate-355 hover:text-white transition-colors cursor-pointer"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Right side contact feedback message formulation form */}
            <div className="md:col-span-7 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8">
              {formSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <span className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mx-auto border border-cyan-500/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-lg tracking-tight">Messaggio Trasmesso!</h4>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Ti ringrazio molto per avermi scritto. Alexandro ti ricontatterà quanto prima alla mail indicata.</p>
                  </div>
                  <button 
                    onClick={() => setFormSubmitted(false)}
                    className="text-xs text-cyan-400 font-bold hover:text-cyan-350 mt-4 cursor-pointer"
                  >
                    Invia un altro messaggio
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">Nome completo</label>
                      <input 
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-cyan-500/80 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">Indirizzo E-mail</label>
                      <input 
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-cyan-500/80 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">Messaggio di contatto</label>
                    <textarea 
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Ciao Alexandro, ti scrivo in merito ad una proposta tecnica..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-cyan-500/80 transition-colors resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-white text-slate-950 hover:bg-cyan-400 disabled:opacity-55 font-bold py-3.5 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-950/20"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" strokeWidth="2" />
                        In corso...
                      </>
                    ) : (
                      <>Invia Messaggio</>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>

      </main>

      {/* DETAILED MODAL POPUP DIALOGUE SCREEN FOR CHOSEN PROJECT DETAILED METRIC */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
            >
              
              {/* Modal Banner decorative accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 to-blue-500" />
              
              {/* Close button icon indicator */}
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-[10px] text-cyan-400 font-mono tracking-widest block uppercase font-bold">Dettaglio Tecnico Completo</span>
                  <h3 className="text-2xl font-bold text-white tracking-tight mt-1">{selectedProject.title}</h3>
                </div>

                <div className="space-y-4">
                  <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
                    {selectedProject.fullDescription}
                  </p>
                  
                  {/* Custom structured accomplishments list */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-semibold text-slate-200">Incarico e Contributi Specifici:</h5>
                    <ul className="text-xs sm:text-sm text-slate-400 space-y-2 list-none p-0">
                      {selectedProject.achievements.map((ach, idx) => (
                        <li key={idx} className="flex gap-2 items-start leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Grid metrics details row */}
                {selectedProject.metrics && (
                  <div className="grid grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-850">
                    {selectedProject.metrics.map((m, idx) => (
                      <div key={idx} className="text-center">
                        <p className="text-cyan-400 font-mono font-bold text-base sm:text-lg">{m?.value || ''}</p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{m?.label || ''}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Lower tag cloud row */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedProject.tags.map((tag) => (
                    <span key={tag} className="text-[10px] bg-slate-800 text-slate-305 px-3 py-1 rounded-md font-mono text-cyan-400 font-semibold bg-cyan-500/10 border border-cyan-500/10">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer action buttons */}
                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all border border-slate-800"
                  >
                    Chiudi Dettagli
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Footer signature layout block */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 px-6 text-center text-slate-500 text-[11px] font-mono leading-relaxed space-y-2 font-medium">
        <p>&copy; {new Date().getFullYear()} Alexandro Tornese. Tutti i diritti riservati.</p>
        <div className="flex items-center justify-center gap-2 text-slate-600 mt-1">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
          <span>Disponible per nuove collaborazioni</span>
        </div>
      </footer>

    </div>
  );
}
