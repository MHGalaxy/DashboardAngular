import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

type AlertKind = 'success' | 'error' | 'warning' | 'info' | 'question';

@Injectable({ providedIn: 'root' })
export class AlertService {
  /** Base styling you can reuse everywhere (Tailwind-friendly) */
  private base(options?: SweetAlertOptions): SweetAlertOptions {
    return {
      heightAuto: false, // avoids weird jumps with some layouts
      buttonsStyling: false, // we will style with Tailwind classes
      confirmButtonText: 'OK',
      ...options,
      customClass: {
        popup: 'rounded-xl p-4',
        title: 'text-lg font-semibold',
        htmlContainer: 'text-sm text-gray-600 dark:text-gray-300',
        actions: 'gap-2',
        confirmButton:
          'inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700',
        cancelButton:
          'inline-flex items-center justify-center rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
        ...options?.customClass,
      },
    };
  }

  fire(kind: AlertKind, title: string, text?: string, options?: SweetAlertOptions) {
    return Swal.fire(
      this.base({
        icon: kind as SweetAlertIcon,
        title,
        text,
        ...options,
      })
    );
  }

  success(title: string, text?: string, options?: SweetAlertOptions) {
    return this.fire('success', title, text, options);
  }

  error(title: string, text?: string, options?: SweetAlertOptions) {
    return this.fire('error', title, text, options);
  }

  warning(title: string, text?: string, options?: SweetAlertOptions) {
    return this.fire('warning', title, text, options);
  }

  info(title: string, text?: string, options?: SweetAlertOptions) {
    return this.fire('info', title, text, options);
  }

  /** Common confirm dialog helper (useful for delete buttons later) */
  confirm(
    title: string,
    text?: string,
    opts?: {
      confirmText?: string;
      cancelText?: string;
      icon?: SweetAlertIcon;
    }
  ): Promise<SweetAlertResult> {
    return Swal.fire(
      this.base({
        icon: opts?.icon ?? 'question',
        title,
        text,
        showCancelButton: true,
        confirmButtonText: opts?.confirmText ?? 'Yes',
        cancelButtonText: opts?.cancelText ?? 'Cancel',
        reverseButtons: true,
      })
    );
  }
}
