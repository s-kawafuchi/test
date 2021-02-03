import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemService } from '../_services/item.service';

@Component({
  selector: 'app-shift-approval',
  templateUrl: './shift-approval.component.html',
  styleUrls: ['./shift-approval.component.css'],
})
export class ShiftApprovalComponent implements OnInit {
  form: FormGroup;
  result;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private itemService: ItemService
  ) {}

  get email() {
    return <FormControl>this.form.get('email');
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      // email: new FormControl("test@test.test", [Validators.email, Validators.required]),
      // password: new FormControl("1234", [Validators.required]),
      userid: new FormControl(''),
    });
  }

  reserach() {
    this.itemService.get_staff(this.form.value).subscribe(
      (data) => {
        this.result = data;
        this.router.navigate(['/book'], {
          queryParams: { id: this.result.id },
        });
        //this.shift=data;
      },
      (err) => {
        alert('errr');
      }
    );
  }
}
