import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/config')
      .then((res) => {
        setConfig(res.data);
        setLoading(false);
      })
      .catch(() => {
        setConfig(null);
        setLoading(false);
      });
  }, []);

  return (
    <ConfigContext.Provider value={{ config, setConfig, loading }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider');
  return ctx;
}
