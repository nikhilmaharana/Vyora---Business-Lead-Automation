const SectionCard = ({ children, className = "" }) => {
  return (
    <section
      className={`rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </section>
  );
};

export default SectionCard;