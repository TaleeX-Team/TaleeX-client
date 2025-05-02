import { getCompanies } from "@/services/apiCompanies";
import { useEffect, useState } from "react";

export function useCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0); 

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const data = await getCompanies();

       
        const companyList = Array.isArray(data?.companies) ? data.companies : [];
        setCompanies(companyList);
        setCount(data?.count || 0);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setCompanies([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  return { companies, loading, count };
}