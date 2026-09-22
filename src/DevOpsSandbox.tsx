import React, { useState, useEffect, useRef } from "react";
import { Activity, Minus, Plus } from "lucide-react";

export default function DevOpsSandbox() {
  const [clusterServices, setClusterServices] = useState([
    { id: "web", name: "deploy/nginx-proxy", label: "Reverse Proxy (Nginx)", replicas: 2, max: 4, type: "container", color: "cyan" },
    { id: "core", name: "deploy/ceposto-app", label: "CePosto App (PHP 8.3 / Tomcat)", replicas: 2, max: 6, type: "container", color: "indigo" },
    { id: "db", name: "svc/mariadb", label: "MariaDB (host)", replicas: 1, max: 2, type: "db", color: "emerald" }
  ]);
  const [trafficScale, setTrafficScale] = useState<"idle" | "normal" | "surge">("normal");
  const [customChartHistory, setCustomChartHistory] = useState<number[]>([15, 25, 42, 35, 50, 45, 62, 58]);
  const [clusterLogsList, setClusterLogsList] = useState<string[]>([
    "CLUSTER_INIT: cluster k3s online, namespace di produzione pronto.",
    "INGRESS: nginx-proxy esposto pubblicamente (rete reverse_proxy_net).",
    "APP_BOOT: container ceposto-app attivo (Apache + PHP 8.3 / Tomcat).",
    "DB_CONNECT: pool di connessioni verso MariaDB stabilito."
  ]);
  const devopsLogsRef = useRef<HTMLDivElement>(null);

  // Infinite, organic live stream ticker for DevOps Sandbox Console
  useEffect(() => {
    const SCALE_TARGETS: Record<"idle" | "normal" | "surge", Record<string, number>> = {
      idle: { web: 1, core: 1, db: 1 },
      normal: { web: 2, core: 2, db: 1 },
      surge: { web: 4, core: 6, db: 2 }
    };

    const handleDevOpsTick = () => {
      const timestamps = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

      const targets = SCALE_TARGETS[trafficScale];
      const scaled = clusterServices.map(srv => {
        const target = Math.min(targets[srv.id] ?? srv.replicas, srv.max);
        if (srv.replicas === target) return srv;
        const nextReplicas = srv.replicas < target ? srv.replicas + 1 : srv.replicas - 1;
        return { ...srv, replicas: nextReplicas };
      });
      const autoscaleLogs = scaled
        .filter((s, i) => s.replicas !== clusterServices[i].replicas)
        .map(s => `[${timestamps}] [INF] HPA: '${s.name}' → ${s.replicas} repliche (profilo '${trafficScale}').`);

      if (autoscaleLogs.length > 0) setClusterServices(scaled);

      const webCount = scaled.find(s => s.id === "web")?.replicas || 1;
      const coreCount = scaled.find(s => s.id === "core")?.replicas || 1;
      const dbCount = scaled.find(s => s.id === "db")?.replicas || 1;

      let baseVal = 40;
      if (trafficScale === "idle") baseVal = 12;
      if (trafficScale === "surge") baseVal = 85;

      const loadFactor = Math.max(8, baseVal - (webCount * 4 + coreCount * 6 + dbCount * 3));
      const actualLoad = Math.min(99, Math.round(loadFactor + Math.random() * 8));

      setCustomChartHistory(prev => {
        const next = [...prev.slice(1), actualLoad];
        return next;
      });

      const prefixes = ["INF", "DEB", "INF", "WRN", "INF"];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

      let logBody = "";
      const randomMsg = Math.random();
      if (trafficScale === "surge") {
        if (randomMsg < 0.3) {
          logBody = `TRAFFIC: burst di ${Math.floor(180 + Math.random() * 200)} richieste in ingresso sul reverse proxy.`;
        } else if (randomMsg < 0.6) {
          logBody = `PROXY_HEALTH: upstream ceposto-app 200 OK (latency: ${Math.floor(40 + Math.random() * 110)}ms).`;
        } else {
          logBody = actualLoad > 75
            ? `HPA: carico cluster ${actualLoad}%, scaling orizzontale dei pod in corso.`
            : `SYS_BALANCED: carico stabilizzato dallo scaling automatico delle repliche.`;
        }
      } else if (trafficScale === "idle") {
        if (randomMsg < 0.5) logBody = `IDLE: nessuna richiesta in ingresso. Ping MariaDB 1.4ms.`;
        else logBody = `CRON: n8n in attesa, nessun job schedulato in coda.`;
      } else {
        if (randomMsg < 0.25) logBody = `INGRESS: GET /api/v1/appuntamenti - 200 OK (Nginx upstream).`;
        else if (randomMsg < 0.5) logBody = `MARIADB: pool connessioni ${Math.floor(1 + Math.random() * 3)} attive / 10 idle.`;
        else if (randomMsg < 0.75) logBody = `N8N: workflow 'ToDo GitLab AutoBrancher' completato.`;
        else logBody = `DOCKER: healthcheck ceposto-app: healthy.`;
      }

      setClusterLogsList(prev => {
        const next = [...prev, ...autoscaleLogs, `[${timestamps}] [${prefix}] ${logBody}`];
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

  const scaleService = (id: string, dir: "up" | "down") => {
    setClusterServices(prev => prev.map(srv => {
      if (srv.id === id) {
        let newReplicas = srv.replicas;
        if (dir === "up" && srv.replicas < srv.max) newReplicas += 1;
        if (dir === "down" && srv.replicas > 1) newReplicas -= 1;

        if (newReplicas !== srv.replicas) {
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

  return (
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
          <Activity className="w-3 h-3 animate-pulse" /> STATUS: HEALTHY
        </div>
      </div>

      {/* Grid content split: Interactive controls & SVG graphics metrics */}
      <div className="p-5 space-y-5">

        {/* Section A: Replica Instance Tuner Blocks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Orchestratore Sandbox Repliche</p>
            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
              trafficScale === "surge"
                ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
                : "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
            }`}>
              HPA: {trafficScale === "surge" ? "AUTO-SCALING" : "STABLE"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {clusterServices.map((srv) => (
              <div key={srv.id} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
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
                  <div className="flex gap-1 items-center shrink-0 mr-1.5">
                    {Array.from({ length: srv.max }).map((_, bIdx) => {
                      const isActiveInstance = bIdx < srv.replicas;
                      return (
                        <span
                          key={bIdx}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
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
                      className="p-1 px-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-mono font-bold px-2 text-white shrink-0 min-w-[14px] text-center">
                      {srv.replicas}
                    </span>
                    <button
                      onClick={() => scaleService(srv.id, "up")}
                      disabled={srv.replicas >= srv.max}
                      className="p-1 px-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer text-xs"
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
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 h-[115px] flex flex-col justify-between">
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
                        : "bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-200"
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

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 h-[115px] relative overflow-hidden flex flex-col justify-between">
              <div className="w-full h-16 relative">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="svgGradientGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <line x1="0%" y1="25%" x2="100%" y2="25%" stroke="#1e293b" strokeDasharray="2,3" strokeWidth="1" />
                  <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#1e293b" strokeDasharray="2,3" strokeWidth="1" />
                  <line x1="0%" y1="75%" x2="100%" y2="75%" stroke="#1e293b" strokeDasharray="2,3" strokeWidth="1" />

                  <path
                    d={`
                      M 0,64
                      ${customChartHistory.map((val, idx) => {
                        const x = (idx / 7) * 100;
                        const y = 64 - (val / 100) * 58;
                        return `L ${x}%,${y}`;
                      }).join(" ")}
                      L 100%,64 Z
                    `}
                    fill="url(#svgGradientGlow)"
                  />

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
  );
}
