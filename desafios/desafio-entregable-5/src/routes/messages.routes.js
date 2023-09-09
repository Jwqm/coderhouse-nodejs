import express from 'express';
import messageModel from '../dao/mongo/model/messages.js';

const router = express.Router();

router.post("/messages", async (req, res) => {
    await messageModel.create(req.body);
    res.redirect('/');
});

router.get('/', async (req, res) => {
    const messages = await messageModel.find({}, 'user message').lean();
    res.render('chat', { messages });
});

export default router;
