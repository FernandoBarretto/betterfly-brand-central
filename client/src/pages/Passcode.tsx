import { useState } from "react";

export function Passcode({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/verify-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: value }),
      });
      const data = await res.json();
      if (data.valid) {
        onUnlock();
      } else {
        setError(true);
        setValue("");
        setTimeout(() => setError(false), 2000);
      }
    } catch {
      setError(true);
      setValue("");
      setTimeout(() => setError(false), 2000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-green-950 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <span className="absolute top-16 left-20 text-5xl opacity-20 rotate-[-20deg] select-none">🦋</span>
      <span className="absolute top-32 right-28 text-3xl opacity-15 rotate-[15deg] select-none">🦋</span>
      <span className="absolute bottom-24 left-32 text-4xl opacity-15 rotate-[10deg] select-none">🦋</span>
      <span className="absolute bottom-16 right-20 text-2xl opacity-20 rotate-[-10deg] select-none">🦋</span>
      <span className="absolute top-1/2 left-10 text-2xl opacity-10 rotate-[25deg] select-none">🦋</span>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-green-400/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm text-center relative z-10">
        <div className="mb-10 flex flex-col items-center gap-4">
          <img
            src="/betterfly-icon.png"
            alt="Betterfly"
            className="w-20 h-20 rounded-full object-cover"
          />
          <img
            src="/betterfly-wordmark.png"
            alt="Betterfly"
            className="h-10 w-auto object-contain"
          />
        </div>

        <p className="text-green-400 font-sans text-sm font-semibold mb-1">
          Brand Central
        </p>
        <p className="text-white/40 text-sm mb-10">
          Internal brand resource — access restricted
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter passcode"
              autoFocus
              className={`w-full bg-white/10 border text-white placeholder-white/30 rounded-xl px-5 py-4 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-normal ${
                error
                  ? "border-red-400 ring-2 ring-red-400"
                  : "border-white/20"
              }`}
            />
            {error && (
              <p className="text-red-400 text-xs mt-2 text-left">
                Incorrect passcode. Try again.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-400 text-green-950 font-sans font-semibold py-4 rounded-full text-sm hover:bg-green-300 active:bg-green-500 transition-all duration-normal ease-out disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Access Brand Central"}
          </button>
        </form>

        <p className="text-white/20 text-xs mt-8">
          Need access? Contact your brand team.
        </p>
      </div>
    </div>
  );
}
