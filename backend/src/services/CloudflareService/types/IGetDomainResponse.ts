export interface IGetDomainResponse {
    result: GetDomainResult[];
    success: boolean;
    errors: any[];
    messages: any[];
    result_info: ResultInfo;
}

export interface GetDomainResult {
    id: string;
    zone_id: string;
    zone_name: string;
    name: string;
    type: string;
    content: string;
    proxiable: boolean;
    proxied: boolean;
    ttl: number;
    comment: string;
}

export interface ResultInfo {
    page: number;
    per_page: number;
    count: number;
    total_count: number;
    total_pages: number;
}
