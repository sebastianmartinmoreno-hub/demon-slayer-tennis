import React from "react";
import { Brain, Flame, Flower2, Lightning, ListTodo, Medal, Play, Pause, RefreshCcw, Settings, Shield, Swords, Waves, Wind } from "lucide-react";

/** DEMON SLAYER x TENNIS — BREATHING TRAINER (full) */

const ls = {
  get: (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def } catch { return def } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  del: (k) => localStorage.removeItem(k),
};
const cx = (...c) => c.filter(Boolean).join(" ");

const FORMS = {
  total: { key:"total", name:"Total Concentration", gradient:"from-amber-300 via-amber-500 to-yellow-600", icon:Brain, xp:5,
    description:"Foundation. Box breathing to stabilize mind & body.",
    pattern:[{phase:"Inhale",sec:4},{phase:"Hold",sec:4},{phase:"Exhale",sec:4},{phase:"Hold",sec:4}], cycles:10 },
  water: { key:"water", name:"Water Breathing", gradient:"from-sky-300 via-sky-500 to-blue-600", icon:Waves, xp:10,
    description:"Flow & focus. Smooth inhale → longer exhale.", pattern:[{phase:"Inhale",sec:4},{phase:"Exhale",sec:6}], cycles:8 },
  thunder:{ key:"thunder", name:"Thunder Breathing", gradient:"from-yellow-300 via-amber-400 to-orange-500", icon:Lightning, xp:15,
    description:"Explosive power. Sharp exhales on effort.", pattern:[{phase:"Inhale",sec:2},{phase:"Exhale",sec:2}], cycles:15 },
  wind:  { key:"wind", name:"Wind Breathing", gradient:"from-emerald-300 via-green-500 to-lime-600", icon:Wind, xp:10,
    description:"Endurance. Longer exhale to recover.", pattern:[{phase:"Inhale",sec:4},{phase:"Exhale",sec:8}], cycles:10 },
  flower:{ key:"flower", name:"Flower Breathing", gradient:"from-pink-300 via-rose-500 to-fuchsia-600", icon:Flower2, xp:20,
    description:"Calm precision. 4-7-8 nerve-calming breath.", pattern:[{phase:"Inhale",sec:4},{phase:"Hold",sec:7},{phase:"Exhale",sec:8}], cycles:4 },
  flame: { key:"flame", name:"Flame Breathing", gradient:"from-orange-300 via-red-500 to-red-700", icon:Flame, xp:25,
    description:"Energy & confidence. Short bursts (Breath of Fire).", pattern:[...Array.from({length:20},()=>({phase:\"Burst\",sec:1}))], cycles:1 },
};

const RANKS = [
  { name: "Novice", min: 0 },
  { name: "Slayer", min: 100 },
  { name: "Pillar", min: 300 },
  { name: "Hashira", min: 700 },
];
const ACHIEVEMENTS = [
  { id: "calm_blade", label: "Calm Blade", test: (s) => s.total >= 5 },
  { id: "flow_master", label: "Flow Master", test: (s) => s.water >= 5 },
  { id: "lightning_step", label: "Lightning Step", test: (s) => s.thunder >= 5 },
  { id: "wind_rider", label: "Wind Rider", test: (s) => s.wind >= 5 },
  { id: "petal_calm", label: "Petal Calm", test: (s) => s.flower >= 3 },
  { id: "flame_heart", label: "Flame Heart", test: (s) => s.flame >= 3 },
];

function useLocalStorage(key, initial) {
  const [value, setValue] = React.useState(() => ls.get(key, initial));
  React.useEffect(() => { ls.set(key, value) }, [key, value]);
  return [value, setValue];
}
function useBreathTimer(form) {
  const [running, setRunning] = React.useState(false);
  const [stepIndex, setStepIndex] = React.useState(0);
  const [secLeft, setSecLeft] = React.useState(form.pattern[0].sec);
  const [cycle, setCycle] = React.useState(1);
  const totalSteps = form.pattern.length;
  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSecLeft((s) => {
        if (s > 1) return s - 1;
        setStepIndex((i) => {
          const next = i + 1;
          if (next < totalSteps) { setSecLeft(form.pattern[next].sec); return next; }
          if (cycle < form.cycles) { setCycle((c)=>c+1); setSecLeft(form.pattern[0].sec); return 0; }
          setRunning(false); return i;
        });
        return 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, stepIndex, totalSteps, form, cycle]);
  const phase = form.pattern[stepIndex].phase;
  return {
    running, phase, secLeft, stepIndex, cycle, totalSteps,
    start:()=>setRunning(true), pause:()=>setRunning(false),
    reset:()=>{ setRunning(false); setStepIndex(0); setSecLeft(form.pattern[0].sec); setCycle(1); }
  };
}

function Header({ page, setPage }) {
  const tabs = [
    { id: "train", label: "Train", icon: Swords },
    { id: "log", label: "Logbook", icon: ListTodo },
    { id: "toolkit", label: "Toolkit", icon: Shield },
    { id: "settings", label: "Settings", icon: Settings },
  ];
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-black/30 border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        <span className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-red-400 to-amber-300 bg-clip-text text-transparent">Demon Slayer Tennis</span>
        <nav className="ml-auto flex gap-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setPage(t.id)}
              className={cx("px-3 py-1.5 rounded-xl text-sm flex items-center gap-2", page===t.id ? "bg-white/10" : "hover:bg-white/5")}>
              <t.icon className="w-4 h-4"/>{t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
function FormCard({ active, onSelect, form }) {
  const Icon = form.icon;
  return (
    <button onClick={onSelect}
      className={cx("group relative w-full text-left rounded-2xl p-4 border border-white/10",
                    "bg-gradient-to-br text-white shadow-lg hover:shadow-xl transition-all",
                    "from-black/30 to-black/10 hover:to-black/20",
                    active && "ring-2 ring-white")}>
      <div className="flex items-center gap-3">
        <div className={cx("p-2 rounded-xl bg-gradient-to-br", form.gradient)}>
          <Icon className="w-6 h-6 drop-shadow" />
        </div>
        <div>
          <div className="font-semibold">{form.name}</div>
          <div className="text-xs text-white/70">{form.description}</div>
        </div>
        <span className="ml-auto text-xs opacity-70">{form.cycles} cycles</span>
      </div>
    </button>
  );
}
function XPBar({ xp }) {
  const rankIndex = [...RANKS].reverse().findIndex(r => xp >= r.min);
  const currentRank = RANKS[rankIndex >= 0 ? RANKS.length - 1 - rankIndex : 0];
  const nextRank = RANKS.find(r => r.min > xp);
  const progress = nextRank ? Math.min(100, Math.round(((xp - currentRank.min) / (nextRank.min - currentRank.min)) * 100)) : 100;
  return (
    <div className="rounded-2xl p-4 border border-white/10 bg-white/5">
      <div className="flex items-center gap-2 text-sm">
        <Medal className="w-4 h-4"/> <span className="font-medium">Rank:</span>
        <span className="font-semibold">{currentRank.name}</span>
        <span className="ml-auto text-xs opacity-70">XP: {xp}{nextRank ? ` → ${nextRank.name} in ${nextRank.min - xp}` : " (Max)"}</span>
      </div>
      <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-fuchsia-400 via-amber-300 to-emerald-400" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
function Achievements({ stats }) {
  const unlocked = ACHIEVEMENTS.filter(a => a.test(stats));
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {ACHIEVEMENTS.map(a => (
        <div key={a.id} className={cx("rounded-xl p-3 border", unlocked.find(u => u.id === a.id) ? "border-emerald-400/40 bg-emerald-400/10" : "border-white/10 bg-white/5")}> 
          <div className="text-sm font-semibold">{a.label}</div>
          <div className="text-xs opacity-70">{unlocked.find(u => u.id === a.id) ? "Unlocked" : "Locked"}</div>
        </div>
      ))}
    </div>
  );
}

function useBreathTimerHook(form){ return useBreathTimer(form); } // alias to avoid re-order lint

function TrainPage({ formKey, setFormKey, onComplete, addSession, xp, stats }) {
  const form = FORMS[formKey];
  const timer = useBreathTimerHook(form);
  React.useEffect(() => {
    if (!timer.running && timer.cycle === form.cycles && timer.stepIndex === form.pattern.length - 1 && timer.secLeft === 1) {
      const gained = form.xp;
      addSession({ form: form.key, ts: Date.now(), xp: gained, cycles: form.cycles });
      onComplete(gained);
    }
  }, [timer.running]);
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-1 space-y-2">
        {Object.values(FORMS).map(f => (<FormCard key={f.key} form={f} active={f.key===formKey} onSelect={() => setFormKey(f.key)} />))}
        <XPBar xp={xp} />
        <div className="rounded-2xl p-4 border border-white/10 bg-white/5">
          <div className="text-sm font-semibold mb-1">Achievements</div>
          <Achievements stats={stats} />
        </div>
      </div>
      <div className="md:col-span-2">
        <div className={cx("rounded-3xl p-6 border shadow-xl bg-gradient-to-br text-white", FORMS[formKey].gradient)}>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-extrabold drop-shadow">{form.name}</div>
            <span className="text-xs bg-black/30 px-2 py-0.5 rounded-full border border-white/20">{form.description}</span>
          </div>
          <div className="mt-6 grid sm:grid-cols-2 gap-4 items-center">
            <div className="text-center rounded-2xl bg-black/20 p-6 border border-white/20">
              <div className="text-sm opacity-90">Cycle {timer.cycle} / {form.cycles}</div>
              <div className="text-3xl font-semibold mt-2">{timer.phase}</div>
              <div className="mt-4 text-6xl font-black tabular-nums tracking-widest">{timer.secLeft}s</div>
              <div className="mt-4 flex items-center justify-center gap-2">
                {!timer.running ? (
                  <button onClick={timer.start} className="px-4 py-2 rounded-xl bg-black/50 hover:bg-black/60 border border-white/20 flex items-center gap-2"><Play className="w-4 h-4"/> Start</button>
                ) : (
                  <button onClick={timer.pause} className="px-4 py-2 rounded-xl bg-black/50 hover:bg-black/60 border border-white/20 flex items-center gap-2"><Pause className="w-4 h-4"/> Pause</button>
                )}
                <button onClick={timer.reset} className="px-4 py-2 rounded-xl bg-black/50 hover:bg-black/60 border border-white/20 flex items-center gap-2"><RefreshCcw className="w-4 h-4"/> Reset</button>
              </div>
            </div>
            <div className="rounded-2xl bg-black/20 p-6 border border-white/20">
              <div className="text-sm font-semibold mb-2">How to use on court</div>
              <ul className="text-sm space-y-2 opacity-95 list-disc list-inside">
                {form.key === "total" && (<>
                  <li>Box Breathing: 4–4–4–4. Repeat 10 cycles daily.</li>
                  <li>Pre-point reset: 1 slow inhale, 1 slow exhale before serve/return.</li>
                  <li>Gourd drill: inflate a balloon in one breath (3×5 reps).</li>
                </>)}
                {form.key === "water" && (<>
                  <li>Rally: inhale on backswing, exhale on contact (30–50 shots).</li>
                  <li>Between points: inhale 4s → hold 2s → exhale 6s.</li>
                  <li>Goal: stay loose; no breath-holding.</li>
                </>)}
                {form.key === "thunder" && (<>
                  <li>Power serve: deep inhale, sharp exhale on contact (×20).</li>
                  <li>Sprints: 10m bursts; short sharp exhale on push-off.</li>
                  <li>Shadow swings: exhale at impact (×20 FH/BH).</li>
                </>)}
                {form.key === "wind" && (<>
                  <li>Nasal jogging 10 min (only nose breathing).</li>
                  <li>Long exhale: inhale 4s → exhale 8s (×10).</li>
                  <li>Long rallies; recover in 3–4 deep breaths.</li>
                </>)}
                {form.key === "flower" && (<>
                  <li>4–7–8 before pressure points (×5 cycles pre-match).</li>
                  <li>Calm routine before serve/return at deuce/ad.</li>
                  <li>Soft focus: visualize seams on the ball.</li>
                </>)}
                {form.key === "flame" && (<>
                  <li>Breath of Fire: 20s quick bursts ×3 sets.</li>
                  <li>Lion’s breath to dump tension (10 reps).</li>
                  <li>Use on changeovers to re-ignite energy.</li>
                </>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogbookPage({ sessions, clearSessions }) {
  const byDate = [...sessions].reverse();
  const fmt = (ts) => new Date(ts).toLocaleString();
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ListTodo className="w-5 h-5"/>
        <div className="text-lg font-semibold">RPG Logbook</div>
        <button onClick={clearSessions} className="ml-auto text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5">Clear</button>
      </div>
      {byDate.length === 0 ? (
        <div className="text-sm opacity-70">No sessions yet. Train to log XP.</div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Form</th>
                <th className="text-left p-2">Cycles</th>
                <th className="text-left p-2">XP</th>
              </tr>
            </thead>
            <tbody>
              {byDate.map((s, i) => (
                <tr key={i} className="odd:bg-white/0 even:bg-white/5">
                  <td className="p-2">{fmt(s.ts)}</td>
                  <td className="p-2">{FORMS[s.form].name}</td>
                  <td className="p-2">{s.cycles}</td>
                  <td className="p-2">{s.xp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ToolkitPage() {
  const items = [
    { icon: Brain, title: "Total Concentration", lines: ["3 slow breaths before first serve.", "1 slow breath after errors."]},
    { icon: Waves, title: "Water", lines: ["Inhale backswing, exhale contact.", "Between points: 4–2–6 reset."]},
    { icon: Lightning, title: "Thunder", lines: ["Sharp exhale on every power strike.", "Sprints: exhale on push-off."]},
    { icon: Wind, title: "Wind", lines: ["Inhale 4s, exhale 8s to recover.", "Aim 3–4 deep breaths to reset."]},
    { icon: Flower2, title: "Flower", lines: ["4–7–8 before big points.", "Soft focus on ball seams."]},
    { icon: Flame, title: "Flame", lines: ["Breath of Fire 20s ×3 sets.", "Lion’s breath to dump tension."]},
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(({ icon:Icon, title, lines }) => (
        <div key={title} className="rounded-2xl p-4 border border-white/10 bg-white/5">
          <div className="flex items-center gap-2 mb-2"><Icon className="w-4 h-4"/><div className="font-semibold">{title}</div></div>
          <ul className="text-sm space-y-1 list-disc list-inside opacity-95">
            {lines.map((l,i) => <li key={i}>{l}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

function SettingsPage({ resetAll }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 border border-white/10 bg-white/5">
        <div className="font-semibold mb-2">Data</div>
        <button onClick={resetAll} className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5">Reset all local data</button>
      </div>
      <div className="rounded-2xl p-4 border border-white/10 bg-white/5 text-sm opacity-80">
        <div className="font-semibold mb-2">Tips</div>
        <ul className="list-disc list-inside space-y-1">
          <li>Add to Home Screen for quick access on court.</li>
          <li>Use Water (flow) for rallies; Flower (4–7–8) for pressure points.</li>
          <li>Earn XP by completing timer cycles; unlock achievements automatically.</li>
        </ul>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = React.useState("train");
  const [formKey, setFormKey] = React.useState("total");
  const [sessions, setSessions] = useLocalStorage("ds_tennis_sessions", []);
  const [xp, setXp] = useLocalStorage("ds_tennis_xp", 0);

  const stats = React.useMemo(() => {
    const s = { total:0, water:0, thunder:0, wind:0, flower:0, flame:0 };
    sessions.forEach(x => { s[x.form] = (s[x.form] || 0) + 1; });
    return s;
  }, [sessions]);

  function addSession(s) { setSessions(prev => [...prev, s]); setXp(prev => prev + s.xp); }
  function clearSessions() { setSessions([]); }
  function resetAll() { ls.del("ds_tennis_sessions"); ls.del("ds_tennis_xp"); window.location.reload(); }
  function onComplete(gained) { alert(`Session complete! +${gained} XP earned.`); }

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <Header page={page} setPage={setPage} />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {page === "train" && (
          <TrainPage formKey={formKey} setFormKey={setFormKey} onComplete={onComplete} addSession={addSession} xp={xp} stats={stats} />
        )}
        {page === "log" && (<>
          <XPBar xp={xp} />
          <LogbookPage sessions={sessions} clearSessions={clearSessions} />
        </>)}
        {page === "toolkit" && <ToolkitPage />}
        {page === "settings" && <SettingsPage resetAll={resetAll} />}
      </main>

      <footer className="text-center text-xs opacity-60 py-6">Keep your heart burning. Breathe. Train. Win.</footer>
    </div>
  );
}
