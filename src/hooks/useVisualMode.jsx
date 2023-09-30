import { useState } from "react";

const useVisualMode = (initial) => {
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    if (replace) {
      setHistory((prev) => [newMode, ...prev.slice(1)]);
    } else {
      setHistory((prev) => [newMode, ...prev]);
    }
  };

  const back = () => {
    if (history.length > 1) {
      setHistory((prev) => [...prev.slice(1)]);
    }
  };

  return { mode: history[0], transition, back };
};

export default useVisualMode;
