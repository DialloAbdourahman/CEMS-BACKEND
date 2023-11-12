import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma: PrismaClient = require('../utils/prismaClient');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/generateAuthToken');

const login = async (req: Request, res: Response) => {
  try {
    // Get all the user's information.
    let { email, password } = req.body;

    // Check if all fields are present.
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide email and password' });
    }

    // Validate the email.
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid Email' });
    }

    // Check if the email matches.
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        type: true,
      },
    });
    if (!user) {
      return res.status(400).json({ message: 'Unable to login' });
    }

    // Now compare the passwords.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Unable to login' });
    }

    // Generate access token
    let dataToGenerateAuthToken: any = { ...user, password: undefined };
    const accessToken = generateAccessToken(
      dataToGenerateAuthToken,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );

    // Generate refresh token and store it in database.
    const refreshToken: string = generateRefreshToken(
      dataToGenerateAuthToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: refreshToken,
      },
    });

    // Send back response.
    res.status(200).json({
      name: user.name,
      email: user.email,
      type: user.type,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    // Delete the refresh token found in the database
    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        token: null,
      },
    });

    // Send a positive response to the cachier
    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const token = async (req: Request, res: Response) => {
  try {
    // Get the refresh token.
    const refreshToken: any = req
      .header('Authorization')
      ?.replace('Bearer ', '');

    // Decode the refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );

    // Find the user in the database using the id encoded in the token
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
        token: refreshToken,
      },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
      },
    });

    // Check if user was found
    if (!user) {
      res.status(401).json({ message: 'Please authenticate.' });
      return;
    }

    // Generate a new access token
    const accessToken = generateAccessToken(
      user,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );

    // Send the access token to the system admin
    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const updateAccount = async (req: Request, res: Response) => {
  try {
    // Get the enteries and create a valid enteries array
    const enteries = Object.keys(req.body);

    if (enteries.length < 1) {
      return res.status(400).json({ message: 'Please provide data to us.' });
    }
    const allowedEntery = ['name', 'email', 'password', 'phoneNumber'];

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

    // Check if the password should be updated and then encrypt it.
    const passwordUpdate = enteries.find((entery) => entery === 'password');
    if (passwordUpdate) {
      req.body.password = await bcrypt.hash(req.body.password, 8);
    }

    // Update the system admin's information.
    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        ...req.body,
      },
    });

    // Send back a positive response
    res
      .status(200)
      .json({ message: 'Your credentials have been updated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const seeHalls = async (req: Request, res: Response) => {
  try {
    // Get relevant data from request query
    let name: string = String(req.query.name);
    let page: number = Number(req.query.page);

    // Configure the pages. Here, the first page will be 1.
    const itemPerPage = 10;
    page = page - 1;

    // Get all the halls from db.
    const halls = await prisma.hall.findMany({
      take: itemPerPage,
      skip: itemPerPage * page,
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

    // Send back a positive response with all the halls
    return res.status(200).json(halls);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const seePosts = async (req: Request, res: Response) => {
  try {
    // Get relevant data from request query
    let name: string = String(req.query.name);
    let page: number = Number(req.query.page);

    // Configure the pages. Here, the first page will be 1.
    const itemPerPage = 10;
    page = page - 1;

    // Get all the posts from db.
    const posts = await prisma.post.findMany({
      take: itemPerPage,
      skip: itemPerPage * page,
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

    // Send back a positive response with all the posts
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const seeUserTypes = async (req: Request, res: Response) => {
  try {
    // Get all the user types from db.
    const userTypes = await prisma.userType.findMany({});

    // Send back a positive response with all the user types
    return res.status(200).json(userTypes);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const seeEquipmentTypes = async (req: Request, res: Response) => {
  try {
    // Get all the equipment types from db.
    const equipmentTypes = await prisma.equipmentType.findMany({});

    // Send back a positive response with all the equipment types
    return res.status(200).json(equipmentTypes);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const seeEquipmentStates = async (req: Request, res: Response) => {
  try {
    // Get all the equipment state from db.
    const equipmentState = await prisma.state.findMany({});

    // Send back a positive response with all the equipment states
    return res.status(200).json(equipmentState);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

const searchEquipment = async (req: Request, res: Response) => {
  try {
    // Get relevant data from request query
    let hall: string = String(req.query.hall);
    let state: string = String(req.query.state);
    let post: string = String(req.query.post);
    let type: string = String(req.query.type);
    let page: number = Number(req.query.page);

    // Configure the pages. Here, the first page will be 1.
    const itemPerPage = 10;
    page = page - 1;

    // Construct a search object
    const searchFilter: any = {};
    if (hall !== 'undefined') {
      searchFilter.hall = hall;
    }
    if (post !== 'undefined') {
      searchFilter.post = post;
    }
    if (state !== 'undefined') {
      searchFilter.state = state;
    }
    if (type !== 'undefined') {
      searchFilter.type = type;
    }

    // Get every equipment from db.
    const equipment = await prisma.equipment.findMany({
      take: itemPerPage,
      skip: itemPerPage * page,
      where: searchFilter,
      select: {
        id: true,
        hall: true,
        location: true,
        post: true,
        state: true,
        type: true,
        name: true,
        description: true,
      },
    });

    // Send back a positive response with every equipment
    return res.status(200).json(equipment);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error });
  }
};

module.exports = {
  login,
  logout,
  token,
  seeHalls,
  seePosts,
  updateAccount,
  seeUserTypes,
  seeEquipmentStates,
  seeEquipmentTypes,
  searchEquipment,
};
