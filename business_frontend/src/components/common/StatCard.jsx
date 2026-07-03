import Icon from "./Icon";

const StatCard = ({ icon, value, label, description }) => {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-2xl font-bold text-[#1F2937]">{value}</p>
          <p className="mt-1 text-sm font-medium text-[#6B7280]">{label}</p>
        </div>

        {icon && (
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-[#22C55E]">
            <Icon name={icon} size={22} />
          </span>
        )}
      </div>

      {description && (
        <p className="mt-4 text-sm leading-6 text-[#6B7280]">{description}</p>
      )}
    </div>
  );
};

export default StatCard;