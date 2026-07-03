import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const formatSlug = (slug) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const SubCategory = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const formattedCategoryName = formatSlug(categoryName);

  useEffect(() => {
    // Redirect to unified search page with category filter
    navigate(`/search?category=${encodeURIComponent(formattedCategoryName)}`, { replace: true });
  }, [formattedCategoryName, navigate]);

  return null;
};

export default SubCategory;