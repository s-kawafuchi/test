import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ItemService } from '../_services/item.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css'],
})
export class ReserveComponent implements OnInit {
  shift;
  selected: {
    staffid: number;
    year: number;
    month: number;
    times: string;
    data: number;
  };
  test;
  constructor(private itemservice: ItemService, private router: Router) {}

  ngOnInit(): void {
    forkJoin([
      this.itemservice.getreserve(),
      this.itemservice.getcalender(),
    ]).subscribe((reses: [any[], any[]]) => {
      const reserves = reses[0];
      const calenders = reses[1];
      const times = ['09:00', '09:30', '10:00', '10:30'];
      reserves.map((reserve) => {
        const hoge = [];
        // 今、回しているreserve(シフト)と同じ日のcalender(予約)を絞り込む
        const piyo = calenders.filter((calender) => {
          return (
            reserve.year === calender.year &&
            reserve.month === calender.month &&
            reserve.data === calender.data
          );
        });
        for (let time of times) {
          const exist_reserve = piyo.find((calender) => time === calender.time);
          console.log('test', exist_reserve);
          hoge.push({
            time,
            is_check: false,
            is_open: !exist_reserve,
            check: exist_reserve,
          });
        }
        reserve.times = hoge;
      });
      this.shift = reserves;
    });
  }

  add() {
    const te = this.selected;
    this.router.navigate(['/reservecomfirm'], {
      queryParams: {
        year: te.year,
        data: te.data,
        month: te.month,
        staffId: te.staffid,
        time: te.times,
      },
    });
  }
}
