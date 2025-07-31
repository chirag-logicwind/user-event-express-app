import Event from '../models/event.model.js';
import EventInvite from '../models/eventInvite.model.js';
import User from '../models/user.model.js';
import { Op } from 'sequelize';

// create
export const createEvent = async (req, res) => {
    const { title, description, date } = req.body;
    const event = await Event.create({ title, description, date, creatorId: req.user.id });
    res.status(201).json({ event });
}

//  invite
export const inviteUsers = async (req, res) => {
    const eventId = req.params.id;
    const { emails } = req.body;
    
    const event = await Event.findOne({ where: { id: eventId, creatorId: req.user.id } });
    if(!event)
        return res.status(404).json({ message: 'Event not found..!' });
    
    const invites = emails.map( email => ({ email, EventId: eventId }) );
}

// list
export const listEvents = async (req, res) => {
    const userEmail = req.user.email;
    const { page = 1, limit =  10, sort = 'createdAt', order = 'DESC', search = '', startDate, endDate } = req.query;
    const offset = (page - 1) * limit;
    
    const dataFilter = {};
    if(startDate) dataFilter[Op.gte] = new Date(startDate);
    if(endDate) dataFilter[Op.lte] = new Date(endDate);

    const whereClause = {
        ...(search && { title: { [Op.iLike]: `%{search}%` } }),
        ...(startDate || endDate ? { date: dataFilter } : {})
    }; 

    const [createdEvents, invitedEvents] = await Promise.all([
        Event.findAndCountAll({
            where: { ...whereClause, creatorId: req.user.id },
            include: [{ model: User, as: 'creator', attributes: ['name', 'email'] }],
            limit: +limit,
            offset,
            order: [[sort, order]]
        }),
        Event.findAndCountAll({
            where: whereClause,            
            include: [
                { model: EventInvite, where: { email: userEmail }, required: true },
                { model: User, as: 'creator', attributes: ['name', 'email'] }
            ],
            limit: +limit,
            offset,
            order: [[sort, order]]
        }),
    ]);

    res.json({ createdEvents, invitedEvents });
}

// details
export const getEventDetails = async (req, res) => {
    const event = await Event.findByPk(req.params.id, {
        include: [
            { model: User, as: 'creator', attributes: ['name', 'email']},
            { model: EventInvite, attributes: ['email'] }
        ]
    });

    if(!event)
        return res.status(404).json({ message: 'Event not found' });

    res.json(event);
}

//  update
export const updateEvent = async (req, res) => {
    const event = Event.findOne({ where: { id: req.params.id, 'creatorId': req.user.id } });
    if(!event)
        return res.status(404).send({ message: 'Event not found' });
    
    const { title, description, date } = req.body;
    if(title) event.title = title;
    if(description) event.description = description;
    if(date) event.date = date;

    await event.save();
    res.json({ message: 'Event updated', event });
}
