import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-media-picker',
  imports: [],
  templateUrl: './media-picker.html',
  styleUrl: './media-picker.scss',
})
export class MediaPicker {
  // optional initial image (edit mode)
  @Input() initialImage: string | null = null;

  // output file to parent form
  @Output() fileChange = new EventEmitter<File | null>();

  preview = signal<string | null>(this.initialImage);

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      this.preview.set(reader.result as string);
    };

    reader.readAsDataURL(file);

    this.fileChange.emit(file);
  }

  removeImage() {
    this.preview.set(null);
    this.fileChange.emit(null);
  }
}
