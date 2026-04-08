import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Trash2, Edit2, Check, X, AlertTriangle, RefreshCw, Sparkles, Save,
  Clock, Eye, CheckCircle, XCircle, Send, Settings, BarChart2, ExternalLink,
  Shield, ShieldOff, Play, ChevronDown, ChevronUp,
} from "lucide-react";

const ADMIN_PASSCODE = "betterfly-admin-2025";

function headers() {
  return { "Content-Type": "application/json", "x-admin-passcode": ADMIN_PASSCODE };
}

interface DataPoint {
  text: string;
  source_name: string;
  source_url: string;
  verified: boolean;
}

interface Theme {
  id: string;
  title: string;
  summary: string;
  data_points: DataPoint[];
  source: string;
  relevance: string[];
}

interface TrendsData {
  report_date: string;
  themes: Theme[];
}

interface StagedItem {
  id: string;
  type: "trend_update" | "competitor_update";
  status: "pending" | "accepted" | "discarded";
  fetched_at: string;
  source_feed?: string;
  category?: string;
  proposed?: Omit<Theme, "id">;
  competitor_id?: string;
  competitor_name?: string;
  field?: string;
  proposed_value?: { text: string; source_url: string; source_name: string };
}

interface StagingData {
  trend_updates: StagedItem[];
  competitor_updates: StagedItem[];
}

interface JobLog {
  run_id: string;
  started_at: string;
  completed_at: string | null;
  trends_fetched: number;
  competitors_processed: number;
  staging_written: number;
  errors: string[];
  status: "running" | "success" | "error";
}

