import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ItemService } from '../_services/item.service';

@Component({
  selector: 'app-reserve-comfirm',
  templateUrl: './reserve-comfirm.component.html',
  styleUrls: ['./reserve-comfirm.component.css'],
})
export class ReserveComfirmComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private itemservice: ItemService,
    private router: Router
  ) {}
  shift;
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const test = params['year'];
      const month = params['month'];
      const data = params['data'];
      const staffId = params['staffId'];
      const time = params['time'];

      this.shift = { test, month, data, staffId, time };
      console.log(this.shift);
    });
  }

  add() {
    this.itemservice
      .addreserve({
        year: this.shift.test,
        data: this.shift.data,
        month: this.shift.month,
        staffid: this.shift.staffId,
        time: this.shift.time,
      })
      .subscribe((data) => {
        alert('予約が完了しました');
        this.router.navigate(['/reserve']);
      });
  }
}
