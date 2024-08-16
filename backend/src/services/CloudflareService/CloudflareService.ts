import axios, { AxiosError, AxiosInstance } from "axios";
import { ICreateDomainResponse } from "./types/ICreateDomainResponse";
import { IGetZoneResponse } from "./types/IGetZoneResponse";
import { IGetDomainResponse } from "./types/IGetDomainResponse";
import { IDNSRecord } from "../../bot/ISessionData";

export class CloudflareService {
    private axiosInstance: AxiosInstance;
    private cloudflareBaseUrl = "https://api.cloudflare.com/client/v4/zones";
    constructor(
        private readonly api_token: string,
        private readonly global_api_key: string,
        private readonly email: string,
    ) {
        this.axiosInstance = axios.create({
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.api_token}`,
                "X-Auth-Key": this.global_api_key,
                "X-Auth-Email": this.email,
            },
        });
    }

    async createDomain(domain: string) {
        const data = JSON.stringify({
            name: domain,
        });

        try {
            const response =
                await this.axiosInstance.post<ICreateDomainResponse>(
                    this.cloudflareBaseUrl,
                    data,
                );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.errors);
            }
        }
    }

    async createDnsRecord(subDomainName: string, zone_id: string) {
        try {
            const infoAboutDomain = await this.getInfoAboutDomain(zone_id);

            const data = JSON.stringify({
                name: subDomainName,
                content: infoAboutDomain?.result[0].content,
                type: "A",
                comment: subDomainName,
                id: zone_id,
            });

            const response = await this.axiosInstance.post(
                `${this.cloudflareBaseUrl}/${zone_id}/dns_records`,
                data,
            );

            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.errors);
            }
        }
    }

    async getInfoAboutDomain(
        zone_id: string,
    ): Promise<IGetDomainResponse | undefined> {
        try {
            const response = await this.axiosInstance.get<IGetDomainResponse>(
                `${this.cloudflareBaseUrl}/${zone_id}/dns_records`,
            );

            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.errors);
            }
        }
    }

    async getDomainsList() {
        try {
            const response = await this.axiosInstance.get<IGetZoneResponse>(
                this.cloudflareBaseUrl,
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.errors);
            }
        }
    }

    async deleteDnsRecord(zone_id: string, id: string) {
        try {
            const response = await this.axiosInstance.delete<{
                result: {
                    id: string;
                };
            }>(`${this.cloudflareBaseUrl}/${zone_id}/dns_records/${id}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.errors);
            }
        }
    }

    async updateDnsRecord(
        oldData: IDNSRecord,
        zone_id: string,
        newData: IDNSRecord,
    ) {
        const data = {
            ...oldData,
            ...newData,
        };

        try {
            const response = await this.axiosInstance.put<IGetZoneResponse>(
                `${this.cloudflareBaseUrl}/${zone_id}/dns_records/${oldData.id}`,
                data,
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.errors);
            }
        }
    }
}
