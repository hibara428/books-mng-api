import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { etag } from 'hono/etag';
import { Env } from './types';
import { performBookSearchQueue } from './schedulers';
import {
    addUserSearchCondition,
    getUser,
    getUserSearchCondition,
    getUserSearchConditions,
    getUserBooks,
    getUsers,
} from './controllers/users';

/**
 * Application
 */
const app = new Hono<Env>();
app.use('*', cors(), etag());

/**
 * users
 */
app.get('/users', getUsers);
app.get('/users/:userId', getUser);
app.get('/users/:userId/books/new', getUserBooks);
app.get('/users/:userId/search_conditions', getUserSearchConditions);
app.post('/users/:userId/search_condition', addUserSearchCondition);
app.get('/users/:userId/search_condition/:searchConditionId', getUserSearchCondition);

/**
 * Cron Scheduler
 */
const scheduled: ExportedHandlerScheduledHandler<Env> = async (controller: ScheduledController, env: Env, ctx: ExecutionContext) => {
    switch (controller.cron) {
        // per 1h
        case '0 * * * *':
            console.log('perform book search queue: start');
            ctx.waitUntil(performBookSearchQueue(env));
            break;
    }
};

export default {
    fetch: app.fetch,
    scheduled,
};
