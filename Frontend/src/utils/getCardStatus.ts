export const getCardStatus = (measurement: number, unit: string) => {
  if (unit === "psi") {
    if (measurement < 100)
      return { indicatorColor: "red", message: "Warning: Pressure is too low" };
    if (measurement < 600)
      return { indicatorColor: "yellow", message: "Warning: Pressure is little low" };
    if (measurement > 2000)
      return { indicatorColor: "red", message: "Warning: Pressure is too high" };
    return { indicatorColor: "green", message: null };
  }

  if (unit === "°C") {
    if (measurement < 500)
      return { indicatorColor: "yellow", message: "Warning: Temperature is little low" };
    if (measurement > 1500)
      return { indicatorColor: "red", message: "Warning: Temperature is too high" };
    return { indicatorColor: "green", message: null };
  }

  return { indicatorColor: "gray", message: null };
};
