import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from '../_services/item.service';

@Component({
  selector: 'app-bookcus',
  templateUrl: './bookcus.component.html',
  styleUrls: ['./bookcus.component.css'],
})
export class BookcusComponent implements OnInit {
  order;
  shift;
  constructor(
    private route: ActivatedRoute,
    private itemservivce: ItemService
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      console.log(params);
      this.order = params.get('id');
      this.itemservivce.shiftreserch(params).subscribe((data) => {
        this.shift = data;
      });
    });
  }
}
