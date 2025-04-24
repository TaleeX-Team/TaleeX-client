import { useEffect, useState } from "react";
import { getCompanies } from "@/services/apiCompanies";
import Companies from "../companies/Companies";

const Home = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Then fetch companies
        const companiesData = await getCompanies();
        setCompanies(companiesData.companies);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try logging in again.");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  //   if (loading) return <div>Loading companies...</div>;
  //   if (error) return <div className="error-message">{error}</div>;

  return <Companies />;
};

export default Home;
