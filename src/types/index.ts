/**
 * Context
 */
export type Bindings = {
    DB: D1Database;
};
export type Env = {
    Bindings: Bindings;
    RAKUTEN_API_APP_KEY: string;
};
/**
 * Requests
 */
export type userSearchConditionBody = {
    type: number;
    keyword: string;
};
/**
 * Rakuten Books API
 */
export type RakutenSearchQueries = {
    applicationId?: string;
    formatVersion?: string;
    sort?: string;
    title?: string;
    author?: string;
};
