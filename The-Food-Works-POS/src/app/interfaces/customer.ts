export interface Customer {
    CustomerId: number;
    CustomerName: string;
    CustomerSurname: string;
    CustomerDob: Date;
    CustomerTelephone: string;
    CustomerEmail?: string;
    IsLoyaltyProgram: BinaryType;
}
