import { useState, useEffect, useCallback } from "react";
import { Key, Plus, Trash2, Copy, Check, Eye, EyeOff, Clock, Hash, ExternalLink } from "lucide-react";

const FONT_DISPLAY = "'Obviously Narrow', sans-serif";
const ADMIN_PASSCODE = "betterfly-admin-2025";

interface ApiKeyInfo {
  id: string;
  label: string;
  keyPreview: string;
  createdAt: string;
  lastUsedAt: string | null;
  usageCount: number;
  active: boolean;
}

interface NewKeyResponse {
  id: string;
  key: string;
  label: string;
  createdAt: string;
}

export function AdminApiKeys() {
  const [keys, setKeys] = useState<ApiKeyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<NewKeyResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  const fetchKeys = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/api-keys?adminPasscode=${ADMIN_PASSCODE}`);
      const data = await res.json();
      setKeys(data.keys || []);
    } catch (err) {
      console.error("Failed to fetch API keys:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  async function handleCreate() {
    if (!newLabel.trim()) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/admin/api-keys?adminPasscode=${ADMIN_PASSCODE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel.trim() }),
      });
      const data = await res.json();
      setNewKey(data);
      setNewLabel("");
      fetchKeys();
    } catch (err) {
      console.error("Failed to create key:", err);
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    try {
      await fetch(`/api/admin/api-keys/${id}?adminPasscode=${ADMIN_PASSCODE}`, { method: "DELETE" });
      fetchKeys();
    } catch (err) {
      console.error("Failed to revoke key:", err);
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const baseUrl = window.location.origin;

  return (
    <div className="min-h-screen bg-[#F7F7F5] px-6 py-10 lg:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Key size={24} className="text-[#042914]" />
          <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 36 }} className="text-[#042914] uppercase">
            API Keys
          </h1>
        </div>
        <p className="text-[#042914]/60 text-sm mb-8 max-w-xl">
          Create API keys so your teammates can integrate Brand Central data into their own tools and AI agents.
        </p>

        <div className="bg-white rounded-2xl border border-[#E2E0D9] p-6 mb-6">
          <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 20 }} className="text-[#042914] uppercase mb-4">
            Create New Key
          </h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreate()}
              placeholder="Label (e.g. Sandy's Agent, Marketing Bot)"
              className="flex-1 px-4 py-3 rounded-xl border border-[#E2E0D9] text-sm focus:outline-none focus:border-[#19F578] transition-colors"
            />
            <button
              onClick={handleCreate}
              disabled={creating || !newLabel.trim()}
              className="flex items-center gap-2 bg-[#042914] text-white text-xs font-bold uppercase tracking-wider rounded-xl px-6 py-3 hover:bg-[#042914]/90 transition-colors disabled:opacity-40"
            >
              <Plus size={14} />
              Create
            </button>
          </div>
        </div>

        {newKey && (
          <div className="bg-[#042914] rounded-2xl p-6 mb-6 text-white">
            <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18 }} className="uppercase mb-1 text-[#19F578]">
              Key Created: {newKey.label}
            </h3>
            <p className="text-white/50 text-xs mb-4">
              Copy this key now — you won't be able to see it again.
            </p>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 mb-4">
              <code className="flex-1 text-sm font-mono text-[#19F578] break-all select-all">{newKey.key}</code>
              <button onClick={() => handleCopy(newKey.key)} className="text-white/60 hover:text-white transition-colors">
                {copied ? <Check size={16} className="text-[#19F578]" /> : <Copy size={16} />}
              </button>
            </div>
            <button onClick={() => setNewKey(null)} className="text-white/40 text-xs hover:text-white/60 transition-colors">
              Dismiss
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#E2E0D9] p-6 mb-6">
          <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 20 }} className="text-[#042914] uppercase mb-4">
            Active Keys
          </h2>
          {loading ? (
            <p className="text-[#042914]/40 text-sm">Loading...</p>
          ) : keys.filter(k => k.active).length === 0 ? (
            <p className="text-[#042914]/40 text-sm">No API keys yet. Create one above to get started.</p>
          ) : (
            <div className="space-y-3">
              {keys.filter(k => k.active).map(k => (
                <div key={k.id} className="flex items-center gap-4 bg-[#F7F7F5] rounded-xl px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[#042914] font-bold text-sm">{k.label}</p>
                    <div className="flex items-center gap-4 text-[#042914]/40 text-xs mt-1">
                      <span className="font-mono">{k.keyPreview}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {new Date(k.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Hash size={10} /> {k.usageCount} calls</span>
                      {k.lastUsedAt && <span>Last used {new Date(k.lastUsedAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevoke(k.id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-2"
                    title="Revoke key"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {keys.filter(k => !k.active).length > 0 && (
            <div className="mt-6 pt-4 border-t border-[#E2E0D9]">
              <p className="text-[#042914]/30 text-xs uppercase font-bold tracking-wider mb-2">Revoked Keys</p>
              {keys.filter(k => !k.active).map(k => (
                <div key={k.id} className="flex items-center gap-4 text-[#042914]/30 text-xs py-1.5">
                  <span className="line-through">{k.label}</span>
                  <span className="font-mono">{k.keyPreview}</span>
                  <span>{k.usageCount} calls</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E0D9] p-6">
          <button onClick={() => setShowDocs(!showDocs)} className="flex items-center gap-2 w-full">
            <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 20 }} className="text-[#042914] uppercase flex-1 text-left">
              API Documentation
            </h2>
            {showDocs ? <EyeOff size={16} className="text-[#042914]/40" /> : <Eye size={16} className="text-[#042914]/40" />}
          </button>

          {showDocs && (
            <div className="mt-4 space-y-4 text-sm text-[#042914]/70">
              <div className="bg-[#042914] rounded-xl p-4 text-white/80 font-mono text-xs">
                <p className="text-[#19F578] mb-2"># Authentication — add to all requests:</p>
                <p>Authorization: Bearer bf_your_api_key_here</p>
              </div>

              <div>
                <h3 className="font-bold text-[#042914] mb-2">Available Endpoints</h3>
                <div className="space-y-3">
                  {[
                    { method: "GET", path: "/api/v1/brand/voice", desc: "Brand voice guidelines, tone, approved terminology, glossary" },
                    { method: "GET", path: "/api/v1/brand/visual", desc: "Visual design tokens — colors, typography" },
                    { method: "GET", path: "/api/v1/playbooks", desc: "List all audience playbooks (carriers, brokers, employers, employees)" },
                    { method: "GET", path: "/api/v1/playbooks/:audience", desc: "Full playbook for a specific audience — pillars, messages, proof points" },
                    { method: "GET", path: "/api/v1/trends", desc: "Latest industry trends data" },
                    { method: "GET", path: "/api/v1/competitors", desc: "Competitor landscape data" },
                    { method: "GET", path: "/api/v1/intel-digest", desc: "Latest intel digest analysis" },
                    { method: "POST", path: "/api/v1/generate", desc: "Generate a brand-approved asset (one-pager, two-pager, deck, LinkedIn post)" },
                  ].map(ep => (
                    <div key={ep.path} className="bg-[#F7F7F5] rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${ep.method === "GET" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{ep.method}</span>
                        <code className="text-xs font-mono text-[#042914]">{ep.path}</code>
                      </div>
                      <p className="text-xs text-[#042914]/50">{ep.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#042914] mb-2">Generate Asset (POST /api/v1/generate)</h3>
                <div className="bg-[#042914] rounded-xl p-4 text-white/80 font-mono text-xs whitespace-pre">{`curl -X POST ${baseUrl}/api/v1/generate \\
  -H "Authorization: Bearer bf_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "format": "one-pager",
    "audience": "brokers",
    "objective": "Pitch voluntary benefits to an SMB broker"
  }'

# Formats: one-pager, two-pager, short-deck,
#           linkedin-post, social-impact-one-pager
# Audiences: carriers, brokers, employers,
#             employees, industry`}</div>
              </div>

              <div>
                <h3 className="font-bold text-[#042914] mb-2">Quick Start Example</h3>
                <div className="bg-[#042914] rounded-xl p-4 text-white/80 font-mono text-xs whitespace-pre">{`# Get brand voice for your agent's system prompt
curl ${baseUrl}/api/v1/brand/voice \\
  -H "Authorization: Bearer bf_your_key"

# Get broker playbook
curl ${baseUrl}/api/v1/playbooks/brokers \\
  -H "Authorization: Bearer bf_your_key"

# Get latest intel digest
curl ${baseUrl}/api/v1/intel-digest \\
  -H "Authorization: Bearer bf_your_key"`}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
