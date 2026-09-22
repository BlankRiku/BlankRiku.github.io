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
  CheckCircle2, 
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
  Minus,
  Radio,
  Download,
  Menu,
  Languages
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PROJECTS_DATA, SKILLS_DATA, TIMELINE_DATA } from "./data";
import { Project, SkillGroup, TimelineItem, TerminalEntry } from "./types";
import DevOpsSandbox from "./DevOpsSandbox";

/**
 * Dati di contatto e link esterni centralizzati.
 * TODO(auth): aggiornare `linkedin` con l'URL del profilo reale e
 * `cvUrl` con il path del CV PDF rigenerato (es. "/cv-alexandro-tornese.pdf").
 */
export const CONTACT = {
  name: "Alexandro Tornese",
  email: "alexandro4317@gmail.com",
  github: "https://github.com/alexandro4317",
  linkedin: "https://www.linkedin.com/in/alexandro-tornese/",
  cvUrl: "/cv-alexandro-tornese.pdf", // CV reale (PDF)
  location: "Salento, Puglia / Remoto",
};

const NAV_ITEMS = [
  { id: "about-section", label: "Chi Sono" },
  { id: "skills-section", label: "Competenze" },
  { id: "timeline-section", label: "Esperienza" },
  { id: "projects-section", label: "Progetti" },
  { id: "how-section", label: "Come lavoro" },
];

