import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent implements OnInit {
  year = 2021;
  month = 2;

  calendar: {
    date: number;
    shift: 'work' | 'rest';
  }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // 2021年01月のカレンダーを表示
    // JavascriptのDateオブジェクトはコンストラクタの第二引数には0~11を渡す(1月であれば0)
    // 第三引数に0を渡すと、前月最終日となる。
    const month_first_date = new Date(this.year, this.month - 1, 1);
    const month_last_date = new Date(this.year, this.month - 1 + 1, 0);

    // 最初の日が何曜日か？
    // getDay()の戻り値は日曜日が0~土曜日が6
    const month_first_day = month_first_date.getDay();
    //
    for (let i = 0; i < month_first_day; i++) {
      this.calendar.push(null);
    }

    for (let date = 1; date <= month_last_date.getDate(); date++) {
      this.calendar.push({
        date,
        shift: 'work',
      });
    }

    console.log(this.calendar);
  }

  drag(event: DragEvent, type: 'work' | 'rest') {
    console.log(event);
    event.dataTransfer.setData('Type', type);
  }

  dragover(event: DragEvent) {
    // "dragover"イベントの伝播をキャンセルしないと"drop"イベントがおきない
    event.preventDefault();
  }
  drop(event: DragEvent, index: number) {
    let type: 'work' | 'rest' = event.dataTransfer.getData('Type') as any;
    this.calendar[index].shift = type;
  }

  submit() {
    this.http
      .post('http://localhost:3000/items/calender', {
        year: this.year,
        month: this.month,
        shift: this.calendar.filter((v) => v).map((v) => v.shift),
      })
      .subscribe((res) => {});
  }
}
