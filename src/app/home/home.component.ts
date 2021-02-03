import { Component, OnInit } from '@angular/core';
import { ItemService } from '../_services/item.service';

interface Item {
  id: number,
  name: string,
  created: Date
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  items: Item[] = [];

  constructor(
    private itemService: ItemService,
  ) { }

  ngOnInit(): void {
    this.itemService.get_items().subscribe((items: Item[]) => {
      this.items = items;
    });
  }

}
