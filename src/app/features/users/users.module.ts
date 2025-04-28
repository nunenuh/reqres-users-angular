import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '../../core/core.module';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    CoreModule
  ],
  providers: [
    UserService
  ]
})
export class UsersModule { } 