export function authorizeModification(req, res, next) {
  const { role, id } = req.user;
  const targetUserId = req.params.userId;

  if (role === 'parent') {
    return next();
  }

  if (role === 'child' && id === targetUserId) {
    return next();
  }

  return res.status(403).json({ error: "Access denied" });
}