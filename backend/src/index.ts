import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import authorRoutes from './routes/authors';
import bookRoutes from './routes/books';

const server = Fastify({ logger: true });
server.register(cors, { origin: true });

const prisma = new PrismaClient();

server.decorate('prisma', prisma);

server.get('/', async () => ({ ok: true, message: 'BookClub API' }));

server.register(authorRoutes, { prefix: '/authors' });
server.register(bookRoutes, { prefix: '/books' });

const start = async () => {
  try {
    await server.listen({ port: Number(process.env.PORT || 4000), host: '0.0.0.0' });
    console.log('Server started');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
