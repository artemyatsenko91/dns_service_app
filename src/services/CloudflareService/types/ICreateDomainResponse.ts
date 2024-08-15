export interface ICreateDomainResponse {
    result: Result;
    success: boolean;
    errors: any[];
    messages: any[];
}

export interface Result {
    id: string;
    name: string;
    status: string;
    paused: boolean;
    type: string;
    development_mode: number;
    name_servers: string[];
}
