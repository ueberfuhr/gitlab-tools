import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProjectSelectorComponent} from './project-selector.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';



@NgModule({
  declarations: [
    ProjectSelectorComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ],
  exports: [
    ProjectSelectorComponent
  ]
})
export class ProjectSelectorModule { }
