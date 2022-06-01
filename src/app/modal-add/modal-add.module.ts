import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAddPageRoutingModule } from './modal-add-routing.module';

import { ModalAddPage } from './modal-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ModalAddPageRoutingModule
  ],
  declarations: [ModalAddPage]
})
export class ModalAddPageModule {}
