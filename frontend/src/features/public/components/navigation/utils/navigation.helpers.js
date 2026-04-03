export const capitalizeName = (name) =>
  String(name || "Usuario")
    .split(" ")
    .map((word) =>
      word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : "",
    )
    .filter(Boolean)
    .join(" ") || "Usuario";
