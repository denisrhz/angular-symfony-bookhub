import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BookService } from '../../services/book.service';
import { AuthorService } from '../../services/author.service';
import { Author } from '../../models/author.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, 
    MatInputModule, MatSelectModule, MatButtonModule, MatCardModule, RouterLink
  ],
  template: `
    <div class="page-wrapper">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Редактировать книгу' : 'Новая книга' }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="bookForm" (ngSubmit)="onSubmit()" class="form-container">
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Название</mat-label>
              <input matInput formControlName="title">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Описание</mat-label>
              <textarea matInput formControlName="description" rows="3"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Авторы</mat-label>
              <mat-select formControlName="authorIds" multiple>
                <mat-option *ngFor="let author of authors" [value]="author.id">
                  {{ author.name }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <div class="actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="bookForm.invalid">
                {{ isEditMode ? 'Сохранить' : 'Создать' }}
              </button>
              <button mat-button type="button" routerLink="/books">Отмена</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-wrapper { padding: 24px; max-width: 700px; margin: 0 auto; }
    .full-width { width: 100%; }
    .form-container { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
    .actions { display: flex; gap: 10px; }
  `]
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  authors: Author[] = [];
  isEditMode = false;
  bookId?: number;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private authorService: AuthorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      authorIds: [[], Validators.required]
    });
  }

  ngOnInit() {
    this.authorService.getAll().subscribe(list => this.authors = list);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.bookId = +id;
      this.bookService.getOne(this.bookId).subscribe(book => {
        const currentAuthorIds = book.authors.map(a => a.id);
        this.bookForm.patchValue({
          title: book.title,
          description: book.description,
          authorIds: currentAuthorIds
        });
      });
    }
  }

  onSubmit() {
    if (this.bookForm.invalid) return;
    
    const request = this.isEditMode 
      ? this.bookService.update(this.bookId!, this.bookForm.value)
      : this.bookService.create(this.bookForm.value);

    request.subscribe(() => {
      this.router.navigate(['/books']);
    });
  }
}