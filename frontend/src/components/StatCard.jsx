function StatCard({ label, value, hint = '', tone = 'default' }) {
  const toneStyles = {
    default: 'border-slate-200 bg-white text-slate-900',
    accent: 'border-indigo-200 bg-indigo-50 text-indigo-700',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
  };

  return (
    <div className={`rounded-3xl border p-5 shadow-[0_10px_35px_rgba(15,23,42,0.06)] ${toneStyles[tone] || toneStyles.default}`}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

export default StatCard;
