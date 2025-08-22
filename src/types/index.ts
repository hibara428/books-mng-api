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
    elements?: string;
    sort?: string;
    page?: number;
    title?: string;
    author?: string;
};
export type RakutenSearchResponse = {
    Items: RakutenSearchResponseItemObject[];
    carrier: number;
    count: number;
    first: number;
    hits: number;
    last: number;
    page: number;
    pageCount: number;
};
export type RakutenSearchResponseItemObject = {
    Item: RakutenSearchResponseItem;
};
export type RakutenSearchResponseItem = {
    author: string;
    authorKana: string;
    isbn: string;
    itemCaption: string;
    itemPrice: number;
    publisherName: string;
    salesDate: string;
    seriesName: string;
    seriesNameKana: string;
    size: string;
    subTitle: string;
    subTitleKana: string;
    title: string;
    titleKana: string;
};
export type RakutenSearchItem = {
    author: string;
    authorKana: string;
    isbn: string;
    itemCaption: string;
    itemPrice: number;
    publisherName: string;
    salesDate: Date;
    salesDateText: string;
    seriesName: string;
    seriesNameKana: string;
    size: string;
    subTitle: string;
    subTitleKana: string;
    title: string;
    titleKana: string;
};
export type RakutenSearchErrorResponse = {
    error: string;
    error_description: string;
};
