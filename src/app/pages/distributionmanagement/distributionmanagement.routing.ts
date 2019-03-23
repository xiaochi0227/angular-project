import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DistributionmanagementComponent } from './distributionmanagement.component';
// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: DistributionmanagementComponent,
    children: [
       { path: 'distributioninfo', loadChildren: './distributioninfo/distributioninfo.module#DistributioninfoModule' },
       { path: 'deliveryeffic', loadChildren: './deliveryeffic/deliveryeffic.module#DeliveryefficModule' },

    ]
  }
];

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes)
    ],
    exports: [
      RouterModule
    ],
    declarations: [DistributionmanagementComponent]
  })
  export class DistributionmanagementRoutingModule { }
