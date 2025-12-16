import { Component } from '@angular/core';
import {SidebarService} from '../../services/sidebar.service';
import {RouterOutlet} from '@angular/router';
import {AsyncPipe, NgClass} from '@angular/common';
import {AppSidebarComponent} from '../app-sidebar/app-sidebar.component';
import {BackdropComponent} from '../backdrop/backdrop.component';
import {AppHeaderComponent} from '../app-header/app-header.component';

@Component({
  selector: 'app-app-layout',
  imports: [
    RouterOutlet,
    NgClass,
    AsyncPipe,
    AppSidebarComponent,
    BackdropComponent,
    AppHeaderComponent
  ],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css',
})
export class AppLayoutComponent {
  readonly isExpanded$;
  readonly isHovered$;
  readonly isMobileOpen$;

  constructor(public sidebarService: SidebarService) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isHovered$ = this.sidebarService.isHovered$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  get containerClasses() {
    return [
      'flex-1',
      'transition-all',
      'duration-300',
      'ease-in-out',
      (this.isExpanded$ || this.isHovered$) ? 'xl:ml-[290px]' : 'xl:ml-[90px]',
      this.isMobileOpen$ ? 'ml-0' : ''
    ];
  }
}
