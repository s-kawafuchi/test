import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const API_HOST = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private http: HttpClient) {}

  get_items() {
    return this.http.get(`${API_HOST}/items`);
  }
  get_staff(Data: any) {
    return this.http.post(`${API_HOST}/items/approval`, Data);
  }
  getreserve() {
    return this.http.get(`${API_HOST}/items/reserve`);
  }
  getcalender() {
    return this.http.get(`${API_HOST}/items/getreserve`);
  }
  addreserve(Data: any) {
    return this.http.post(`${API_HOST}/items/add`, Data);
  }
  shiftreserch(Data: any) {
    return this.http.post(`${API_HOST}/items/staffshift`, Data);
  }
  gettest() {
    return this.http.get(`${API_HOST}/getreserve`);
  }
}
