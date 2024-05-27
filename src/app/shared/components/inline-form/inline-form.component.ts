import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { NgClass, NgIf } from "@angular/common";

@Component({
  selector: 'app-inline-form',
  standalone: true,
  imports: [NgClass, NgIf, ReactiveFormsModule],
  templateUrl: './inline-form.component.html',
  styleUrl: './inline-form.component.scss'
})
export class InlineFormComponent {
  @Input() title: string = '';
  @Input() defaultText: string = ''
  @Input() hasButton: boolean = false;
  @Input() buttonText: string = 'Submit';
  @Input() inputPlaceholder: string = '';
  @Input() inputType: string = 'input';

  @Output() handleSubmit = new EventEmitter<string>();

  private formBuilder = inject(FormBuilder);

  public isEditing: boolean = false;
  public form = this.formBuilder.group({
    title: [''],
  });

  public activateEditing(): void {
    if (this.title) {
      this.form.patchValue({title: this.title});
    }
    this.isEditing = true;
  }

  public onSubmit(): void {
    if (this.form.value.title) {
      this.handleSubmit.emit(this.form.value.title);
    }
    this.isEditing = false;
    this.form.reset();
  }
}
