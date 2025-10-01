import { FastifyInstance } from 'fastify';
import { z, ZodError } from 'zod';

export default async function (fastify: FastifyInstance) {
  const prisma = fastify.prisma;

  // 🔑 Centralized error handling
  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid request data',
        details: error.errors,
      });
    }

    console.error(error);
    return reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  });

  fastify.get('/', async () => {
    const books = await prisma.book.findMany({
      include: { author: true },
      orderBy: { id: 'asc' },
    });

    return books.map(b => ({ ...b, author_name: b.author?.name }));
  });

  fastify.get('/:id', async (request, reply) => {
    const params = z.object({ id: z.coerce.number() }).parse(request.params);
    const book = await prisma.book.findUnique({
      where: { id: params.id },
      include: { author: true },
    });

    if (!book) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Book not found',
      });
    }

    return book;
  });

  fastify.post('/', async (request, reply) => {
    const body = z
      .object({
        title: z.string().min(1),
        author_id: z.coerce.number(),
        description: z.string().optional().nullable(),
        published_year: z.number().int().optional().nullable(),
      })
      .parse(request.body);

    // check if author exists
    const author = await prisma.author.findUnique({
      where: { id: body.author_id },
    });

    if (!author) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Author not found',
      });
    }

    const book = await prisma.book.create({
      data: {
        title: body.title,
        description: body.description ?? null,
        publishedYear: body.published_year ?? null,
        author: { connect: { id: body.author_id } },
      },
    });

    return reply.status(201).send(book);
  });

  fastify.put('/:id', async (request, reply) => {
    const params = z.object({ id: z.coerce.number() }).parse(request.params);
    const body = z
      .object({
        title: z.string().min(1),
        author_id: z.coerce.number(),
        description: z.string().optional().nullable(),
        published_year: z.number().int().optional().nullable(),
      })
      .parse(request.body);

    try {
      const updated = await prisma.book.update({
        where: { id: params.id },
        data: {
          title: body.title,
          description: body.description ?? null,
          publishedYear: body.published_year ?? null,
          author: { connect: { id: body.author_id } },
        },
      });

      return updated;
    } catch {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Book not found',
      });
    }
  });

  fastify.delete('/:id', async (request, reply) => {
    const params = z.object({ id: z.coerce.number() }).parse(request.params);

    const result = await prisma.book.deleteMany({
      where: { id: params.id },
    });

    if (result.count === 0) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Book not found',
      });
    }

    return reply.status(204).send();
  });
}