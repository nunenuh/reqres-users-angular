import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService<T> {
  protected state = new BehaviorSubject<T[]>([]);
  state$ = this.state.asObservable();

  private currentPage = new BehaviorSubject<number>(1);
  currentPage$ = this.currentPage.asObservable();

  private totalPages = new BehaviorSubject<number>(0);
  totalPages$ = this.totalPages.asObservable();

  private perPage = new BehaviorSubject<number>(0);
  perPage$ = this.perPage.asObservable();

  private total = new BehaviorSubject<number>(0);
  total$ = this.total.asObservable();

  constructor() {}

  setState(items: T[]) {
    this.state.next(items);
  }

  addItem(item: T) {
    const currentState = this.state.value;
    this.state.next([...currentState, item]);
  }

  updateItem(id: number, updatedItem: T) {
    const currentState = this.state.value;
    const index = currentState.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      currentState[index] = { ...currentState[index], ...updatedItem };
      this.state.next([...currentState]);
    }
  }

  deleteItem(id: number) {
    const currentState = this.state.value;
    this.state.next(currentState.filter((item: any) => item.id !== id));
  }

  setCurrentPage(page: number) {
    this.currentPage.next(page);
  }

  setTotalPages(total: number) {
    this.totalPages.next(total);
  }

  setPerPage(perPage: number) {
    this.perPage.next(perPage);
  }

  setTotal(total: number) {
    this.total.next(total);
  }

  getCurrentPage(): number {
    return this.currentPage.value;
  }

  getTotalPages(): number {
    return this.totalPages.value;
  }

  getPerPage(): number {
    return this.perPage.value;
  }

  getTotal(): number {
    return this.total.value;
  }

  clear() {
    this.state.next([]);
    this.currentPage.next(1);
    this.totalPages.next(0);
    this.perPage.next(0);
    this.total.next(0);
  }
} 