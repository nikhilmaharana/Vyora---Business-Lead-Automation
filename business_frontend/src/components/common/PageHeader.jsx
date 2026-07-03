const PageHeader = ({
  badge = "Vyora",
  title,
  description,
  children,
}) => {
  return (
    <div className="mb-8 overflow-hidden rounded-3xl bg-[#111827] p-8 text-white shadow-sm">
      <span className="rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-[#22C55E]">
        {badge}
      </span>

      <h1 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">
        {title}
      </h1>

      {description && (
        <p className="mt-3 max-w-2xl text-gray-300">{description}</p>
      )}

      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};

export default PageHeader;