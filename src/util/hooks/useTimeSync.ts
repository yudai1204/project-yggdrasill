import { useState, useEffect } from "react";

export const useTimeSync = () => {
  const [timeOffset, setTimeOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const fetchTime = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const response = await fetch(
          "https://worldtimeapi.org/api/timezone/Etc/UTC"
        );
        const data = await response.json();

        const serverTime = new Date(data.utc_datetime).getTime();
        const clientTime = new Date().getTime();

        const offset = clientTime - serverTime;
        setTimeOffset(offset);
        setError(false);
      } catch (error) {
        setError(true);
        console.error("Error fetching time:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTime();
  }, []);

  return { timeOffset, loading, error };
};
