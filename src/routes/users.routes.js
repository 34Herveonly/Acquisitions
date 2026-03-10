import express from 'express';
import fetchAllUsers from '#controller/users.controller.js';

const router= express.Router();

router.get('/',fetchAllUsers);

router.get('/:id',(req,res)=>res.send('GET /users/:id'));

router.put('/',(req,res)=>res.send('PUT /users/:id'));

router.delete('/:id',(req,res)=>res.send('DELETE /users/:id'));

export default router;
