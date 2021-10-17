import { Pipe, PipeTransform } from '@angular/core';
import { ViewedVoucher } from 'src/app/interfaces/loyalty';

@Pipe({
  name: 'voucherFilter'
})

export class VoucherFilterPipe implements PipeTransform {
  transform(vouchers: ViewedVoucher[], searchTerm: string): ViewedVoucher[] {
    if(!vouchers || !searchTerm) {
      return vouchers;
    }
    return vouchers.filter(voucher => voucher.voucherCode.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
  }
}
