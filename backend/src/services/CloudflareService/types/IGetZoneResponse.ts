export interface IGetZoneResponse {
    result: ZoneResult[];
    result_info: ResultInfo;
    success: boolean;
    errors: any[];
    messages: any[];
}

export interface ZoneResult {
    id: string;
    name: string;
    status: string;
    paused: boolean;
    type: string;
    development_mode: number;
    name_servers: string[];
    account: Account;
    owner?: Owner;
}

export interface Account {
    id: string;
    name: string;
}

export interface Owner {
    id: any;
    type: string;
    email: any;
}

export interface ResultInfo {
    page: number;
    per_page: number;
    total_pages: number;
    count: number;
    total_count: number;
}
