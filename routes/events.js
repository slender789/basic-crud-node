// Rutas Events
// host + /events

const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();

const { validarJWT } = require("../middlewares/validarJWT");
const {
  getEvent,
  postEvent,
  putEvent,
  deleteEvent,
} = require("../controllers/events");
const { validarCampos } = require("../middlewares/validarCampos");
const { isDate } = require("../helpers/isDate");

// Todas usan Validacion
router.use(validarJWT);

router.get("/", getEvent);

router.post("/", postEvent);

router.put(
  "/:id",
  check("title", "Need title").not().isEmpty(),
  check("start", "Need start").custom(isDate),
  check("end", "Need end").custom(isDate),
  validarCampos,
  putEvent,
);

router.delete("/:id", deleteEvent);

module.exports = router;
