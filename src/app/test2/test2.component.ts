import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ItemService } from '../_services/item.service';
@Component({
  selector: 'app-test2',
  templateUrl: './test2.component.html',
  styleUrls: ['./test2.component.css'],
})
export class Test2Component implements OnInit {
  data;
  formGroup: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private itemservice: ItemService
  ) {
    this.formGroup = this.formBuilder.group({
      address: this.formBuilder.array([]),
    });
    this.formGroup.addControl('name', new FormControl('TEST'));
  }
  get addresses() {
    return this.formGroup.get('address') as FormArray;
  }
  ngOnInit(): void {
    this.itemservice.gettest().subscribe((data) => {
      this.data = data;
      this.data.map((test) => {
        this.addresses.push(
          this.formBuilder.group({
            address: new FormControl(test.year),
            post: new FormControl(test.data),
          })
        );
      });
    });

    console.log(this.addresses);
  }

  add(post) {
    console.log(this.formGroup.get('i') as FormArray);
  }
}
