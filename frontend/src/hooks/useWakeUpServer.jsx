import { useEffect, useState } from "react";
import axios from "../api/axios";

const useWakeUpServer = () => {
  const [wakingUp, setWakingUp] = useState(true);

  useEffect(() => {
    const wakeUp = async () => {
      try {
        // Ping a fast backend route (e.g., /ping or /api/auth/login with dummy)
        await axios.get("/api/ping");
      } catch (err) {
        console.warn("Backend not responding yet...");
      } finally {
        setTimeout(() => setWakingUp(false), 2000); // Simulate loading
      }
    };

    wakeUp();
  }, []);

  return wakingUp;
};

export default useWakeUpServer;
