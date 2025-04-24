import { useEffect, useState } from "react";
import { getCompanies } from "@/services/apiAuth.js";

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

  if (loading) return <div>Loading companies...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <h1>Companies</h1>
      {companies.length === 0 ? (
        <p>No companies found</p>
      ) : (
        <ul>
          {companies.map((company) => (
            <li key={company._id}>{company.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
