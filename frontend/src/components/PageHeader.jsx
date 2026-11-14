function PageHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-[0_12px_50px_rgba(148,163,184,0.12)] backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export default PageHeader;
