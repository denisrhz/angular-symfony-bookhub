import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthorService } from '../../services/author.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-author-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, RouterLink],
  template: `
    <div class="page-wrapper">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Редактировать' : 'Новый' }} автор</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="authorForm" (ngSubmit)="onSubmit()" class="author-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Имя автора</mat-label>
              <input matInput formControlName="name">
            </mat-form-field>

            <div class="actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="authorForm.invalid">
                {{ isEditMode ? 'Сохранить изменения' : 'Создать автора' }}
              </button>
              <button mat-button type="button" routerLink="/authors">Отмена</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`.page-wrapper { padding: 24px; max-width: 600px; margin: 0 auto; } .full-width { width: 100%; } .actions { display: flex; gap: 10px; margin-top: 15px; }`]
})
export class AuthorFormComponent implements OnInit {
  authorForm: FormGroup;
  isEditMode = false;
  authorId?: number;

  constructor(
    private fb: FormBuilder,
    private authorService: AuthorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.authorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.authorId = +id;
      this.authorService.getOne(this.authorId).subscribe(author => {
        this.authorForm.patchValue(author);
      });
    }
  }

  onSubmit() {
    if (this.authorForm.invalid) return;

    const request = this.isEditMode 
      ? this.authorService.update(this.authorId!, this.authorForm.value) 
      : this.authorService.create(this.authorForm.value);

    request.subscribe(() => {
      this.router.navigate(['/authors']);
    });
  }
}