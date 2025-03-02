function rolePolice(roles) {
   return (req, res, next) => {
      let { role } = req.user;

      if (roles.includes(role)) {
         return next();
      }

      res.status(403).json({ message: "Not allowed." });
   };
}

export default rolePolice;
