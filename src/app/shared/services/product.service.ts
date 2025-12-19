import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ProductDto} from '../dtos/product.dto';
import {catchError, Observable, retry, throwError, timeout} from 'rxjs';

export interface ApiError {
  message: string;
  status?: number;
  url?: string;
  raw?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Put your API base URL in one place
  private readonly baseUrl = 'http://localhost:5118/api';

  constructor(private http: HttpClient) {}

  /**
   * Get all products
   */
  getAll(): Observable<ProductDto[]> {
    return this.http
      .get<ProductDto[]>(`${this.baseUrl}/Products`)
      .pipe(
        // avoid infinite hanging requests
        timeout(10_000),

        // retry transient errors (network hiccups)
        retry({ count: 1, delay: 500 }),

        // map errors into something your UI can show
        catchError((err) => this.handleHttpError(err))
      );
  }

  private handleHttpError(err: unknown) {
    // Angular HTTP errors come as HttpErrorResponse
    if (err instanceof HttpErrorResponse) {
      const apiError: ApiError = {
        status: err.status,
        url: err.url ?? undefined,
        raw: err,
        message: this.buildMessage(err),
      };
      return throwError(() => apiError);
    }

    // Non-HTTP error (unexpected)
    const apiError: ApiError = {
      message: 'Unexpected error occurred.',
      raw: err,
    };
    return throwError(() => apiError);
  }

  private buildMessage(err: HttpErrorResponse): string {
    // Network error (server down / CORS / offline)
    if (err.status === 0) {
      return 'Cannot reach the server. Check if the API is running and CORS is enabled.';
    }

    // Server returned an error response
    if (typeof err.error === 'string' && err.error.trim().length > 0) {
      return err.error; // sometimes APIs return plain text
    }

    // If API returns JSON { message: "..." }
    if (err.error && typeof err.error === 'object' && 'message' in err.error) {
      const msg = (err.error as any).message;
      if (typeof msg === 'string' && msg.trim().length > 0) return msg;
    }

    return `Request failed (HTTP ${err.status}).`;
  }
}
