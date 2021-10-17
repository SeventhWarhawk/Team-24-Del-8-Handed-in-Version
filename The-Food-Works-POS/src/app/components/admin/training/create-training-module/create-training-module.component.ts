import { HttpErrorResponse } from '@angular/common/http';
import { TrainingService } from 'src/app/services/training/training.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddProductModalComponent } from 'src/app/components/modals/add-product-modal/add-product-modal.component';
import { take, map, catchError } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

// Import Interfaces
import { Module } from './../../../../interfaces/training';
import { EMPTY, forkJoin, from, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-training-module-stock',
  templateUrl: './create-training-module.component.html',
  styleUrls: ['./create-training-module.component.scss']
})
export class CreateTrainingModuleComponent implements OnInit {

  // Initalize Form Objects
  createForm: FormGroup;
  createArray: any = [];
  createContentForm: FormGroup;
  contentArray: any = [];
  moduleArray: any = [];

  // General Declerations
  isEditable = true;
  urlStringArray: any [] = [];
  urlString: any;
  flag: boolean;

  // Declared Arrays to Populate DropDowns
  moduleTypes: any = [];

  // Declare Display Variables
  videoEdit: boolean;
  textEdit: boolean;
  imageEdit: boolean;
  showContentOrder: boolean;
  loadingMode: any;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private _ngZone: NgZone,
    private trainingService: TrainingService,
    private _snackBar: MatSnackBar,
    private route: Router) { }

  // Define Content Order Selection Array
  content: any = [];

  // Define image file array
  files: any = [];
  filesUploaded: any = [];

  // Drag and Drop
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.content, event.previousIndex, event.currentIndex);
  }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  ngOnInit(): void {
    // Populate Module Type Drop Down
    this.trainingService.getAllTypes().subscribe(resp => {
      this.moduleTypes = resp;
    })

    // Initialize Create Form Group and Controls
    this.createForm = this.fb.group({
      // Module Name Input
      moduleName: ['', Validators.required],
      // Module Type Dropdown
      moduleType: ['', Validators.required],
      // Module Language Dropdown
      moduleLanguage: ['', Validators.required],
      // Module Duration Dropdown
      moduleDuration: ['', Validators.required],
      // Module Description Input
      moduleDescription: ['', Validators.required],
      // Content Checkbox Group
      checkboxGroup: new FormGroup({
        videoCheck: new FormControl(false),
        textCheck: new FormControl(false),
        imageCheck: new FormControl(false)
      }, requireCheckboxesToBeCheckedValidator()),
    });

    // Initialize Create Content Form Group and Controls
    this.createContentForm = this.fb.group({
      // Video URL Input
      videoLink: ['', Validators.required],
      // Text Content Input
      textContent: ['', Validators.required],
      // Image Content
      imageContent: [''],
      // Content Order
      contentOrder: ['']
    })
  }

  // Add images to array (After initial selection)
  onImageSelect(files: any = FileList) {
    this.files = [];
    for(let i = 0; i < files.length; i++) {
      this.files.push(files?.item(i));
    }
    console.log(this.files)
  }

  // Upload images on final publish
  uploadTrainingModule(selectedFiles: any = this.files) {
    // Perform Image Upload
    for (let i = 0; i < selectedFiles.length; i++) {
      this.filesUploaded.push(selectedFiles[i]);
    }
  }

  async getFlag(x: any): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, 15000);
    });
  }

  async createTrainingModule() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm New Module Creation',
        message: 'Are you sure you would like to confirm the creation of this module?'
      }
    });
    confirm.afterClosed().subscribe(resp => {
      if (resp) {
        this.loadingMode = 'query';
        this.uploadTrainingModule();
        this.getFlag(20).then(value => {
          // Send Form Data
          this.createArray = this.createForm.value;
          let order = this.content.join(',');
          this.createContentForm.get('contentOrder')?.patchValue(order);
          let urlString = this.urlStringArray.join(',')
          this.createContentForm.get('imageContent')?.patchValue(urlString);
          this.contentArray = this.createContentForm.value;
          this.moduleArray.push({
            ...this.createArray,
            ...this.contentArray
          })
          // Log and Send final "New Module" information
          const newModule = {
            name: this.createForm.get('moduleName')?.value,
            type: this.createForm.get('moduleType')?.value,
            language: this.createForm.get('moduleLanguage')?.value,
            duration: this.createForm.get('moduleDuration')?.value,
            description: this.createForm.get('moduleDescription')?.value,
            video: this.createContentForm.get('videoLink')?.value,
            text: this.createContentForm.get('textContent')?.value,
            image: this.createContentForm.get('imageContent')?.value,
            content: this.createContentForm.get('contentOrder')?.value,
          }

          console.log(this.createContentForm.get('videoLink')?.value)
          this.trainingService.createTrainingModule(newModule).subscribe(
            (resp: any) => {
              this.loadingMode = 'determinate';
              this.displaySuccessMessage("Successfully created new training module!");
              this.route.navigateByUrl('/admin-home/maintain-training-module');
            },
            (error: HttpErrorResponse) => {
              console.log('Branch Not Added');
              if (error.status === 404) {
                this.loadingMode = 'determinate';
                this.displayErrorMessage("Unable to create new training module!")
              }
              else if (error.status === 500 || error.status === 400) {
                this.loadingMode = 'determinate';
                this.displayErrorMessage("A training module with that name already exists!")
              }
            }
          );
        });
      }
    })
  }

  // Set Display Variables and Assign Content Array
  setDisplay() {
    this.videoEdit = (this.createForm.controls['checkboxGroup'] as FormGroup).controls['videoCheck'].value;
    this.textEdit = (this.createForm.controls['checkboxGroup'] as FormGroup).controls['textCheck'].value;
    this.imageEdit = (this.createForm.controls['checkboxGroup'] as FormGroup).controls['imageCheck'].value;

    // Set Video In List
    if(this.videoEdit)
    {
      for (var i = 0; i < this.content.length; i++)
      {
        if ( this.content[i] === "Video")
        {
          this.content.splice(i, 1);
        }
      }
      let video = "Video";
      this.content.push(video)
    }
    else
    {
      for (var i = 0; i < this.content.length; i++)
      {
        if ( this.content[i] === "Video")
        {
          this.content.splice(i, 1);
        }
      }
    }

    // Set Text In list
    if(this.textEdit)
    {
      for (var i = 0; i < this.content.length; i++)
      {
        if (this.content[i] === "Text")
        {
          this.content.splice(i, 1);
        }
      }
      let text = "Text";
      this.content.push(text)
    }
    else
    {
      for (var i = 0; i < this.content.length; i++)
      {
        if ( this.content[i] === "Text")
        {
          this.content.splice(i, 1);
        }
      }
    }

    // Set Image In List
    if(this.imageEdit)
    {
      for (var i = 0; i < this.content.length; i++)
      {
        if ( this.content[i] === "Image")
        {
          this.content.splice(i, 1);
        }
      }
      let image = "Image";
      this.content.push(image)
    }
    else
    {
      for (var i = 0; i < this.content.length; i++)
      {
        if ( this.content[i] === "Image")
        {
          this.content.splice(i, 1);
        }
      }
    }

    // Set Disabled Properties
    if(this.videoEdit && this.textEdit)
    {
      this.createContentForm.controls.videoLink.enable();
      this.createContentForm.controls.textContent.enable();
    }
    else if(this.videoEdit && this.textEdit == false)
    {
      this.createContentForm.controls.textContent.disable();
    }
    else if(this.textEdit && this.videoEdit == false)
    {
      this.createContentForm.controls.videoLink.disable();
    }
    else if(this.videoEdit && this.textEdit && this.imageEdit)
    {
      this.createContentForm.controls.videoLink.enable();
      this.createContentForm.controls.textContent.enable();
    }
    else if(this.videoEdit == false && this.textEdit == false && this.imageEdit)
    {
      this.createContentForm.controls.videoLink.disable();
      this.createContentForm.controls.textContent.disable();
    }

  }

  // Text area input
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  openDialog() {
    this.dialog.open(AddProductModalComponent);
  }

  receiveUrlString($event: any) {
    this.urlStringArray.push($event);
  }

  checker() {
    console.log(this.files);
    // let urlString = this.urlStringArray.join(',')
    console.log(this.urlStringArray);
    console.log(this.content);
    console.log(this.moduleArray);
  }

  displayErrorMessage(message: string) {
    this._snackBar.open(message, '', {
      duration: 6000,
      panelClass: ['error-snackbar']
    });
  }

  displaySuccessMessage(message: string) {
    this._snackBar.open(message, '', {
      duration: 6000,
      panelClass: ['success-snackbar']
    });
  }

}

// Validation to ensure that at least one check box is selected
function requireCheckboxesToBeCheckedValidator(minRequired = 1): Validators {
  return function validate (formGroup: FormGroup) {
    let checked = 0;

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];

      if (control.value === true) {
        checked ++;
      }
    });

    if (checked < minRequired) {
      return {
        requireCheckboxesToBeChecked: true,
      };
    }

    return null;
  };
}

