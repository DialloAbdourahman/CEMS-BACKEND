import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const bcrypt = require('bcrypt');
const prisma: PrismaClient = require('../utils/prismaClient');

const createUser = async (req: Request, res: Response) => {
  try {
    // Get data from request body
    let { name, email, password, phoneNumber, userRole, type } = req.body;

    // Check if all the information has been entered.
    if (!name || !email || !password || !phoneNumber || !userRole || !type) {
      return res
        .status(400)
        .json({ message: 'Please enter all the information.' });
    }

    // Hash the password.
    password = await bcrypt.hash(password, 8);

    // Create a user
    await prisma.user.create({
      data: {
        name,
        email,
        password,
        phoneNumber,
        userRole,
        type,
      },
    });

    // Send back positive response.
    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const createHall = async (req: Request, res: Response) => {
  try {
    // Get data from request body
    let { name, description } = req.body;

    // Check if all the information has been entered.
    if (!name) {
      return res.status(400).json({ message: 'Please at least the name.' });
    }

    // Create a hall
    await prisma.hall.create({
      data: {
        name,
        description,
      },
    });

    // Send back positive response.
    res.status(201).json({ message: 'Hall created successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const updateHall = async (req: Request, res: Response) => {
  try {
    // Get the id of the hall
    const { id } = req.params;

    // Get the enteries and create a valid enteries array
    const enteries = Object.keys(req.body);
    if (enteries.length < 1) {
      return res.status(400).json({ message: 'Please provide data to us.' });
    }

    const allowedEntery = ['name', 'description'];

    // Check if the enteries are valid
    const isValidOperation = enteries.every((entery) => {
      return allowedEntery.includes(entery);
    });

    // Send negative response if the enteries are not allowed.
    if (!isValidOperation) {
      res.status(400).send({
        message: 'You are trying to update data you are not allowed to',
      });
      return;
    }

    // Update the hall's information.
    await prisma.hall.update({
      where: {
        id: id,
      },
      data: {
        ...req.body,
      },
    });

    // Send back a positive response
    res.status(200).json({ message: 'Hall has been updated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const deleteHall = async (req: Request, res: Response) => {
  try {
    // Get the id of the hall
    const { id } = req.params;

    // Update the hal's information.
    await prisma.hall.delete({
      where: {
        id: id,
      },
    });

    // Send back a positive response
    res.status(200).json({ message: 'Hall has been deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

module.exports = { createUser, createHall, updateHall, deleteHall };
