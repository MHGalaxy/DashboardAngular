import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ProductDto} from '../dtos/product/product.dto';
import {catchError, Observable, retry, throwError, timeout} from 'rxjs';
import {CreateProductDto} from '../dtos/product/create-product.dto';
import {UpdateProductDto} from '../dtos/product/update-product.dto';

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

  /**
   * Get product by id
   */
  getById(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.baseUrl}/Products/${id}`).pipe(
      timeout(10_000),
      retry({ count: 1, delay: 300 }),
      catchError((err) => this.handleHttpError(err))
    );
  }

  /**
   * Insert a product
   */
  create(payload: CreateProductDto): Observable<ProductDto> {
    return this.http.post<ProductDto>(`${this.baseUrl}/Products`, payload).pipe(
      timeout(10_000),
      retry({ count: 0 }), // usually you DON'T want retry on create
      catchError((e) => this.handleHttpError(e))
    );
  }

  /**
   * Update product by id
   */
  update(id: number, payload: UpdateProductDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/Products/${id}`, payload).pipe(
      timeout(10_000),
      retry({ count: 0 }), // DON'T retry updates by default
      catchError((e) => this.handleHttpError(e))
    );
  }

  /**
   * Delete product by id
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/Products/${id}`).pipe(
      timeout(10_000),
      retry({ count: 0 }), // don't retry deletes
      catchError((e) => this.handleHttpError(e))
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
