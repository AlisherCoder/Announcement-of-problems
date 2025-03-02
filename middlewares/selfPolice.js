function selfPolice(roles) {
   return (req, res, next) => {
      let { role } = req.user;
      let { id } = req.params;

      if (roles.includes(role) || req.user.id == id) {
         return next();
      }

      res.status(403).json({ message: "Not allowed." });
   };
}

export default selfPolice;
