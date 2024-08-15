export interface ISessionData {
    state?: State;
    chatId?: number;
    domainZoneId?: string;
    ip?: string;
    dnsRecordToEdit?: IDNSRecord;
    editedDnsRecord?: IDNSRecord;
}

export enum State {
    REGISTER_DOMAIN = "REGISTER_DOMAIN",
    CREATE_DNS_RECORD = "CREATE_DNS_RECORD",
    EDIT_DNS_COMMENT = "EDIT_DNS_COMMENT",
    EDIT_DNS_CONTENT = "EDIT_DNS_CONTENT",
    EDIT_DNS_NAME = "EDIT_DNS_NAME",
    EDIT_DNS_TYPE = "EDIT_DNS_TYPE",
    EDIT_DNS_PROFIED = "EDIT_DNS_PROFIED",
    NEUTRAL = "NEUTRAL",
}

export interface IDNSRecord {
    content?: string;
    name?: string;
    proxied?: boolean;
    type?: string;
    comment?: string;
    id?: string;
}
