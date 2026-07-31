import { useEffect, useMemo, useState } from "react";

const formatTime = (value) => String(value).padStart(2, "0");

const useCampaignCountdown = (targetDate) => {
  const parsedTarget = useMemo(
    () => new Date(targetDate).getTime(),
    [targetDate],
  );
  const isValidTarget = Number.isFinite(parsedTarget) && parsedTarget > 0;

  const [timeLeft, setTimeLeft] = useState(() =>
    isValidTarget ? parsedTarget - Date.now() : 0,
  );

  useEffect(() => {
    if (!isValidTarget) {
      setTimeLeft(0);
      return;
    }

    setTimeLeft(parsedTarget - Date.now());

    const interval = setInterval(() => {
      setTimeLeft(parsedTarget - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isValidTarget, parsedTarget]);

  return useMemo(() => {
    if (!isValidTarget) {
      return { status: "active", units: [] };
    }

    if (timeLeft <= 0) {
      return { status: "finished", units: [] };
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return {
      status: "counting",
      units: [
        `${formatTime(days)} DÍAS`,
        `${formatTime(hours)} HRS`,
        `${formatTime(minutes)} MIN`,
        `${formatTime(seconds)} SEG`,
      ],
    };
  }, [isValidTarget, timeLeft]);
};

export default useCampaignCountdown;
