import Icon from "./Icon";

const SearchBar = ({ searchTerm, setSearchTerm, onSearch }) => {
  const submit = (event) => { event.preventDefault(); onSearch?.(); };
  return (
    <form onSubmit={submit} className="w-full rounded-2xl border border-[#E5E7EB] bg-white p-3 shadow-sm">
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <div className="relative w-full flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">
            <Icon name="manage_search" size={21} />
          </span>

          <input
            type="text"
            placeholder="Search services or businesses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-full min-w-0 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] pl-12 pr-4 text-sm text-[#1F2937] placeholder:text-[#6B7280] outline-none transition focus:border-[#22C55E] focus:ring-2 focus:ring-green-100"
          />
        </div>

        <button type="submit" className="flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#22C55E] px-5 text-sm font-semibold text-white transition hover:bg-green-600 sm:w-auto">
          <Icon name="arrow_forward" size={17} />
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
