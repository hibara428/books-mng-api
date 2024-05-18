import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { etag } from 'hono/etag';

const app = new Hono<{ Bindings: { DB: D1Database } }>();
app.use('*', cors(), etag());

// End points
app.get('/test', async (context) => {
    return context.json({ message: 'ok' }, 200);
});

export default app;
