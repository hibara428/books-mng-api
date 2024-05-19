import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { etag } from 'hono/etag';
import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { UserKeywordBody } from './types';

const app = new Hono<{ Bindings: { DB: D1Database } }>();
app.use('*', cors(), etag());

/**
 * Retrieve users.
 */
app.get('/users', async (context) => {
    // Request
    const email = context.req.query('email');
    if (email && !email.match(/.+@.+\..+/)) {
        return context.json({ result: false, message: 'Invalid request' }, 400);
    }

    // Main
    try {
        const prisma = new PrismaClient({ adapter: new PrismaD1(context.env.DB) });
        let whereOptions = {};
        if (email) {
            whereOptions = {
                email: email,
            };
        }
        const users = await prisma.user.findMany({
            where: whereOptions,
        });
        if (users.length < 1) {
            return context.json({ result: false, message: 'Not found' }, 404);
        }
        return context.json({ result: true, message: 'ok', data: { users: users } }, 200);
    } catch (e: any) {
        console.error(e.message);
        return context.json({ result: false, message: e.message }, 500);
    }
});

/**
 * Retrieve user.
 */
app.get('/users/:userId', async (context) => {
    // Request
    const userId = Number(context.req.param('userId'));
    if (!Number.isInteger(userId)) {
        return context.json({ result: false, message: 'Invalid request' }, 400);
    }

    // Main
    try {
        const prisma = new PrismaClient({ adapter: new PrismaD1(context.env.DB) });
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return context.json({ result: false, message: 'Not found' }, 404);
        }
        return context.json({ result: true, message: 'ok', data: user }, 200);
    } catch (e: any) {
        console.error(e.message);
        return context.json({ result: false, message: e.message }, 500);
    }
});

/**
 * Retrieve user's new publication books.
 */
app.get('/users/:userId/books/new', async (context) => {
    // Request
    const userId = Number(context.req.param('userId'));
    if (!Number.isInteger(userId)) {
        return context.json({ result: false, message: 'Invalid request' }, 400);
    }
    const month = Number(context.req.query('month'));
    if (!Number.isInteger(month)) {
        return context.json({ result: false, message: 'Invalid request' }, 400);
    }

    // Main
    try {
        const prisma = new PrismaClient({ adapter: new PrismaD1(context.env.DB) });
        const userNewPublicationBooks = await prisma.userNewPublicationBook.findMany({
            where: {
                userId: userId,
                month: String(month),
            },
            include: {
                book: true,
            },
        });
        if (userNewPublicationBooks.length < 1) {
            return context.json({ result: false, message: 'Not found' }, 404);
        }
        const books = userNewPublicationBooks.map((userNewPublicationBook) => {
            return userNewPublicationBook.book;
        });
        return context.json({ result: true, message: 'ok', data: { books: books } }, 200);
    } catch (e: any) {
        console.error(e.message);
        return context.json({ result: false, message: e.message }, 500);
    }
});

/**
 * Retrieve user's keywords.
 */
app.get('/users/:userId/keywords', async (context) => {
    // Request
    const userId = Number(context.req.param('userId'));
    if (!Number.isInteger(userId)) {
        return context.json({ result: false, message: 'Invalid request' }, 400);
    }

    // Main
    try {
        const prisma = new PrismaClient({ adapter: new PrismaD1(context.env.DB) });
        const userKeywords = await prisma.userKeyword.findMany({
            where: {
                userId: userId,
            },
        });
        if (userKeywords.length < 1) {
            return context.json({ result: false, message: 'Not found' }, 404);
        }
        return context.json({ result: true, message: 'ok', data: { keywords: userKeywords } }, 200);
    } catch (e: any) {
        console.error(e.message);
        return context.json({ result: false, message: e.message }, 500);
    }
});

/**
 * Add the user's keyword.
 */
app.post('/users/:userId/keywords', async (context) => {
    // Request
    const userId = Number(context.req.param('userId'));
    if (!Number.isInteger(userId)) {
        return context.json({ result: false, message: 'Invalid request' }, 400);
    }
    const body = await context.req.json<UserKeywordBody>();
    if (!body.type || !body.keyword) {
        return context.json({ error: 'Invalid request' }, 400);
    }
    const type = Number(body.type);
    if (!Number.isInteger(type)) {
        return context.json({ result: false, message: 'Invalid request' }, 400);
    }
    const keyword = String(body.keyword);

    // Main
    try {
        const prisma = new PrismaClient({ adapter: new PrismaD1(context.env.DB) });
        const userKeyword = await prisma.userKeyword.create({
            data: {
                userId: userId,
                type: type,
                keyword: keyword,
            },
        });
        return context.json({ result: true, message: 'ok', data: { keyword: userKeyword } }, 200);
    } catch (e: any) {
        console.error(e.message);
        return context.json({ result: false, message: e.message }, 500);
    }
});

/**
 * Retrieve the user keyword.
 */
app.get('/users/:userId/keywords/:keywordId', async (context) => {
    // Request
    const userId = Number(context.req.param('userId'));
    if (!Number.isInteger(userId)) {
        return context.json({ result: false, message: 'Invalid request' }, 400);
    }
    const keywordId = Number(context.req.param('keywordId'));
    if (!Number.isInteger(keywordId)) {
        return context.json({ result: false, message: 'Invalid request' }, 400);
    }

    // Main
    try {
        const prisma = new PrismaClient({ adapter: new PrismaD1(context.env.DB) });
        const userKeyword = await prisma.userKeyword.findUnique({
            where: {
                id: keywordId,
            },
        });

        if (!userKeyword) {
            return context.json({ result: false, message: 'Not found' }, 404);
        }
        if (userKeyword.userId !== userId) {
            return context.json({ result: false, message: 'Invalid access' }, 401);
        }
        return context.json({ result: true, message: 'ok', data: { keyword: userKeyword } }, 200);
    } catch (e: any) {
        console.error(e.message);
        return context.json({ result: false, message: e.message }, 500);
    }
});

/**
 * Update the user's keyword.
 */
app.post('/users/:userId/keywords/:keywordId', async (context) => {
    // Request
    const userId = Number(context.req.param('userId'));
    if (!Number.isInteger(userId)) {
        return context.json({ result: false, message: 'Invalid request' }, 400);
    }
    const keywordId = Number(context.req.param('keywordId'));
    if (!Number.isInteger(keywordId)) {
        return context.json({ result: false, message: 'Invalid request' }, 400);
    }
    const body = await context.req.json<UserKeywordBody>();
    if (!body.type || !body.keyword) {
        return context.json({ error: 'Invalid request' }, 400);
    }
    const type = Number(body.type);
    if (!Number.isInteger(type)) {
        return context.json({ result: false, message: 'Invalid request' }, 400);
    }
    const keyword = String(body.keyword);

    // Main
    try {
        const prisma = new PrismaClient({ adapter: new PrismaD1(context.env.DB) });
        const userKeyword = await prisma.userKeyword.update({
            where: {
                id: keywordId,
            },
            data: {
                userId: userId,
                type: type,
                keyword: keyword,
            },
        });
        return context.json({ result: true, message: 'ok', data: { keywords: userKeyword } }, 200);
    } catch (e: any) {
        console.error(e.message);
        return context.json({ result: false, message: e.message }, 500);
    }
});

export default app;
