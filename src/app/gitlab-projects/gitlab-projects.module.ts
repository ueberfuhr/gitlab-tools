import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectProjectComponent } from './components/select-project/select-project.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';



@NgModule({
  declarations: [
    SelectProjectComponent
  ],
  exports: [
    SelectProjectComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class GitlabProjectsModule { }
