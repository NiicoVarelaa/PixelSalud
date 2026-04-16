const { procesarCuponesCumpleanos } = require("./CuponesCumpleanosService");

let timeoutId = null;
let intervalId = null;

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const msUntilNextRun = (hour, minute) => {
  const now = new Date();
  const next = new Date(now);
  next.setHours(hour, minute, 0, 0);

  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }

  return next.getTime() - now.getTime();
};

const startBirthdayCouponScheduler = () => {
  const enabled =
    String(process.env.BIRTHDAY_COUPON_ENABLED || "true") !== "false";
  if (!enabled) {
    console.log("[Cumpleanos] Scheduler deshabilitado por entorno");
    return;
  }

  const hour = parseNumber(process.env.BIRTHDAY_COUPON_HOUR, 9);
  const minute = parseNumber(process.env.BIRTHDAY_COUPON_MINUTE, 0);
  const runOnBoot =
    String(process.env.BIRTHDAY_COUPON_RUN_ON_BOOT || "false") === "true";

  if (runOnBoot) {
    procesarCuponesCumpleanos()
      .then((resumen) => {
        console.log(
          `[Cumpleanos] Ejecucion inicial: ${resumen.enviados} enviados, ${resumen.fallidos} fallidos`,
        );
      })
      .catch((error) => {
        console.error(
          "[Cumpleanos] Error en ejecucion inicial:",
          error.message,
        );
      });
  }

  const delay = msUntilNextRun(hour, minute);
  timeoutId = setTimeout(async () => {
    try {
      const resumen = await procesarCuponesCumpleanos();
      console.log(
        `[Cumpleanos] Ejecucion diaria: ${resumen.enviados} enviados, ${resumen.fallidos} fallidos`,
      );
    } catch (error) {
      console.error("[Cumpleanos] Error en ejecucion diaria:", error.message);
    }

    intervalId = setInterval(
      async () => {
        try {
          const resumen = await procesarCuponesCumpleanos();
          console.log(
            `[Cumpleanos] Ejecucion diaria: ${resumen.enviados} enviados, ${resumen.fallidos} fallidos`,
          );
        } catch (error) {
          console.error(
            "[Cumpleanos] Error en ejecucion diaria:",
            error.message,
          );
        }
      },
      24 * 60 * 60 * 1000,
    );
  }, delay);
};

const stopBirthdayCouponScheduler = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

module.exports = {
  startBirthdayCouponScheduler,
  stopBirthdayCouponScheduler,
};
