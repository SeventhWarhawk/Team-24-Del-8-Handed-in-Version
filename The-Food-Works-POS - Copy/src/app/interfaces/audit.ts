
export interface Audit {
    userId: number;
    username: string;
    timeStamp: Date;
    controller: string;
    action: string;
    requestBody: string;
    queryString: string; //ERROR/NOTIFICATION
}
