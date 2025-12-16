import { Component } from '@angular/core';
import {SidebarService} from '../../services/sidebar.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-backdrop',
  imports: [
    AsyncPipe
  ],
  templateUrl: './backdrop.component.html',
  styleUrl: './backdrop.component.css',
})
export class BackdropComponent {
  readonly isMobileOpen$;

  constructor(private sidebarService: SidebarService) {
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  closeSidebar() {
    this.sidebarService.setMobileOpen(false);
  }
}
