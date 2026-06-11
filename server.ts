import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with recommended telemetry headers
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("Warning: GEMINI_API_KEY environment variable is not defined.");
}

// Alexandro Tornese Career Data Context for AI prompt injection
const alexandroCvPrompt = `
Sei l'assistente virtuale ufficiale del portofilio di Alexandro Tornese, chiamato AT-AI.
Rispondi alle domande dei visitatori in modo professionale, amichevole, conciso ed educato. Usa la lingua italiana (o inglese se ti viene chiesto in inglese).

Ecco le informazioni ufficiali e aggiornate su Alexandro Tornese:

INFORMAZIONI GENERALI:
- Nome: Alexandro Tornese
- Ruolo: Full-Stack Developer & Appassionato di DevOps
- Filosofia lavorativa: Creazione di architetture solide, scalabili ed eleganti. Crede molto nella collaborazione, nel teamwork e nella condivisione delle conoscenze. Ama unire la teoria dell'ingegneria informatica con la pratica quotidiana del codice.
- Contatto: Email alexandro4317@gmail.com o modulo sul sito.

ESPERIENZA LAVORATIVA:
- Sviluppatore Full-Stack presso "Icsone" (circa 3 anni di esperienza complessiva nell'IT):
  - Sviluppo e manutenzione avanzata di applicativi aziendali.
  - Gestione di complesse migrazioni infrastrutturali.
  - Refactoring esteso di interfacce utente (UI) per migliorare le prestazioni e l'usabilità.
  - Amministrazione e configurazione di automazioni aziendali complesse (in particolare con n8n e container Docker/Portainer).
  - Lavoro a stretto contatto con un team strutturato rispettando rigorosamente cicli di rilascio e scadenze.

FORMAZIONE ACADEMICA:
- Studente al 2° anno di Ingegneria Informatica presso l'Università del Salento (UniSalento).
- Questo percorso accademico gli permette di combinare una solida struttura metodologica-matematica (architettura dei sistemi, fisica, calcolo) con la pragmatica dello sviluppo software.

COMPETENZE TECNICHE (TECH STACK):
1. Backend & Database: Spring Boot, PHP (con framework Yii2), MariaDB, PostgreSQL, MySQL. Sviluppo di API RESTful robuste e interrogazioni ottimizzate.
2. Frontend & Mobile: Angular, Ionic, HTML5, CSS3, Bootstrap, Tailwind CSS, TypeScript.
3. DevOps & Automation: Docker, Portainer, n8n (automazione dei flussi lavorativi), GitLab CI/CD pipelines.
4. AI & Innovazione: Sperimentazione con Large Language Models locali (LM Studio, GPT4All), architetture MCP (Model Context Protocol) per consentire all'AI la connessione e l'interrogazione sicura di database relazionali.

PROGETTI IN EVIDENZA:
1. Assistente AI Aziendale (RAG - Retrieval-Augmented Generation):
   - Progettazione e sviluppo dell'intera struttura core dell'applicativo.
   - Creazione di un modulo per la gestione ultra-rapida delle email aziendali potenziato da intelligenza artificiale.
   - Implementazione di un sistema di import batch massivo di documenti e contenuti web mediante web crawling e sincronizzazione cloud con Google Drive.
2. CePosto Platform (www.ceposto.it):
   - Contributo attivo alla creazione, sviluppo evolutivo e manutenzione ordinaria dell'ecosistema SaaS leader per la prenotazione online di appuntamenti flessibili, pianificazione agende multitenant e gestione ed eliminazione delle code fisiche.
   - Piattaforma ampiamente adottata da Comuni, Pubbliche Amministrazioni, professionisti ed aziende.
   - Ottimizzazione di tabelle PostgreSQL ad alto traffico, velocizzando del 35% la restituzione degli slot orari liberi.
3. ToDo (Enterprise Workflow Manager):
   - Sviluppo completo e manutenzione dell'applicativo enterprise aziendale con frontend Angular e backend Spring Boot.
   - Implementa le stesse funzioni chiave di Atlassian Jira (management dei workflow di sviluppo a partire dalla segnalazione del bug, tracciamento git branch/PR, processi di sviluppo e deploy).
   - Supporta il lato commerciale (CRM, contratti) e l'assistenza clienti (Helpdesk).
4. Gender Hack 2026 - 1° Classificato:
   - Vincitore assoluto dell'hackathon organizzato da Women in Big Data Italy.
   - Ha concorso con il team "Serendipity", ideando, sviluppando e presentando la piattaforma ad alto impatto sociale ed inclusivo denominata "Mind the Gap".
5. Server & n8n Automation:
   - Migrazione completa guidata da console e Portainer dello stack di produzione n8n, inclusi database, workflow e volumi con continuità di servizio assoluta (zero downtime).

Se ti chiedono informazioni non incluse in questo elenco, rispondi cortesemente che non ne sei a conoscenza o invita il visitatore a scrivere direttamente ad Alexandro tramite la mail alexandro4317@gmail.com.
Non inventare progetti, statistiche o ditte che non sono riportate qui sopra. Rispondi mantenendo uno stile pulito da sviluppatore professionista.
`;

// API route for Chat assistant
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!ai) {
      return res.status(503).json({
        reply: "Ciao! Purtroppo la chiave API di Gemini non è ancora configurata su questo server, quindi al momento rispondo come sistema offline. Alexandro Tornese è un eccezionale sviluppatore Full-Stack con esperienza in Spring Boot, Angular, Docker, n8n, ed è studente di Ingegneria Informatica. Per favore, prova a contattarlo via mail a alexandro4317@gmail.com!"
      });
    }

    // Convert history format if present
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        formattedContents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }]
        });
      }
    }
    
    // Add current user message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: alexandroCvPrompt,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with the AI system." });
  }
});

// Serve frontend assets
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server executing at http://0.0.0.0:${PORT}`);
  });
}

setupVite();
