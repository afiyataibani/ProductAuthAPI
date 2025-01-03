function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (
      !req.user ||
      !allowedRoles.some((role) => req.user.roles.includes(role))
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

module.exports = authorizeRoles;