interface SourcesConfig {
  notification_webhook: string;
  notification_email: string;
  rss_feeds: { url: string; label: string; domain: string }[];
  trusted_domains: { domain: string; category: string; type: string }[];
  pdf_domains: string[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function normalizeDataPoint(dp: any): DataPoint {
  if (typeof dp === "string") return { text: dp, source_name: "", source_url: "", verified: false };
  return { text: dp.text || "", source_name: dp.source_name || "", source_url: dp.source_url || "", verified: dp.verified === true };
}

type Tab = "live" | "pending" | "history" | "sources";

// ── Live Trends Tab ───────────────────────────────────────────────────────────
function DataPointEditor({ dp, onChange, onRemove }: {
  dp: DataPoint;
  onChange: (dp: DataPoint) => void;
  onRemove: () => void;
}) {
  return (
    <div className="border border-neutral-200 rounded-xl p-3 bg-neutral-100 space-y-2">
      <div className="flex items-start gap-2">
        <input
          value={dp.text}
          onChange={e => onChange({ ...dp, text: e.target.value })}
          placeholder="Data point text..."
          className="flex-1 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400 bg-white"
        />
        <button onClick={onRemove} className="w-6 h-6 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 shrink-0 mt-0.5">
          <X size={11} className="text-red-400" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          value={dp.source_name}
          onChange={e => onChange({ ...dp, source_name: e.target.value })}
          placeholder="Source name"
          className="border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400 bg-white"
        />
        <input
          value={dp.source_url}
          onChange={e => onChange({ ...dp, source_url: e.target.value })}
          placeholder="Source URL (https://...)"
          className="border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400 bg-white"
        />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={dp.verified}
          onChange={e => onChange({ ...dp, verified: e.target.checked })}
          className="rounded"
        />
        <span className="text-xs text-neutral-500">Mark as source-verified</span>
        {dp.verified ? <Shield size={11} className="text-green-400" /> : <ShieldOff size={11} className="text-orange-400" />}
      </label>
    </div>
  );
}

function EditableTheme({ theme, onSave, onDelete }: {
  theme: Theme;
  onSave: (updated: Theme) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(theme);

  const dataPoints = (draft.data_points || []).map(normalizeDataPoint);
  const rawDataPoints = (theme.data_points || []).map(normalizeDataPoint);
  const unverifiedCount = rawDataPoints.filter(dp => !dp.verified).length;

  function handleSave() {
    onSave({ ...draft, data_points: dataPoints });
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 group">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-bold text-green-950 text-sm leading-snug">{theme.title}</h3>
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button onClick={() => { setDraft(theme); setEditing(true); }} className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-300 flex items-center justify-center transition-colors">
              <Edit2 size={12} className="text-green-950" />
            </button>
            <button onClick={onDelete} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors">
              <Trash2 size={12} className="text-red-500" />
            </button>
          </div>
        </div>
        <p className="text-neutral-500 text-xs leading-relaxed mb-3">{theme.summary}</p>
        {unverifiedCount > 0 && (
          <div className="flex items-center gap-1.5 text-orange-500 text-[11px] font-semibold mb-2">
            <AlertTriangle size={11} /> {unverifiedCount} unverified data point{unverifiedCount > 1 ? "s" : ""} — will not be injected into asset prompts
          </div>
        )}
        <ul className="space-y-1.5 mb-3">
          {rawDataPoints.map((dp, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className={`text-xs mt-0.5 shrink-0 ${dp.verified ? "text-green-400" : "text-orange-400"}`}>
                {dp.verified ? "•" : "⚠️"}
              </span>
              <span className="text-xs text-neutral-600 flex-1">
                {dp.text}
                {dp.source_url && (
                  <a href={dp.source_url} target="_blank" rel="noreferrer" className="ml-1.5 text-green-950/30 hover:text-green-400 transition-colors inline-flex items-center gap-0.5">
                    <ExternalLink size={9} />
                  </a>
                )}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-neutral-300 italic">{theme.source}</span>
          <div className="flex flex-wrap gap-1 justify-end">
            {theme.relevance.map(r => (
              <span key={r} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-green-950/8 text-green-950/60">{r}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-green-400 rounded-2xl p-5">
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">Title</label>
          <input value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">Summary</label>
          <textarea value={draft.summary} onChange={e => setDraft(d => ({ ...d, summary: e.target.value }))} className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400" rows={3} />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            Data Points
            <span className="ml-2 text-neutral-300 normal-case font-normal">— verified points are injected into AI prompts</span>
          </label>
          <div className="space-y-2">
            {dataPoints.map((dp, i) => (
              <DataPointEditor
                key={i}
                dp={dp}
                onChange={updated => {
                  const newDps = [...dataPoints];
                  newDps[i] = updated;
                  setDraft(d => ({ ...d, data_points: newDps }));
                }}
                onRemove={() => setDraft(d => ({ ...d, data_points: dataPoints.filter((_, j) => j !== i) }))}
              />
            ))}
            <button
              onClick={() => setDraft(d => ({ ...d, data_points: [...dataPoints, { text: "", source_name: "", source_url: "", verified: false }] }))}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-500 hover:bg-neutral-300 transition-colors"
            >
              <Plus size={11} /> Add data point
            </button>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">Source</label>
          <input value={draft.source} onChange={e => setDraft(d => ({ ...d, source: e.target.value }))} className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">Relevance</label>
          <div className="flex flex-wrap gap-2">
            {["Carriers", "Brokers", "Employers", "Employees", "General"].map(r => (
              <button key={r} onClick={() => setDraft(d => ({ ...d, relevance: d.relevance.includes(r) ? d.relevance.filter(x => x !== r) : [...d.relevance, r] }))}
                className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${draft.relevance.includes(r) ? "bg-green-950 text-white" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-300"}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-green-400 text-green-950 hover:bg-green-400/80 transition-colors">
          <Check size={12} /> Save
        </button>
        <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-neutral-100 text-neutral-500 hover:bg-neutral-300 transition-colors">
          <X size={12} /> Cancel
        </button>
      </div>
    </div>
  );
}

// ── Pending Review Tab ────────────────────────────────────────────────────────
function PendingReviewTab() {
  const qc = useQueryClient();
  const { data: staging, isLoading } = useQuery<StagingData>({
    queryKey: ["/api/admin/staging"],
    queryFn: () => fetch("/api/admin/staging", { headers: headers() }).then(r => r.json()),
  });

  const accept = useMutation({
    mutationFn: (id: string) => fetch(`/api/admin/staging/accept/${id}`, { method: "POST", headers: headers() }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/staging"] }),
  });
  const discard = useMutation({
    mutationFn: (id: string) => fetch(`/api/admin/staging/${id}`, { method: "DELETE", headers: headers() }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/staging"] }),
  });
  const publish = useMutation({
    mutationFn: () => fetch("/api/admin/staging/publish", { method: "POST", headers: headers() }).then(r => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/staging"] });
      qc.invalidateQueries({ queryKey: ["/api/admin/trends"] });
    },
  });

  if (isLoading) return <div className="text-center py-16 text-neutral-300 text-sm">Loading staged items...</div>;

  const allItems = [...(staging?.trend_updates || []), ...(staging?.competitor_updates || [])];
  const pending = allItems.filter(i => i.status === "pending");
  const accepted = allItems.filter(i => i.status === "accepted");

  if (allItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 rounded-2xl bg-green-400/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={24} className="text-green-400" />
        </div>
        <p className="text-green-950 font-bold text-lg mb-1">All clear</p>
        <p className="text-neutral-400 text-sm">No staged items waiting for review. Run the job or wait for the next Monday run.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {accepted.length > 0 && (
        <div className="bg-green-400/10 border border-green-400/30 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="font-bold text-green-950 text-sm">{accepted.length} item{accepted.length > 1 ? "s" : ""} accepted and ready to publish</p>
            <p className="text-neutral-500 text-xs mt-0.5">Publish will move accepted items to live data and update the report date to today.</p>
          </div>
          <button
            onClick={() => publish.mutate()}
            disabled={publish.isPending}
            className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-green-950 text-white hover:bg-green-950/80 disabled:opacity-40 transition-colors shrink-0"
          >
            {publish.isPending ? <><RefreshCw size={14} className="animate-spin" /> Publishing...</> : <><Send size={14} /> Publish Update</>}
          </button>
        </div>
      )}

      {pending.length === 0 && accepted.length > 0 && (
        <p className="text-neutral-400 text-sm text-center py-4">All items reviewed. Click Publish Update to go live.</p>
      )}

      {pending.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4">{pending.length} Pending Review</p>
          <div className="space-y-4">
            {pending.map(item => (
              <div key={item.id} className="bg-white border border-neutral-200 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${item.type === "trend_update" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
                        {item.type === "trend_update" ? "Trend Update" : "Competitor Update"}
                      </span>
                      {item.category && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-green-950/5 text-green-950/50">{item.category}</span>}
                      <span className="text-[10px] text-neutral-300">{new Date(item.fetched_at).toLocaleDateString()}</span>
                    </div>
                    {item.type === "trend_update" && item.proposed && (
                      <h3 className="font-bold text-green-950 text-sm leading-snug">{item.proposed.title}</h3>
                    )}
                    {item.type === "competitor_update" && (
                      <h3 className="font-bold text-green-950 text-sm leading-snug">{item.competitor_name} — {item.field}</h3>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => accept.mutate(item.id)}
                      disabled={accept.isPending}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-green-400 text-green-950 hover:bg-green-400/80 transition-colors"
                    >
                      <CheckCircle size={12} /> Accept
                    </button>
                    <button
                      onClick={() => discard.mutate(item.id)}
                      disabled={discard.isPending}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    >
                      <XCircle size={12} /> Discard
                    </button>
                  </div>
                </div>

                {item.type === "trend_update" && item.proposed && (
                  <div>
                    <p className="text-neutral-500 text-xs leading-relaxed mb-3">{item.proposed.summary}</p>
                    <ul className="space-y-1.5">
                      {(item.proposed.data_points || []).map((dp: any, i: number) => {
                        const ndp = normalizeDataPoint(dp);
                        return (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-400 text-xs mt-0.5 shrink-0">•</span>
                            <span className="text-xs text-neutral-600 flex-1">
                              {ndp.text}
                              {ndp.source_url && (
                                <a href={ndp.source_url} target="_blank" rel="noreferrer" className="ml-1.5 text-blue-500 hover:underline inline-flex items-center gap-0.5 text-[10px]">
                                  source <ExternalLink size={8} />
                                </a>
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    {item.source_feed && <p className="text-[10px] text-neutral-300 italic mt-2">Feed: {item.source_feed}</p>}
                  </div>
                )}

                {item.type === "competitor_update" && item.proposed_value && (
                  <div>
                    <p className="text-neutral-600 text-xs leading-relaxed mb-2">{item.proposed_value.text}</p>
                    {item.proposed_value.source_url && (
                      <a href={item.proposed_value.source_url} target="_blank" rel="noreferrer" className="text-blue-500 text-xs hover:underline flex items-center gap-1">
                        <ExternalLink size={11} /> {item.proposed_value.source_url}
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Job History Tab ───────────────────────────────────────────────────────────
function JobHistoryTab() {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState<string | null>(null);
  const { data: logs, isLoading } = useQuery<JobLog[]>({
    queryKey: ["/api/admin/job-logs"],
    queryFn: () => fetch("/api/admin/job-logs", { headers: headers() }).then(r => r.json()),
  });

  const runJob = useMutation({
    mutationFn: () => fetch("/api/admin/run-job", { method: "POST", headers: headers() }).then(r => r.json()),
    onSuccess: () => setTimeout(() => qc.invalidateQueries({ queryKey: ["/api/admin/job-logs"] }), 3000),
  });

  if (isLoading) return <div className="text-center py-16 text-neutral-300 text-sm">Loading logs...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-bold text-green-950">Intelligence Job Runs</p>
          <p className="text-neutral-400 text-xs mt-0.5">Scheduled every Monday at 8am. Logs kept for last 50 runs.</p>
        </div>
        <button
          onClick={() => runJob.mutate()}
          disabled={runJob.isPending}
          className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-green-950 text-white hover:bg-green-950/80 disabled:opacity-40 transition-colors"
        >
          {runJob.isPending ? <><RefreshCw size={12} className="animate-spin" /> Starting...</> : <><Play size={12} /> Run Job Now</>}
        </button>
      </div>

      {runJob.isSuccess && (
        <div className="bg-green-400/10 border border-green-400/30 rounded-xl px-4 py-3 mb-4 text-sm text-green-950 font-semibold">
          Job triggered. Check back in 1–2 minutes for new log entries.
        </div>
      )}

      {(!logs || logs.length === 0) ? (
        <div className="text-center py-16 text-neutral-300 text-sm">No job runs yet. Run the job to get started.</div>
      ) : (
        <div className="space-y-3">
          {logs.map(log => (
            <div key={log.run_id} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-4 px-5 py-4">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${log.status === "success" ? "bg-green-400" : log.status === "error" ? "bg-red-400" : "bg-orange-400"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs text-green-950/60">{log.run_id}</span>
                    <span className="text-xs text-neutral-400">{new Date(log.started_at).toLocaleString()}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${log.status === "success" ? "bg-green-400/10 text-green-950" : log.status === "error" ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-500"}`}>
                      {log.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-neutral-500">Trends: <strong>{log.trends_fetched}</strong></span>
                    <span className="text-xs text-neutral-500">Competitors: <strong>{log.competitors_processed}</strong></span>
                    <span className="text-xs text-neutral-500">Staged: <strong>{log.staging_written}</strong></span>
                    {log.errors.length > 0 && <span className="text-xs text-red-400 font-semibold">Errors: {log.errors.length}</span>}
                  </div>
                </div>
                {log.errors.length > 0 && (
                  <button onClick={() => setExpanded(expanded === log.run_id ? null : log.run_id)} className="flex items-center gap-1 text-xs text-neutral-400 hover:text-green-950/80 transition-colors shrink-0">
                    {expanded === log.run_id ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Errors
                  </button>
                )}
              </div>
              {expanded === log.run_id && log.errors.length > 0 && (
                <div className="border-t border-neutral-200 bg-red-50 px-5 py-3">
                  <ul className="space-y-1">
                    {log.errors.map((err, i) => <li key={i} className="text-xs text-red-600 font-mono leading-relaxed">{err}</li>)}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sources Config Tab ────────────────────────────────────────────────────────
function SourcesConfigTab() {
  const qc = useQueryClient();
  const { data: sources, isLoading } = useQuery<SourcesConfig>({
    queryKey: ["/api/admin/sources"],
    queryFn: () => fetch("/api/admin/sources", { headers: headers() }).then(r => r.json()),
  });

  const [draft, setDraft] = useState<SourcesConfig | null>(null);
  const [saved, setSaved] = useState(false);

  const save = useMutation({
    mutationFn: (data: SourcesConfig) => fetch("/api/admin/sources", { method: "PUT", headers: headers(), body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/sources"] }); setSaved(true); setTimeout(() => setSaved(false), 3000); setDraft(null); },
  });

  const current = draft || sources;

  if (isLoading || !current) return <div className="text-center py-16 text-neutral-300 text-sm">Loading sources config...</div>;

  function updateDomain(i: number, field: keyof SourcesConfig["trusted_domains"][0], val: string) {
    const d = JSON.parse(JSON.stringify(current!)) as SourcesConfig;
    d.trusted_domains[i] = { ...d.trusted_domains[i], [field]: val };
    setDraft(d);
  }
  function removeDomain(i: number) {
    const d = JSON.parse(JSON.stringify(current!)) as SourcesConfig;
    d.trusted_domains.splice(i, 1);
    setDraft(d);
  }
  function addDomain() {
    const d = JSON.parse(JSON.stringify(current!)) as SourcesConfig;
    d.trusted_domains.push({ domain: "", category: "industry_news", type: "rss" });
    setDraft(d);
  }
  function updateFeed(i: number, field: keyof SourcesConfig["rss_feeds"][0], val: string) {
    const d = JSON.parse(JSON.stringify(current!)) as SourcesConfig;
    d.rss_feeds[i] = { ...d.rss_feeds[i], [field]: val };
    setDraft(d);
  }
  function removeFeed(i: number) {
    const d = JSON.parse(JSON.stringify(current!)) as SourcesConfig;
    d.rss_feeds.splice(i, 1);
    setDraft(d);
  }
  function addFeed() {
    const d = JSON.parse(JSON.stringify(current!)) as SourcesConfig;
    d.rss_feeds.push({ url: "", label: "", domain: "" });
    setDraft(d);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-green-950">Source Configuration</p>
          <p className="text-neutral-400 text-xs mt-0.5">The intelligence job only fetches from trusted domains. Edit here to add or remove sources.</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && <span className="flex items-center gap-1 text-xs font-bold text-green-400"><Check size={11} /> Saved</span>}
          <button
            onClick={() => save.mutate(current)}
            disabled={!draft || save.isPending}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-green-950 text-white disabled:opacity-40 hover:bg-green-950/80 transition-colors"
          >
            {save.isPending ? <><RefreshCw size={11} className="animate-spin" /> Saving...</> : <><Save size={11} /> Save Changes</>}
          </button>
        </div>
      </div>

      {/* Notification */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5">
        <h3 className="font-bold text-green-950 text-sm mb-4">Notifications</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">Slack Webhook URL</label>
            <input
              value={current.notification_webhook}
              onChange={e => setDraft({ ...current, notification_webhook: e.target.value })}
              placeholder="https://hooks.slack.com/..."
              className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">Email (future)</label>
            <input
              value={current.notification_email}
              onChange={e => setDraft({ ...current, notification_email: e.target.value })}
              placeholder="team@betterfly.com"
              className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>
      </div>

      {/* RSS Feeds */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-green-950 text-sm">RSS Feeds ({current.rss_feeds.length})</h3>
          <button onClick={addFeed} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-green-950 text-white hover:bg-green-950/80 transition-colors">
            <Plus size={11} /> Add Feed
          </button>
        </div>
        <div className="space-y-2">
          {current.rss_feeds.map((feed, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
              <input value={feed.label} onChange={e => updateFeed(i, "label", e.target.value)} placeholder="Label" className="border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400" />
              <input value={feed.url} onChange={e => updateFeed(i, "url", e.target.value)} placeholder="RSS URL" className="border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400" />
              <input value={feed.domain} onChange={e => updateFeed(i, "domain", e.target.value)} placeholder="Domain (for whitelist check)" className="border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400" />
              <button onClick={() => removeFeed(i)} className="w-6 h-6 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100">
                <X size={11} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trusted Domains */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-green-950 text-sm">Trusted Domains ({current.trusted_domains.length})</h3>
          <button onClick={addDomain} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-green-950 text-white hover:bg-green-950/80 transition-colors">
            <Plus size={11} /> Add Domain
          </button>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-[2fr_2fr_1.5fr_auto] gap-2 mb-1">
            {["Domain", "Category", "Type", ""].map(h => (
              <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-neutral-300 px-1">{h}</span>
            ))}
          </div>
          {current.trusted_domains.map((td, i) => (
            <div key={i} className="grid grid-cols-[2fr_2fr_1.5fr_auto] gap-2 items-center">
              <input value={td.domain} onChange={e => updateDomain(i, "domain", e.target.value)} placeholder="limra.com" className="border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400" />
              <input value={td.category} onChange={e => updateDomain(i, "category", e.target.value)} placeholder="benefits_research" className="border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400" />
              <select value={td.type} onChange={e => updateDomain(i, "type", e.target.value)} className="border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400 bg-white">
                <option value="rss">rss</option>
                <option value="crawl">crawl</option>
                <option value="rss_and_crawl">rss_and_crawl</option>
              </select>
              <button onClick={() => removeDomain(i)} className="w-6 h-6 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100">
                <X size={11} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function AdminTrends() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("live");
  const [rawText, setRawText] = useState("");
  const [extractedThemes, setExtractedThemes] = useState<Theme[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTheme, setNewTheme] = useState<Partial<Theme>>({ title: "", summary: "", data_points: [], source: "", relevance: [] });
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const { data, isLoading } = useQuery<TrendsData>({
    queryKey: ["/api/admin/trends"],
    queryFn: () => fetch("/api/admin/trends", { headers: headers() }).then(r => r.json()),
  });
  const { data: staging } = useQuery<StagingData>({
    queryKey: ["/api/admin/staging"],
    queryFn: () => fetch("/api/admin/staging", { headers: headers() }).then(r => r.json()),
  });

  const deleteTheme = useMutation({
    mutationFn: (id: string) => fetch(`/api/admin/trends/theme/${id}`, { method: "DELETE", headers: headers() }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/trends"] }),
  });
  const updateTheme = useMutation({
    mutationFn: (theme: Theme) => fetch(`/api/admin/trends/theme/${theme.id}`, { method: "PATCH", headers: headers(), body: JSON.stringify(theme) }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/trends"] }),
  });
  const addTheme = useMutation({
    mutationFn: (theme: Partial<Theme>) => fetch("/api/admin/trends/theme", { method: "POST", headers: headers(), body: JSON.stringify(theme) }).then(r => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/admin/trends"] }); setShowAddForm(false); setNewTheme({ title: "", summary: "", data_points: [], source: "", relevance: [] }); },
  });

  async function handleExtract() {
    setIsExtracting(true);
    try {
      const res = await fetch("/api/admin/trends/extract", { method: "POST", headers: headers(), body: JSON.stringify({ rawText }) });
      const d = await res.json();
      setExtractedThemes(d.themes || []);
    } finally { setIsExtracting(false); }
  }
  async function addExtracted(theme: Theme) {
    await addTheme.mutateAsync({ ...theme, id: undefined as any });
    setExtractedThemes(t => t.filter(x => x !== theme));
  }

  const daysSinceUpdate = data?.report_date
    ? Math.floor((new Date().getTime() - new Date(data.report_date).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const dataStale = daysSinceUpdate !== null && daysSinceUpdate > 14;

  const pendingCount = [
    ...(staging?.trend_updates || []).filter(i => i.status === "pending"),
    ...(staging?.competitor_updates || []).filter(i => i.status === "pending"),
  ].length;

  if (isLoading) return <div className="min-h-screen bg-neutral-100 flex items-center justify-center"><p className="text-neutral-300">Loading...</p></div>;

  const TABS = [
    { id: "live" as Tab, label: "Live Trends", icon: BarChart2 },
    { id: "pending" as Tab, label: "Pending Review", icon: Eye, badge: pendingCount },
    { id: "history" as Tab, label: "Job History", icon: Clock },
    { id: "sources" as Tab, label: "Sources Config", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <div className="bg-green-950 px-16 pt-10 pb-10 relative overflow-hidden">
        <div className="absolute top-[-60px] right-[-40px] w-80 h-80 bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <p className="text-yellow-400 text-[10px] font-bold uppercase tracking-widest mb-3">Admin Only</p>
          <h1 className="text-white text-4xl font-black leading-tight mb-2" style={{ fontFamily: "'Obviously Narrow', sans-serif" }}>
            Intelligence Pipeline
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-white/40 text-sm">Trends last updated: {data?.report_date || "—"}</p>
            {dataStale && (
              <div className="flex items-center gap-1.5 text-orange-400 text-xs font-semibold">
                <AlertTriangle size={12} /> {daysSinceUpdate} days since last update — refresh recommended
              </div>
            )}
          </div>
        </div>
      </div>

      {dataStale && (
        <div className="bg-orange-50 border-b border-orange-200 px-16 py-2.5 flex items-center gap-2">
          <AlertTriangle size={13} className="text-orange-500 shrink-0" />
          <p className="text-orange-700 text-xs font-semibold">
            Industry data is {daysSinceUpdate} days old. Run the intelligence job or manually update to keep assets accurate.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-neutral-200 px-16">
        <div className="flex gap-0">
          {TABS.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-bold border-b-2 transition-all ${tab === id ? "border-green-400 text-green-950" : "border-transparent text-neutral-400 hover:text-green-950/80"}`}
            >
              <Icon size={14} />
              {label}
              {badge != null && badge > 0 && (
                <span className="bg-green-400 text-green-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">{badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-16 py-10 max-w-4xl">
        {/* Live Trends Tab */}
        {tab === "live" && (
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-green-950 font-black text-lg">Current Trends ({data?.themes.length || 0})</h2>
                <div className="flex items-center gap-2">
                  {saveMsg && <span className="flex items-center gap-1.5 text-xs font-bold text-green-400"><Check size={12} /> {saveMsg}</span>}
                  <button onClick={() => setShowAddForm(f => !f)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-green-950 text-white hover:bg-green-950/80 transition-colors">
                    <Plus size={12} /> Add Trend
                  </button>
                </div>
              </div>

              {showAddForm && (
                <div className="bg-white border-2 border-[#e8fb10] rounded-2xl p-5 mb-5">
                  <h3 className="font-bold text-green-950 text-sm mb-4">New Trend Entry</h3>
                  <div className="space-y-3 mb-4">
                    <input placeholder="Title" value={newTheme.title} onChange={e => setNewTheme(d => ({ ...d, title: e.target.value }))} className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                    <textarea placeholder="Summary (2-4 sentences)" value={newTheme.summary} onChange={e => setNewTheme(d => ({ ...d, summary: e.target.value }))} className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400" rows={3} />
                    <input placeholder="Source" value={newTheme.source} onChange={e => setNewTheme(d => ({ ...d, source: e.target.value }))} className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                    <div className="flex flex-wrap gap-2">
                      {["Carriers", "Brokers", "Employers", "Employees", "General"].map(r => (
                        <button key={r} onClick={() => setNewTheme(d => ({ ...d, relevance: (d.relevance || []).includes(r) ? (d.relevance || []).filter(x => x !== r) : [...(d.relevance || []), r] }))}
                          className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${(newTheme.relevance || []).includes(r) ? "bg-green-950 text-white" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-300"}`}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => addTheme.mutate({ ...newTheme, data_points: [] })} disabled={!newTheme.title} className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-green-400 text-green-950 disabled:opacity-40">
                      <Save size={12} /> Add Trend
                    </button>
                    <button onClick={() => setShowAddForm(false)} className="text-xs text-neutral-400 px-3 py-2">Cancel</button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {(data?.themes || []).map(theme => (
                  <EditableTheme key={theme.id} theme={theme} onSave={updated => updateTheme.mutate(updated)} onDelete={() => deleteTheme.mutate(theme.id)} />
                ))}
                {data?.themes.length === 0 && <p className="text-neutral-300 text-sm py-8 text-center">No trends yet. Add one above or extract from raw text below.</p>}
              </div>
            </div>

            {/* Extract from raw text */}
            <div className="border-t border-neutral-200 pt-10">
              <h2 className="text-green-950 font-black text-lg mb-2">Extract Trends from Raw Text</h2>
              <p className="text-neutral-400 text-sm mb-5">Paste in text from SHRM, LIMRA, LinkedIn Talent Trends, or any report. Claude will extract and structure relevant themes.</p>
              <textarea value={rawText} onChange={e => setRawText(e.target.value)} placeholder="Paste raw text from any industry report, article, or research document here..." className="w-full border-2 border-neutral-200 rounded-2xl px-5 py-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white text-green-950 placeholder:text-neutral-400 leading-relaxed mb-4" rows={8} />
              <button disabled={!rawText.trim() || isExtracting} onClick={handleExtract} className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-green-950 text-white disabled:opacity-40 hover:bg-green-950/80 transition-colors mb-6">
                {isExtracting ? <><RefreshCw size={14} className="animate-spin" /> Extracting...</> : <><Sparkles size={14} /> Extract with Claude</>}
              </button>
              {extractedThemes.length > 0 && (
                <div>
                  <p className="text-green-950 font-bold text-sm mb-4">{extractedThemes.length} themes extracted — review and add to report:</p>
                  <div className="space-y-4">
                    {extractedThemes.map((theme, i) => (
                      <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-5">
                        <h3 className="font-bold text-green-950 text-sm mb-2">{theme.title}</h3>
                        <p className="text-neutral-500 text-xs leading-relaxed mb-2">{theme.summary}</p>
                        <ul className="space-y-1 mb-3">
                          {(theme.data_points || []).map((dp: any, j: number) => {
                            const ndp = normalizeDataPoint(dp);
                            return (
                              <li key={j} className="flex items-start gap-2">
                                <span className={`text-xs mt-0.5 shrink-0 ${ndp.verified ? "text-green-400" : "text-orange-400"}`}>{ndp.verified ? "•" : "⚠️"}</span>
                                <span className="text-xs text-neutral-600">{ndp.text}</span>
                              </li>
                            );
                          })}
                        </ul>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-neutral-300 italic">{theme.source}</span>
                          <button onClick={() => addExtracted(theme)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-green-400 text-green-950 hover:bg-green-400/80 transition-colors">
                            <Plus size={11} /> Add to Report
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "pending" && <PendingReviewTab />}
        {tab === "history" && <JobHistoryTab />}
        {tab === "sources" && <SourcesConfigTab />}
      </div>
    </div>
  );
}
