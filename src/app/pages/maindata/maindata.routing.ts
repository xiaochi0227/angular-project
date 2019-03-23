import { MaindataComponent } from './maindata.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    component: MaindataComponent,
    children: [
      { path: 'ListStores', loadChildren: './liststores//liststores.module#ListstoresModule' },
      { path: 'editliststores', loadChildren: './liststores/editliststores.module#EditliststoresModule' },
      { path: 'addstores', loadChildren: './liststores/addstores.module#AddstoresModule' },
      { path: 'OnlineCategory', loadChildren: './onlinecategory/onlinecategory.module#OnlineCategoryModule' },
      { path: 'storeonoffrates', loadChildren: './storeonoffrates/storeonoffrates.module#StoreonoffratesModule' },
      { path: 'storeonoffrate', loadChildren: './storeonoffrate/storeonoffrate.module#StoreonoffrateModule' },
    
      //   { path: 'StoreInventory', component: StoreInventory },
      //   { path: 'editliststores', component: EditListStores },
      //   { path: 'addstores', component: AddStores },
      //   { path: 'Category', component: Category },
      //   { path: 'OnlineCategory', component: OnlineCategory },
      //  { path: 'Brand', component: Brand },
       { path: 'freshinventory', loadChildren: './freshinventory/freshinventory.module#FreshinventoryModule' },
      //  { path: 'storeonoffrate', component: Storeonoffrate },
       { path: 'StoreInventory', loadChildren: './storeinventory/storeinventory.module#StoreinventoryModule' },
       { path: 'willsellventory', loadChildren: './willsellventory/willsellventory.module#WillsellventoryModule' }
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
  declarations: [MaindataComponent]
})
export class MaindataRoutingModule { }


