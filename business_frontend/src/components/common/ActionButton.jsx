import { Link } from "react-router-dom";
import Icon from "./Icon";

const ActionButton = ({
  to,
  icon,
  children,
  variant = "primary",
  type = "button",
  onClick,
  className = "",
}) => {
  const baseClass =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition";

  const variants = {
    primary: "bg-[#22C55E] text-white hover:bg-green-600",
    outline:
      "border border-[#22C55E] bg-white text-[#22C55E] hover:bg-green-50",
    dark: "bg-[#111827] text-white hover:bg-gray-900",
    ghost: "text-[#22C55E] hover:bg-green-50",
  };

  const finalClass = `${baseClass} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={finalClass}>
        {icon && <Icon name={icon} size={18} />}
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={finalClass}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
};

export default ActionButton;