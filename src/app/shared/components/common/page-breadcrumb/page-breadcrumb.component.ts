import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-page-breadcrumb',
  imports: [],
  templateUrl: './page-breadcrumb.component.html',
  styleUrl: './page-breadcrumb.component.css',
})
export class PageBreadcrumbComponent {
  @Input() pageTitle = '';
}
