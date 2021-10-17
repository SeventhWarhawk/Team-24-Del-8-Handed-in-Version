import { TrainingService } from 'src/app/services/training/training.service';
import { Observable } from 'rxjs';
import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { finalize, last, tap, switchMap } from 'rxjs/operators';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';

@Component({
  selector: 'app-upload-task-training',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {

  @Input() file: File;

  task: AngularFireUploadTask;

  percentage: Observable<any>;
  snapshot: Observable<any>;
  downloadURL: any;

  urlString: string;
  urlArray: any = [];
  @Output() urlStringEvent = new EventEmitter<string>();

  constructor(private storage: AngularFireStorage, private db: AngularFirestore, private service: TrainingService) { }

  // Progress Bar Declerations
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  bufferValue = 75;

  ngOnInit(): void {
    this.startUpload();
  }

  startUpload() {
    // Storage Path
    const path = `training/${this.file.name?.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
    // Reference to storage bucket
    const ref = this.storage.ref(path);
    // Primary Task
    this.task = this.storage.upload(path, this.file);
    // Progress Monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(
      // Files download URL
      finalize(async() => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.db.collection('files').add({downloadURL: this.downloadURL, path});
      }),
    );
    // Assign URL's to Array
    this.task.snapshotChanges().pipe(
      last(),
      switchMap(() => ref.getDownloadURL())
    ).subscribe(url => {
      this.urlStringEvent.emit(url);
    })
  }

  isActive(snapshot: any) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }



}


