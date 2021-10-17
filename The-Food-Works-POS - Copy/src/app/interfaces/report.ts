
export interface Branch {
    BranchId: number;
    BranchName: string;
}

export interface StockReportParameters {
    BranchId: number;
    // Year?: number;
    startDate: number;
    endDate: number;
}

export interface SalesReportParameters {
    BranchId: number;
    endDate?: Date;
}

export interface DailySales {
    Month: string;
    Day: number;
    SaleTotal: number;
}

export interface AccumulatedSales {
    SaleTotal: number;
    Year: number;
    Month: number;
}

export interface CategorySalesVM {
    mainCount: number;
    sideCount: number;
    dessertCount: number;
    packageCount: number;
}
