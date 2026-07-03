const Icon = ({ name, size = 20, className = "" }) => {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontSize: size }}
    >
      {name}
    </span>
  );
};

export default Icon;