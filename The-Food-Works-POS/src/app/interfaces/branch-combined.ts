import { BranchAddress } from 'src/app/interfaces/branch-address';
import { Branch } from 'src/app/interfaces/branch';

export interface BranchCombined {
  branch: Branch,
  address: BranchAddress
}
