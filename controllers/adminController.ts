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

const createPost = async (req: Request, res: Response) => {
  try {
    // Get data from request body
    let { name, description, state, hall } = req.body;

    // Check if all the information has been entered.
    if (!name || !state || !hall) {
      return res
        .status(400)
        .json({ message: 'Please provide atleast the name, state and hall.' });
    }

    // Create a hall
    await prisma.post.create({
      data: {
        name,
        description,
        hall,
        state,
      },
    });

    // Send back positive response.
    res.status(201).json({ message: 'Post created successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    // Get the id of the hall
    const { id } = req.params;

    // Get the enteries and create a valid enteries array
    const enteries = Object.keys(req.body);
    if (enteries.length < 1) {
      return res.status(400).json({ message: 'Please provide data to us.' });
    }
    const allowedEntery = ['name', 'description', 'state', 'hall'];

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

    // Update the post's information.
    await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        ...req.body,
      },
    });

    // Send back a positive response
    res.status(200).json({ message: 'Post has been updated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    // Get the id of the post
    const { id } = req.params;

    // Update the hal's information.
    await prisma.post.delete({
      where: {
        id: id,
      },
    });

    // Send back a positive response
    res.status(200).json({ message: 'Post has been deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const searchUsers = async (req: Request, res: Response) => {
  try {
    // Get relevant data from request query
    let name: string = String(req.query.name);
    let page: number = Number(req.query.page);

    // Configure the pages. Here, the first page will be 1.
    const itemPerPage = 10;
    page = page - 1;

    // Get all the users from db.
    const users = await prisma.user.findMany({
      take: itemPerPage,
      skip: itemPerPage * page,
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        userRole: true,
        type: true,
      },
    });

    // Send back a positive response with all the users
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    // Get the id of the user
    const { id } = req.params;

    // Update the hal's information.
    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    // Send back a positive response
    res.status(200).json({ message: 'User has been deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

module.exports = {
  createUser,
  createHall,
  updateHall,
  deleteHall,
  createPost,
  updatePost,
  deletePost,
  searchUsers,
  deleteUser,
};
