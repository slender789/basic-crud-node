// Rutas Usuarios / Auth
// host + /api/auth 

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { createUser, loginUser, revalidateToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validarJWT');

router.post(
    '/new',
     [
        check('name', 'Need name').not().isEmpty(),
        check('email', 'Need email').isEmail(),
        check('password', 'Need password >= 6').isLength({min:6}),
        validarCampos
     ], 
     createUser
     );
     
router.post(
    '/', 
    [
        check('email', 'Need email').isEmail(),
        check('password', 'Need password >= 6').isLength({min:6}),
        validarCampos
    ], 
    loginUser
);

router.post(
    '/renew',
    validarJWT,
    revalidateToken
);

module.exports = router;