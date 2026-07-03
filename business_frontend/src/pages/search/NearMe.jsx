import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NearMe = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to unified search page with location intent
    navigate("/search", { replace: true });
  }, [navigate]);

  return null;
};

export default NearMe;