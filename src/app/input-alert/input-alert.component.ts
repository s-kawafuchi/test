import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-alert',
  templateUrl: './input-alert.component.html',
  styleUrls: ['./input-alert.component.css']
})
export class InputAlertComponent implements OnInit {

  @Input() target: FormControl;

  constructor() { }

  ngOnInit(): void {
    console.log(this.target);

  }

}
