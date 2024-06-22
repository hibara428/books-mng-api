import axios from 'axios';
import { RakutenSearchQueries } from '../types';

class RakutenBooksApi {
    baseUrl = 'https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404';
    baseQueries: RakutenSearchQueries = {
        formatVersion: '2',
    };

    /**
     * Constructor.
     *
     * @param appId
     */
    constructor(appId: string) {
        this.baseQueries.applicationId = appId;
    }

    /**
     * Search books.
     * TODO: Set up only needed parameters.
     *
     * @param queries
     * @param startDate
     * @returns
     */
    async search(queries: RakutenSearchQueries, startDate: Date | undefined) {
        // TODO: startDate以降のみを取得する。ページを辿らせる。
        const params = structuredClone(this.baseQueries);
        params.sort = '-ReleaseDate';
        if (queries.title) {
            params.title = queries.title;
        }
        if (queries.author) {
            params.author = queries.author;
        }
        return await axios.get(this.baseUrl, {
            params: params,
        });
    }
}

export default RakutenBooksApi;
