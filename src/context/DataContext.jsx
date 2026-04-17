import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import api from "../api";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [stats, setStats] = useState(null);
  const [schools, setSchools] = useState([]);
  const [plans, setPlans] = useState([]);
  const [schoolsPagination, setSchoolsPagination] = useState({ totalPages: 1 });
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);

  const statsCache = useRef(null);
  const plansCache = useRef(null);

  const fetchStats = useCallback(async (force = false) => {
    if (!force && statsCache.current) {
      setStats(statsCache.current);
      return statsCache.current;
    }
    setLoadingStats(true);
    try {
      const { data } = await api.get("/api/super-admin/reports/system-overview");
      statsCache.current = data;
      setStats(data);
      return data;
    } catch (err) {
      console.error("Stats fetch error:", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchPlans = useCallback(async (force = false) => {
    if (!force && plansCache.current) {
      setPlans(plansCache.current);
      return plansCache.current;
    }
    setLoadingPlans(true);
    try {
      const { data } = await api.get("/api/plan/all");
      const list = data.plans || [];
      plansCache.current = list;
      setPlans(list);
      return list;
    } catch (err) {
      console.error("Plans fetch error:", err);
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  const fetchSchools = useCallback(async (page = 1, search = "") => {
    setLoadingSchools(true);
    try {
      const { data } = await api.get(`/api/client/all?page=${page}&limit=10&search=${search}`);
      setSchools(data.clients || []);
      setSchoolsPagination(data.pagination || { totalPages: 1 });
      return data;
    } catch (err) {
      console.error("Schools fetch error:", err);
    } finally {
      setLoadingSchools(false);
    }
  }, []);

  const invalidatePlans = () => { plansCache.current = null; };
  const invalidateStats = () => { statsCache.current = null; };

  return (
    <DataContext.Provider value={{
      stats, schools, plans, schoolsPagination,
      loadingStats, loadingSchools, loadingPlans,
      fetchStats, fetchPlans, fetchSchools,
      invalidatePlans, invalidateStats,
      setSchools, setPlans,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
