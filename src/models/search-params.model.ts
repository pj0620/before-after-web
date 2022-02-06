/* eslint camelcase: 0 */

export interface SearchParams {
    start_weight?: number,
    start_weight_range?: number,
    end_weight?: number,
    end_weight_range?: number,
    nsfw?: boolean,
    age?: number,
    age_range?: number,
    gender?: string,
    height?: number,
    limit?: number,
    offset?: number
}
