import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const formatSlug = (slug) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const AreaListing = () => {
  const { areaName } = useParams();
  const navigate = useNavigate();
  const formattedAreaName = formatSlug(areaName);

  useEffect(() => {
    // Redirect to unified search page
    navigate(`/search?city=${encodeURIComponent(formattedAreaName)}`, { replace: true });
  }, [formattedAreaName, navigate]);

  return null;
};

export default AreaListing;