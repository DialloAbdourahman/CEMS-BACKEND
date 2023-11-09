import { PrismaClient } from '@prisma/client';
const prisma: PrismaClient = require('../utils/prismaClient');

const initialize = async () => {
  await prisma.user.deleteMany({});
  await prisma.equipment.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.hall.deleteMany({});
  await prisma.equipmentType.deleteMany({});
  await prisma.userType.deleteMany({});
  await prisma.state.deleteMany({});

  await prisma.userType.create({
    data: {
      name: 'admin',
      description: 'This is the super user.',
    },
  });

  await prisma.userType.create({
    data: {
      name: 'user',
      description: 'This is a simple user.',
    },
  });

  await prisma.state.create({
    data: {
      name: 'Good',
      description: 'The equipment is functioning perfectly.',
    },
  });

  await prisma.state.create({
    data: {
      name: 'Bad',
      description: 'The equipment is not working.',
    },
  });

  await prisma.state.create({
    data: {
      name: 'Under reparation',
      description: 'The equipment is under reparation.',
    },
  });

  await prisma.equipmentType.create({
    data: {
      name: 'CPU',
      description: 'This is a cpu',
    },
  });

  await prisma.equipmentType.create({
    data: {
      name: 'Printer',
      description: 'This is a printer',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: '$2b$08$r5jqVTl6Dm73TkmKjMpHJuN38sHfmh1kfiQ9tbrVPJR4y9FzPpP0y',
      type: 'admin',
      userRole: 'manager',
      phoneNumber: '620487789',
    },
  });

  await prisma.user.create({
    data: {
      name: 'User',
      email: 'user@gmail.com',
      password: '$2b$08$jHyX/9YLdLMo5KmjxXgDxu2m99wuQSaBKTP/yb.Gv5mFYctZmKduq',
      type: 'user',
      userRole: 'manager',
      phoneNumber: '620487789',
    },
  });
};
initialize();
