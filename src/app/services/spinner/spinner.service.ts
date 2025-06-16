import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {

  
  private spinnerSubject = new BehaviorSubject<{
    show: boolean;
    message?: string;
  }>({ show: false });
  spinnerState = this.spinnerSubject.asObservable();

  private progressSubject = new BehaviorSubject<number>(0);
  progressState = this.progressSubject.asObservable();
  

  constructor() {}

  show(message: string = ''): void {
    this.spinnerSubject.next({ show: true, message });
  }

  hide(): void {
    this.spinnerSubject.next({ show: false });
  }

  showProgress(progress: number): void {
    this.progressSubject.next(progress);
  }

  resetProgress(): void {
    this.progressSubject.next(0); // O cualquier valor que consideres "inicial" o que indique "no visible"
}
  
}
