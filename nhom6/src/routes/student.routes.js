const express = require("express");

module.exports = (controller) => {
  const router = express.Router();

  router.post("/", controller.create);
  router.get("/", controller.getAll);
  router.get("/top", controller.getTop);
  router.get("/stats/avg", controller.getAvg);
  router.get("/search", controller.search);

  router.get("/:id", controller.getById);
  router.put("/:id", controller.update);
  router.delete("/:id", controller.delete);
  router.patch("/:id/score", controller.updateScore);

  return router;
};