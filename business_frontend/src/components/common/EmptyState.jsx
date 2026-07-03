import Icon from "./Icon";

const EmptyState = ({
  icon = "info",
  title = "No data found",
  description = "Try changing your filters or search query.",
  action,
}) => {
  return (
    <div className="rounded-3xl border border-dashed border-[#E5E7EB] bg-white p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-[#22C55E]">
        <Icon name={icon} size={30} />
      </div>

      <h3 className="mt-5 text-xl font-bold text-[#1F2937]">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6B7280]">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;