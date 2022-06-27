import {Pipe, PipeTransform} from '@angular/core';
import {GitlabLabel} from '../models/gitlab-label.model';

@Pipe({
  name: 'labelsByName'
})
export class LabelsByNamePipe implements PipeTransform {

  transform(names: string[], labels?: GitlabLabel[]): GitlabLabel[] {
    return labels ? labels.filter(label => names.indexOf(label.name) >= 0) : [];
  }

}
