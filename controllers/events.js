const { response } = require('express');
const Event = require('../models/Event');

const getEvent = async(req, res = response) => {
    const events = await Event.find().populate('user', 'name');
    
    res.status(200).json({
        ok: true,
        events
    })
}

const postEvent = async(req, res = response) => {
    
    const event = new Event(req.body);

    try {
        event.user = req.uid;
        const savedEvent = await event.save();
        res.status(201).json({
            ok: true,
            msg: 'postEvent',
            savedEvent
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'error DB'
        })
    }
}

const putEvent = async(req, res = response) => {
    
    const eventId = req.params.id;
    const uid = req.uid;
    
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'event dos not exist'
            })
        }
        
        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'no editing priviliges'
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        // NEW TRUE SO THAT IT RETURNS THE UPDATED
        const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {new: true});

        return res.status(200).json({
            ok: true,
            msg: updatedEvent
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'error DB'
        })
    }
}

const deleteEvent = async(req, res = response) => {
    const eventId = req.params.id;
    const uid = req.uid;
    
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'event dos not exist'
            })
        }
        
        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'no editing priviliges'
            })
        }

        await Event.findByIdAndDelete(eventId);

        return res.status(200).json({
            ok: true,
            msg: `deleted ${eventId}`
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'error DB'
        })
    }
}

module.exports = {
    getEvent,
    postEvent,
    putEvent,
    deleteEvent 
}