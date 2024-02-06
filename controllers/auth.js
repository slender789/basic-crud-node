const { response } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser= async(req, res = response) => {
    const {email, password} = req.body;
    try {

        let user = await User.findOne({email});

        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'existing user',
            })
            
        }
        user = new User(req.body);

        // encriptar
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        // JWT
        const token = await generateJWT(user.id, user.name);
        
        return res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'error db',
        })
    }
}

const loginUser= async(req, res = response) => {
    const {email, password} = req.body;
    try {

        let user = await User.findOne({email});

        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'not existing user',
            })
        }
        
        const validPassword = bcrypt.compareSync( password, user.password );
        
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'incorrect password',
            })
        }

        // JWT
        const token = await generateJWT(user.id, user.name);

        return res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'error db',
        })
    }
}

const revalidateToken= async(req, res = response) => {
    
    const uid = req.uid;
    const name = req.name;

    // generar JWT
    const token = await generateJWT(uid, name);
    
    res.json({
        ok:true,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
}