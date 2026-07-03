import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const formatSlug = (slug) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const CityListing = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const formattedCityName = formatSlug(cityName);

  useEffect(() => {
    // Redirect to unified search page with city filter
    navigate(`/search?city=${encodeURIComponent(formattedCityName)}`, { replace: true });
  }, [formattedCityName, navigate]);

  return null;
};

export default CityListing;