export default function App() {
  const [activeTab, setActiveTab ] = useState<"ai" | "devops" | "web" | "mobile" | "all">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Interactive Terminal State
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([
    {
      input: "welcome",
      output: "Benvenuto nel terminale di Alexandro Tornese.\nDigita 'help' per visualizzare i comandi disponibili per esplorare il mio CV.",
      timestamp: new Date().toLocaleTimeString(),
      dir: "~"
    }
  ]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const [terminalTheme, setTerminalTheme] = useState<"dark" | "matrix" | "nord">("dark");

  // Pipeline / Automation Simulator Settings
  const [selectedRecipe, setSelectedRecipe] = useState<"ai-triage" | "k8s-deploy" | "todo-git-sync">("ai-triage");
  const [pipelineStep, setPipelineStep] = useState<number>(-1);
  const [pipelineRunning, setPipelineRunning] = useState<boolean>(false);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);

  const RECIPES_DATA = {
    "ai-triage": {
      title: "Geppo AI: Email → Ticket",
      description: "Flusso reale del progetto Geppo: una email entra, viene classificata via RAG ibrido e multi-LLM e genera un'azione.",
      nodes: [
        { id: "imap", label: "IMAP IDLE", desc: "Nuova email" },
        { id: "import", label: "import-service", desc: "Parsing + RAG lookup" },
        { id: "llm", label: "main-service", desc: "Classifica + bozza" },
        { id: "audit", label: "audit-service", desc: "Log evento + azione" }
      ],
      logs: [
        "Bridge MQTT: ricevuto evento nuova email sulla casella aziendale (IDLE).",
        "import-service: estratto testo e allegati, ricerca ibrida su ChromaDB + BM25 dei documenti indicizzati.",
        "main-service: classificazione e bozza di risposta via provider LLM con function calling.",
        "audit-service: evento registrato; ticket creato e risposta accodata per l'invio."
      ]
    },
    "k8s-deploy": {
      title: "Deploy Kubernetes (k3s)",
      description: "Pipeline CI/CD concreta: build Maven, immagine Docker su registry, rollout su cluster k3s con smoke test.",
      nodes: [
        { id: "push", label: "GitLab CI", desc: "Push su develop" },
        { id: "maven", label: "Maven build", desc: "Test + JAR (Java 21)" },
        { id: "image", label: "Docker image", desc: "Build & push registry" },
        { id: "rollout", label: "kubectl rollout", desc: "Deploy su k3s" }
      ],
      logs: [
        "GitLab CI: pipeline avviata sul branch develop (commit trigger).",
        "Maven: compilazione e test superati, artifact JAR generato.",
        "Docker: immagine costruita e pubblicata sul registry del team.",
        "kubectl rollout status: deployment aggiornato su k3s, pod healthy e smoke test OK."
      ]
    },
    "todo-git-sync": {
      title: "ToDo → GitLab Auto-Branch",
      description: "Flusso reale di ToDo: dal bug segnalato alla creazione automatica del branch GitLab, con notifica al team.",
      nodes: [
        { id: "bug", label: "Bug su ToDo", desc: "Nuova segnalazione" },
        { id: "spring", label: "Spring Boot", desc: "Transition stato/sprint" },
        { id: "gitlab", label: "GitLab API", desc: "Crea branch" },
        { id: "notify", label: "MQTT Notify", desc: "Notifica team/helpdesk" }
      ],
      logs: [
        "Nuovo bug segnalato e validato: stato impostato su 'In Sviluppo'.",
        "Spring Boot: allocazione dello sprint ed esecuzione della transition di stato.",
        "GitLab API: creato il branch 'fix/<id-descrizione>' dal branch base.",
        "Notifica inviata al canale del team; ticket collegato al branch e pronto al deploy."
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

  // User contact form state
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero-section");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scrollspy: evidenzia la sezione attualmente in viewport nella navbar.
  useEffect(() => {
    const sectionIds = [
      "hero-section",
      ...NAV_ITEMS.map((item) => item.id),
      "contact-section",
    ];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Auto-scroll for terminal inside their respective overflow containers
  useEffect(() => {
    if (terminalBottomRef.current) {
      const container = terminalBottomRef.current.parentElement;
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }
    }
  }, [terminalHistory]);

  // Chiudi la modale progetto con ESC e blocca lo scroll del body quando è aperta.
  useEffect(() => {
    if (!selectedProject) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedProject]);

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
                 "  clear       - Pulisce lo schermo";
        break;
      case "about":
        output = "Alexandro Tornese - Software Engineer con circa 4 anni di esperienza nell'IT.\n" +
                 "Attualmente lavora presso Icsone su applicativi aziendali complessi, architetture AI e infrastrutture containerizzate,\n" +
                 "e contemporaneamente frequenta il secondo anno di Ingegneria Informatica all'Università del Salento.\n" +
                 "Spazia dall'AI generativa (RAG multi-provider) al backend, dal DevOps ai sistemi realtime/IoT (MQTT) fino ad app mobile e desktop.";
        break;
      case "skills":
        output = "TECH STACK PRINCIPALE:\n" +
                 "--------------------------------------------------\n" +
                 "  Backend:  Spring Boot (Java), PHP (Yii2), Node.js/Express\n" +
                 "  Database: MariaDB / MySQL\n" +
                 "  Frontend: Angular, Ionic/Capacitor, Electron, Tailwind CSS\n" +
                 "  DevOps:   Docker, Kubernetes/k3s, Nginx, Portainer, GitLab CI/CD, n8n\n" +
                 "  AI:       RAG ibrido (ChromaDB + BM25), Multi-LLM, MCP, Local LLMs\n" +
                 "  Realtime: MQTT, WebSocket/SSE, Raspberry Pi, Web Speech (TTS/STT)";
        break;
      case "projects":
        output = "PROGETTI CHIAVE:\n" +
                 "--------------------------------------------------\n" +
                 "1. CePosto Platform (www.ceposto.it)\n" +
                 "   Sviluppo evolutivo dell'ecosistema SaaS di prenotazione online e agende digitali.\n\n" +
                 "2. Assistente AI Aziendale (RAG) - progetto Geppo\n" +
                 "   Microservizi Flask con RAG ibrido (ChromaDB + BM25) e orchestrazione multi-LLM.\n\n" +
                 "3. ToDo (Enterprise Workflows)\n" +
                 "   Task & Sprint manager Angular/Spring Boot con integrazione Git, CRM ed helpdesk.\n\n" +
                 "4. Infrastruttura Docker & Reverse Proxy\n" +
                 "   Containerizzazione multi-dominio dietro reverse proxy Nginx.\n\n" +
                 "5. Monitor Accettazione & Survey (Realtime)\n" +
                 "   Display di coda MQTT e questionari, anche su Raspberry Pi in modalità kiosk.";
        break;
      case "experience":
        output = "PERCORSO PROFESSIONALE & ACCADEMICO:\n" +
                 "--------------------------------------------------\n" +
                 "💼 Software Engineer (Full-Stack & AI) | Icsone (2023 - Presente)\n" +
                 "   - Architetture AI: microservizi RAG multi-provider con ricerca ibrida.\n" +
                 "   - Orchestrazione di flussi e automazione con n8n.\n" +
                 "   - Infrastruttura containerizzata (Docker/Nginx/Portainer) e sistemi realtime/IoT.\n\n" +
                 "🎓 Ingegneria Informatica (2° Anno) | UniSalento (2024 - In corso)\n" +
                 "   - Metodologie ingegneristiche applicate ed algoritmi fondamentali.";
        break;
      case "contact":
        output = `E-mail:   ${CONTACT.email}\n` +
                 `GitHub:   ${CONTACT.github}\n` +
                 `LinkedIn: ${CONTACT.linkedin}\n` +
                 "Puoi anche usare il modulo di contatto in fondo alla pagina.";
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

  // Contact form submission — apre il client di posta con il messaggio precompilato.
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setIsSubmitting(true);

    const subject = encodeURIComponent(`Contatto dal portfolio — ${formState.name}`);
    const body = encodeURIComponent(
      `Nome: ${formState.name}\nEmail: ${formState.email}\n\n${formState.message}`
    );
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
    }, 500);
  };

  const filteredProjects = activeTab === "all" 
    ? PROJECTS_DATA 
    : PROJECTS_DATA.filter(p => p.category === activeTab);

  const categoryLabels: Record<Project["category"], string> = {
    ai: "AI & Data",
    devops: "DevOps / Infra",
    web: "Web & Realtime",
    mobile: "Mobile & Desktop",
    all: "Tutti",
  };

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
          <a href="#hero-section" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-slate-950">AT</div>
            <div>
              <span className="text-white font-semibold text-base tracking-tight block">{CONTACT.name}</span>
              <span className="text-[10px] text-cyan-400 font-mono tracking-wider block uppercase">Software Engineer</span>
            </div>
          </a>
          
          <div className="hidden md:flex gap-6 text-xs font-semibold uppercase tracking-widest items-center">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`transition-colors cursor-pointer ${
                  activeSection === item.id ? "text-cyan-400" : "text-slate-500 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={CONTACT.cvUrl}
              download
              className="hidden sm:inline-flex items-center gap-1.5 bg-white text-slate-950 hover:bg-cyan-400 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300"
            >
              <Download className="w-3.5 h-3.5" /> CV
            </a>
            <a 
              href="#contact-section" 
              className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/20 px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-300"
            >
              Contatti
            </a>
            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? "Chiudi menu" : "Apri menu"}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-900 bg-slate-950/95 backdrop-blur-md px-6 py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 text-sm font-semibold uppercase tracking-widest ${
                  activeSection === item.id ? "text-cyan-400" : "text-slate-400"
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href={CONTACT.cvUrl}
              download
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 inline-flex items-center gap-1.5 bg-white text-slate-950 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider"
            >
              <Download className="w-3.5 h-3.5" /> Scarica CV
            </a>
          </div>
        )}
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-32 pb-20">

        {/* HERO SECTION / LANDING */}
        <section id="hero-section" className="py-12 lg:py-20 flex flex-col lg:flex-row gap-12 items-center justify-between">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-block px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-bold rounded-full uppercase tracking-tighter">
              Software Engineer · AI, Backend & Sistemi Distribuiti
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Costruisco <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">backend, AI e infrastrutture</span> che reggono in produzione.
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed pr-0 lg:pr-10">
              ~4 anni in <strong className="text-slate-200">Icsone</strong> tra backend, AI e DevOps. Ho contribuito a piattaforme usate da PA e aziende: <strong className="text-slate-200">3M+ prenotazioni</strong> su CePosto, un assistente AI (RAG multi-LLM) con <strong className="text-slate-200">50.000+ documenti</strong> indicizzati e deploy orchestrati su Kubernetes. Studio Ingegneria Informatica a UniSalento.
            </p>

            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start pt-2">
              <a
                href={CONTACT.cvUrl}
                download
                className="px-8 py-3 bg-cyan-500 text-slate-950 font-bold rounded-xl hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-slate-950" /> Scarica CV
              </a>
              <a
                href="#projects-section"
                className="px-8 py-3 bg-white text-slate-950 font-bold rounded-xl hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20 transition-all flex items-center gap-2"
              >
                Vedi i progetti <ArrowRight className="w-4 h-4 text-slate-950" />
              </a>
              <a
                href="#contact-section"
                className="px-6 py-3 bg-slate-900 border border-slate-800 text-white font-bold rounded-xl hover:border-slate-600 hover:text-cyan-400 transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-cyan-400" /> Contattami
              </a>
            </div>

            {/* Quick stats panel */}
            <div className="grid grid-cols-3 gap-6 max-w-lg pt-8 mx-auto lg:mx-0 border-t border-slate-900">
              <div>
                <p className="text-3xl font-extrabold text-white font-mono">4+</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Anni di esperienza</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white font-mono">3M+</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Prenotazioni — CePosto</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white font-mono">50k+</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Documenti indicizzati — AI</p>
              </div>
            </div>
          </div>

          {/* Profile snapshot card */}
          <div className="flex-1 w-full max-w-md lg:max-w-sm mx-auto">
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 pointer-events-none">
                <div className="w-24 h-24 bg-cyan-500/10 rounded-full blur-3xl" />
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center font-bold text-slate-950 text-lg">AT</div>
                <div className="space-y-0.5">
                  <p className="text-white font-bold tracking-tight leading-tight">Alexandro Tornese</p>
                  <p className="text-[11px] text-cyan-400 font-mono uppercase tracking-wider">Software Engineer</p>
                  <p className="text-[10px] text-slate-500 font-mono">Salento, Puglia · Remoto</p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Disponibile
                </span>
              </div>

              <div className="mt-6 space-y-3.5 relative z-10">
                <div className="flex gap-3 items-center">
                  <Briefcase className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 leading-none uppercase tracking-wider">Ruolo corrente</p>
                    <p className="text-sm text-slate-200 mt-1 font-semibold">Software Engineer presso Icsone</p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 leading-none uppercase tracking-wider">Formazione</p>
                    <p className="text-sm text-slate-200 mt-1 font-semibold">Ingegneria Informatica (UniSalento)</p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 leading-none uppercase tracking-wider">Focus</p>
                    <p className="text-sm text-slate-200 mt-1 font-semibold">AI & RAG · Backend · DevOps · Realtime/IoT</p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <Languages className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-500 leading-none uppercase tracking-wider">Lingue</p>
                    <p className="text-sm text-slate-200 mt-1 font-semibold">Italiano (madrelingua) · Inglese (B2)</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-800/70 flex items-center gap-3 relative z-10">
                <a href={`mailto:${CONTACT.email}`} aria-label="Email" className="w-10 h-10 rounded-full bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:text-cyan-400 flex items-center justify-center text-slate-300 transition-colors">
                  <Mail className="w-4 h-4" />
                </a>
                <a href={CONTACT.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="w-10 h-10 rounded-full bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:text-cyan-400 flex items-center justify-center text-slate-300 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
                <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:text-cyan-400 flex items-center justify-center text-slate-300 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href={CONTACT.cvUrl} download className="ml-auto inline-flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 px-4 h-10 rounded-full text-xs font-bold uppercase tracking-wider transition-colors">
                  CV <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* BIO / CHI SONO */}
        <section id="about-section" className="py-16 border-t border-slate-900/60 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">Chi sono</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Software Engineer con una specializzazione sull'AI.</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
              Lavoro in <strong className="text-slate-200">Icsone</strong> sull'intero ciclo del software: backend, AI, infrastruttura containerizzata e sistemi realtime/IoT. Unisco la pratica quotidiana sul campo alle basi di <strong className="text-slate-200">Ingegneria Informatica</strong> (UniSalento), con l'obiettivo di costruire soluzioni che reggano davvero in produzione.
            </p>

            <ul className="space-y-2.5 text-slate-400 text-sm sm:text-base">
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Infrastruttura containerizzata (Docker, Nginx, k3s) e aggiornamenti a <strong className="text-slate-200">zero downtime</strong>.</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Cuore AI aziendale: microservizi <strong className="text-slate-200">RAG multi-LLM</strong> con ricerca ibrida vettoriale/BM25.</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Applicativi realtime/IoT (MQTT), app mobile (Ionic) e desktop (Electron).</span>
              </li>
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl">
                <h5 className="font-semibold text-slate-100 text-sm">Pragmatismo &amp; teoria</h5>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Basi scientifiche e metodo per affrontare problemi e bug complessi.</p>
              </div>
              <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl">
                <h5 className="font-semibold text-slate-100 text-sm">Automazione al centro</h5>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Meno operazioni manuali ripetitive, più script e workflow affidabili.</p>
              </div>
            </div>
          </div>
        </section>

        {/* BENTO GRID SKILLS */}
        <section id="skills-section" className="py-16 border-t border-slate-900/60 space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">Competenze</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">Il Mio Tech Stack Operativo</h2>
            <p className="text-slate-400 text-sm">Tecnologie che uso in contesti aziendali reali, dal backend all'AI, fino a infrastruttura e sistemi realtime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SKILLS_DATA.map((group, idx) => (
              <div
                key={idx}
                className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-center text-cyan-400">
                    {group.iconName === "server" && <Server className="w-5 h-5" />}
                    {group.iconName === "layout" && <Layout className="w-5 h-5" />}
                    {group.iconName === "terminal" && <Terminal className="w-5 h-5" />}
                    {group.iconName === "cpu" && <Cpu className="w-5 h-5" />}
                    {group.iconName === "radio" && <Radio className="w-5 h-5" />}
                  </span>
                  <h4 className="font-bold text-white text-base tracking-tight">{group.category}</h4>
                </div>

                <p className="text-slate-400 text-xs sm:text-[13px] leading-relaxed mt-4">
                  {group.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-slate-900">
                  {group.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="text-[11px] bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">
                      {skill.name}
                    </span>
                  ))}
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
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans m-0">Progetti su cui ho lavorato</h2>
              <p className="text-slate-400 text-sm">Piattaforme aziendali e sistemi reali, dalle prenotazioni per la PA all'AI generativa, fino a infrastruttura e applicazioni mobile/desktop.</p>
            </div>
            
            {/* Project Category tabs */}
            <div className="flex flex-wrap gap-2 shrink-0 bg-slate-950 border border-slate-900 p-1.5 rounded-xl">
              <button 
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "all" ? "bg-white text-slate-950 shadow-md shadow-white/10" : "text-slate-400 hover:text-white"
                }`}
              >
                Tutti
              </button>
              <button 
                onClick={() => setActiveTab("ai")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "ai" ? "bg-white text-slate-950 shadow-md shadow-white/10" : "text-slate-400 hover:text-white"
                }`}
              >
                AI & Data
              </button>
              <button 
                onClick={() => setActiveTab("devops")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "devops" ? "bg-white text-slate-950 shadow-md shadow-white/10" : "text-slate-400 hover:text-white"
                }`}
              >
                DevOps & Infra
              </button>
              <button 
                onClick={() => setActiveTab("web")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "web" ? "bg-white text-slate-950 shadow-md shadow-white/10" : "text-slate-400 hover:text-white"
                }`}
              >
                Web & Realtime
              </button>
              <button 
                onClick={() => setActiveTab("mobile")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "mobile" ? "bg-white text-slate-950 shadow-md shadow-white/10" : "text-slate-400 hover:text-white"
                }`}
              >
                Mobile
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
                  className="bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-400/5 transition-all flex flex-col justify-between group relative"
                >
                  <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-cyan-500/10 rounded-full blur-2xl"></div>
                  </div>

                  <div className="p-6 space-y-4 relative z-10">
                    {/* Visual header with colored bar context */}
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-md font-mono tracking-widest font-semibold capitalize text-cyan-400">
                        {categoryLabels[project.category]}
                      </span>
                      <span className="text-slate-600 text-[10px] font-mono">PROJECT_{project.id.substring(0,3).toUpperCase()}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                    
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {project.shortDescription}
                    </p>

                    {/* Numeric key indicators metric row */}
                    {project.metrics && project.metrics.length > 0 && (
                      <div
                        className="grid gap-2 bg-slate-950/40 p-3 rounded-xl border border-slate-800"
                        style={{ gridTemplateColumns: `repeat(${project.metrics.length}, minmax(0, 1fr))` }}
                      >
                        {project.metrics.map((met, mIdx) => (
                          <div key={mIdx} className="text-center px-1">
                            <p className="text-cyan-400 font-mono font-bold text-sm sm:text-base leading-tight break-words">{met?.value || ''}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{met?.label || ''}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {project.links && project.links.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {project.links.map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" /> {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-950/40 border-t border-slate-900 flex justify-between items-center sm:px-6 relative z-10">
                    <button 
                      onClick={() => setSelectedProject(project)}
                      className="text-xs text-cyan-400 hover:text-cyan-400 font-bold tracking-wide flex items-center gap-1 cursor-pointer transition-colors"
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

          <p className="text-center text-[11px] text-slate-500 font-mono max-w-4xl mx-auto">
            * Metriche e risultati si riferiscono alle piattaforme aziendali su cui ho contribuito in team.
          </p>
        </section>

        {/* COME LAVORO — DEMO INTERATTIVE */}
        <section id="how-section" className="py-16 border-t border-slate-900/60 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">Come lavoro</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Infrastruttura, automazioni e console — dal vivo</h2>
            <p className="text-slate-400 text-sm">
              Tre demo interattive che mostrano come lavoro sul campo: scaling di un cluster containerizzato, workflow automatizzati e una console per esplorare il CV.
              <span className="text-slate-500"> Simulazioni a scopo dimostrativo.</span>
            </p>
          </div>

          {/* 01 — Infrastruttura containerizzata */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">01</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Infrastruttura containerizzata</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Un ecosistema multi-dominio dietro reverse proxy Nginx con autoscaling delle repliche in base al carico. Regola repliche e profilo di traffico.
            </p>
            <DevOpsSandbox />
          </div>

          {/* 02 — Automazioni & pipeline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">02</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Automazioni &amp; pipeline</h3>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 relative overflow-hidden">
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
                      Esegui i workflow reali su cui lavoro ordinariamente: la pipeline AI del progetto Geppo, il deploy Kubernetes via CI/CD e l'auto-branching Git di ToDo.
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
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                      } ${pipelineRunning ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <p className="text-xs font-bold font-mono text-cyan-400 mb-1 uppercase tracking-wider">
                        {recipeKey === "ai-triage" ? "🧠 GEPPO AI" : recipeKey === "k8s-deploy" ? "☸️ K8S DEPLOY" : "🛠️ TODO SYSTEM"}
                      </p>
                      <p className="text-xs font-bold truncate">{RECIPES_DATA[recipeKey].title}</p>
                    </button>
                  );
                })}
              </div>

              {/* Connected Flowchart Graph nodes */}
              <div className="p-6 bg-slate-950/40 rounded-2xl border border-slate-800 relative z-10 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 font-mono text-xs text-center">
                  {RECIPES_DATA[selectedRecipe].nodes.map((node, nIdx) => {
                    const isActive = pipelineStep === nIdx;
                    const isCompleted = pipelineStep > nIdx || (pipelineStep === -1 && pipelineLogs.length > 2);

                    return (
                      <React.Fragment key={node.id}>
                        <div
                          className={`flex flex-col items-center p-4 rounded-xl border w-full max-w-[170px] transition-all duration-300 bg-slate-900/90 relative ${
                            isActive
                              ? "border-cyan-400/80 shadow-lg shadow-cyan-400/10 ring-1 ring-cyan-400/20 scale-105"
                              : isCompleted
                                ? "border-emerald-500/40 text-slate-300"
                                : "border-slate-800 text-slate-500"
                          }`}
                        >
                          {isActive && (
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
                          )}

                          <span className={`p-1.5 rounded-lg mb-2 ${
                            isActive
                              ? "bg-cyan-500/20 text-cyan-400"
                              : isCompleted
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-slate-950 text-slate-600"
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

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-900">
                  <div className="text-slate-400 text-xs max-w-md">
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
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 h-40 overflow-y-auto font-mono text-[11px] leading-relaxed text-zinc-300 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
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
            </div>
          </div>

          {/* 03 — Console interattiva */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">03</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Console interattiva</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Se preferisci la riga di comando, digita <span className="font-mono text-cyan-400">help</span> per esplorare competenze, progetti ed esperienza.
            </p>
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
          </div>
        </section>

        {/* CONTACT SECTION / CONNECT WITH ME */}
        <section id="contact-section" className="py-16 border-t border-slate-900/60 max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs text-cyan-400 font-mono tracking-widest uppercase">Contatti</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white m-0 font-sans">Parliamone</h2>
            <p className="text-slate-400 text-sm">Aperto a opportunità da Software Engineer, consulenze AI/DevOps e collaborazioni tecniche. Ti rispondo entro 24–48 ore.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left direct channel info details */}
            <div className="md:col-span-5 space-y-6">
              <h4 className="font-bold text-white tracking-tight text-lg">Canali Diretti</h4>
              
              <div className="space-y-4">
                <a 
                  href={`mailto:${CONTACT.email}`} 
                  className="flex items-center gap-3.5 p-4 bg-slate-900/40 border border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-cyan-400/5 transition-all rounded-2xl group cursor-pointer"
                >
                  <Mail className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-mono leading-none uppercase">Scrivimi via E-mail</p>
                    <p className="text-sm text-slate-200 mt-1.5 font-bold select-all">{CONTACT.email}</p>
                  </div>
                </a>

                <div 
                  className="flex items-center gap-3.5 p-4 bg-slate-900/40 border border-slate-800 rounded-2xl"
                >
                  <Phone className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-[10px] text-slate-500 font-mono leading-none uppercase">Zona e Disponibilità</p>
                    <p className="text-sm text-slate-200 mt-1.5 font-bold">{CONTACT.location}</p>
                  </div>
                </div>
              </div>

              {/* Social networking buttons row */}
              <div className="flex gap-3">
                <a 
                  href={CONTACT.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="Profilo GitHub"
                  className="w-11 h-11 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:text-cyan-400 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href={CONTACT.linkedin} 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="Profilo LinkedIn"
                  className="w-11 h-11 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:text-cyan-400 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
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
                    <h4 className="font-bold text-white text-lg tracking-tight">Ci siamo quasi!</h4>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Si è aperto il tuo client di posta con il messaggio già compilato: invialo per completare il contatto.
                      Se non si è aperto nulla, scrivimi direttamente a{" "}
                      <a href={`mailto:${CONTACT.email}`} className="text-cyan-400 hover:text-cyan-300 font-semibold">
                        {CONTACT.email}
                      </a>.
                    </p>
                  </div>
                  <button 
                    onClick={() => setFormSubmitted(false)}
                    className="text-xs text-cyan-400 font-bold hover:text-cyan-400 mt-4 cursor-pointer"
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
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/80 transition-colors"
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
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/80 transition-colors"
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
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/80 transition-colors resize-none"
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
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative"
            >
              
              {/* Modal Banner decorative accent */}
              <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-cyan-400 to-blue-500" />
              
              {/* Close button icon indicator */}
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
                <div>
                  <span className="text-[10px] text-cyan-400 font-mono tracking-widest block uppercase font-bold">Dettaglio Tecnico Completo</span>
                  <h3 id="project-modal-title" className="text-2xl font-bold text-white tracking-tight mt-1">{selectedProject.title}</h3>
                </div>

                <div className="space-y-4">
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
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
                {selectedProject.metrics && selectedProject.metrics.length > 0 && (
                  <div
                    className="grid gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800"
                    style={{ gridTemplateColumns: `repeat(${selectedProject.metrics.length}, minmax(0, 1fr))` }}
                  >
                    {selectedProject.metrics.map((m, idx) => (
                      <div key={idx} className="text-center px-1">
                        <p className="text-cyan-400 font-mono font-bold text-base sm:text-lg leading-tight break-words">{m?.value || ''}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{m?.label || ''}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Lower tag cloud row */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedProject.tags.map((tag) => (
                    <span key={tag} className="text-[10px] bg-slate-800 text-slate-300 px-3 py-1 rounded-md font-mono text-cyan-400 font-semibold bg-cyan-500/10 border border-cyan-500/10">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer action buttons */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  {selectedProject.links && selectedProject.links.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3 py-2 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> {link.label}
                        </a>
                      ))}
                    </div>
                  ) : <span />}
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
        <p>&copy; {new Date().getFullYear()} {CONTACT.name}. Tutti i diritti riservati.</p>
        <div className="flex items-center justify-center gap-4 text-slate-400">
          <a href={`mailto:${CONTACT.email}`} className="hover:text-cyan-400 transition-colors">E-mail</a>
          <a href={CONTACT.github} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">GitHub</a>
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">LinkedIn</a>
          <a href={CONTACT.cvUrl} download className="hover:text-cyan-400 transition-colors">CV</a>
        </div>
        <div className="flex items-center justify-center gap-2 text-slate-600 mt-1">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
          <span>Disponibile per nuove collaborazioni</span>
        </div>
      </footer>

    </div>
  );
}
