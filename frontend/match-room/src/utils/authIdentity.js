function optionalText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

// The session endpoint is the only frontend source of truth for identity.
export function sessionIdentity(response) {
  const user = response?.user;
  if (!user || typeof user.id !== "string" || typeof user.email !== "string") return null;

  return {
    id: user.id,
    email: user.email,
    activeMode: user.activeMode,
    firstName: optionalText(user.firstName),
    lastName: optionalText(user.lastName),
  };
}

export function identityDisplayName(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Usuario";
}
