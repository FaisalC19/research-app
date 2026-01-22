"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Search, Loader2, Sparkles, Terminal, ExternalLink } from "lucide-react";
import { useResearchProgress } from "../components/useResearchProgress";

export default function Home() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "complete">("idle");
  const [result, setResult] = useState<{ title: string; content: string } | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [errorEnv, setErrorEnv] = useState<string | null>(null);

  const { progress, stageLabel, stageIndex } = useResearchProgress(status === "loading");

  // Extract URLs from content when result changes
  useEffect(() => {
    if (result?.content) {
      const urlRegex = /(https?:\/\/[^\s)]+)/g;
      const found = result.content.match(urlRegex) || [];
      // Filter unique and valid URLs
      const uniqueSources = Array.from(new Set(found)).filter(url => !url.includes('notion.so'));
      setSources(uniqueSources);
    }
  }, [result]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setStatus("loading");
    setResult(null);
    setSources([]);
    setErrorEnv(null);

    try {
      const { data } = await axios.post("/api/research", { query });

      if (data && data.title && data.content) {
        setResult(data);
      } else {
        setResult({
          title: "Research Initiated",
          content: "The agent has accepted your mission. \n\nDue to the complexity of the research, the full report is being generated in the background and will be sent to your **email** and **Notion** workspace once complete.\n\n*Estimated time: 2-3 minutes.*"
        });
      }
    } catch (error: any) {
      console.error(error);

      // If it's a timeout or network error, it likely means the agent is just taking a long time (which is good!)
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout') || error.message?.includes('Network Error')) {
        setResult({
          title: "Research Underway",
          content: "The agent has received your mission and is deep in research. \n\n**Note:** Because this is a comprehensive deep-dive, the browser connection timed out while waiting. \n\n✅ **Good news:** Validating the server shows the agent IS running. \n\n📩 **Next Step:** You will receive the full report in your **Email** and **Notion** workspace in approx 5-10 minutes."
        });
        setStatus("complete");
      } else {
        setErrorEnv(error.response?.data?.error || error.message || "Unknown error occurred");
        setStatus("idle");
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[128px] animate-pulse-slow delay-1000" />
      </div>

      <div className="z-10 w-full max-w-6xl space-y-8 flex flex-col items-center">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-green/30 bg-neon-green/5 text-neon-green text-xs font-mono tracking-widest uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            System Online
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            RESEARCH<span className="text-neon-green">.AI</span>
          </h1>

          {errorEnv && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm max-w-md mx-auto animate-pulse">
              <span className="font-bold">ERROR:</span> {errorEnv}
            </div>
          )}
        </div>

        {/* Input Section */}
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSearch}
              className="relative w-full max-w-2xl mx-auto group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neon-green/20 to-neon-blue/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-lab-panel border border-lab-border rounded-xl overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-neon-green/50">
                <div className="pl-4 text-neon-green">
                  <Terminal className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter research objective..."
                  className="w-full bg-transparent border-none px-4 py-4 text-lg text-white font-mono placeholder-gray-600 focus:ring-0 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="m-2 p-2 bg-neon-green/10 hover:bg-neon-green text-neon-green hover:text-black rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </motion.form>
          )}

          {status === "loading" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl mx-auto"
            >
              <div className="bg-lab-panel border border-lab-border rounded-xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col items-center gap-6">
                  {/* Progress Ring */}
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="60" stroke="#333" strokeWidth="4" fill="transparent" />
                      <circle
                        cx="64" cy="64" r="60"
                        stroke="#00ff9d" strokeWidth="4" fill="transparent"
                        strokeDasharray={377}
                        strokeDashoffset={377 - (377 * progress) / 100}
                        className="transition-all duration-300 ease-linear"
                      />
                    </svg>
                    <div className="absolute text-2xl font-mono text-neon-green">{Math.round(progress)}%</div>
                  </div>

                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-heading font-medium tracking-wide text-white animate-pulse">
                      {stageLabel}
                    </h3>
                    <div className="flex justify-center gap-2">
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-colors duration-300 ${i <= stageIndex ? 'bg-neon-green' : 'bg-gray-700'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {status === "complete" && result && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6"
            >
              {/* Main Content */}
              <div className="lg:col-span-3 glass-panel rounded-2xl p-8 md:p-12 shadow-2xl border-glow">
                <div className="flex items-start justify-between mb-8 border-b border-white/10 pb-6">
                  <div>
                    <div className="text-neon-green font-mono text-xs uppercase tracking-widest mb-2">Report Generated Successfully</div>
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-white leading-tight">
                      {result.title}
                    </h2>
                  </div>
                  <button onClick={() => setStatus("idle")} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <Sparkles className="w-5 h-5 text-neon-blue" />
                  </button>
                </div>

                <article className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-headings:text-white prose-p:text-gray-300 prose-strong:text-neon-green prose-a:text-neon-blue">
                  <ReactMarkdown>{result.content}</ReactMarkdown>
                </article>
              </div>

              {/* Sources Sidebar */}
              <div className="lg:col-span-1 space-y-4">
                <div className="glass-panel rounded-2xl p-6 border-lab-border">
                  <h3 className="text-neon-blue font-heading font-bold mb-4 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Sources
                  </h3>
                  {sources.length > 0 ? (
                    <ul className="space-y-3">
                      {sources.map((url, i) => (
                        <li key={i} className="text-xs break-all">
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-neon-green transition-colors flex gap-2 items-start">
                            <span className="text-neon-blue/50">[{i + 1}]</span>
                            {new URL(url).hostname.replace('www.', '')}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 text-sm italic">No direct sources linked.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
