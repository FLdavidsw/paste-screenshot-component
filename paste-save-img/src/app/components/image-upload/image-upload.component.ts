import { Component, ElementRef, ViewChild } from '@angular/core';
import { arrayBuffer } from 'stream/consumers';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.css'
})
export class ImageUploadComponent {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  imagePasted = false;
  imageSrc: string | ArrayBuffer | null = null;

  onPaste(event: any): void {
    const items = event.clipboardData?.items;
    if (items) {
      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {
                const context = this.canvas.nativeElement.getContext('2d');
                context?.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
                context?.drawImage(img, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
                this.imagePasted = true;
              };
              img.src = e.target?.result as string;
              //this.imageSrc = e.target?.result as string;
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    }
  }

  saveImage(): void {
    const canvas = this.canvas.nativeElement;
    //const image = canvas.toDataURL('image/png');
    this.imageSrc = canvas.toDataURL('image/png');
    console.log(this.imageSrc);
    this.downloadImage(this.imageSrc, 'pasted-image.png');
  }

  uploadImage() {

  }
  downloadImage(dataUrl: string, filename: string): void {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}
