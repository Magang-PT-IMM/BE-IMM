const route = require("express").Router();
const permit = require("../../controllers/permit/permitController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../../middleware/authMiddleware");

route.get(
  "/get-all-permit",
  authMiddleware,
  roleMiddleware("ADMIN"),
  permit.getAllPermit
);

route.get("/get-permit-by-id/:id", authMiddleware, permit.getPermitById);
route.get(
  "/get-all-permit-by-users",
  authMiddleware,
  permit.getAllPermitByUsers
);
route.get(
  "/get-all-permit-deleted",
  authMiddleware,
  roleMiddleware("ADMIN"),
  permit.getAllPermitDeleted
);
route.get(
  "/get-permit-deleted-by-user",
  authMiddleware,
  permit.getPermitDeletedByUser
);
route.post(
  "/create-permit",
  authMiddleware,
  roleMiddleware("ADMIN"),
  permit.createPermit
);

route.put(
  "/update-permit/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  permit.updatePermit
);

route.delete(
  "/delete-permit/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  permit.deletePermit
);

module.exports = route;
