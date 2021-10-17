import { HttpErrorResponse } from '@angular/common/http';
import { ModuleToUpdate } from './../../../../interfaces/training';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddProductModalComponent } from 'src/app/components/modals/add-product-modal/add-product-modal.component';
import { take } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TrainingService } from 'src/app/services/training/training.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmModalComponent } from 'src/app/components/modals/confirm-modal/confirm-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-training-module-stock',
  templateUrl: './update-training-module.component.html',
  styleUrls: ['./update-training-module.component.scss']
})
export class UpdateTrainingModuleComponent implements OnInit {

  // Declerations
  moduleTypes: any = [];
  module: ModuleToUpdate[];
  videoFlag: any;
  textFlag: any;
  ImageFlag: any;
  textContent: any;
  imageContent: string;
  createForm: FormGroup;
  createContentForm: FormGroup;
  isEditable = true;
  files: any = [];
  filesUploaded: any = [];
  imagePaths: any = [];
  path: any;
  imageContentArray: any = [];
  content: any = [];
  urlStringArray: any [] = [];
  loadingMode: any;
  loadedFlag: boolean;
  moduleName: any;
  imageFlag: boolean;
  originalImageContentArray: any = [];
  markedDirty: any;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private _ngZone: NgZone,
    private trainingService: TrainingService,
    private _Activatedroute: ActivatedRoute,
    private route: Router,
    private _snackBar: MatSnackBar,) { }

  // Fetch ID number from URL (Branch ID Number of branch selected)
  passedId = this._Activatedroute.snapshot.paramMap.get("id");

  // Drag and Drop
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.content, event.previousIndex, event.currentIndex);
  }

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  ngOnInit(): void {
    this.imageFlag = false;
    this.loadedFlag = false;
    this.loadingMode = true;
    this.markedDirty = false;
    // Populate Training Module Types DropDown List
    this.trainingService.getAllTypes().subscribe(resp => {
      this.moduleTypes = resp;
    })

    // Get Specific Training Module
    this.trainingService.getSpecificTrainingModule(this.passedId).subscribe((resp: any) => {
      console.log(resp);
      this.module = resp;
      this.moduleName = this.module[0].moduleName;
      // Set Content
      this.textContent = this.module[0].moduleContentText;
      this.imageContent = this.module[0].moduleContentImage;
      this.imageContentArray = this.imageContent.split(',');
      this.originalImageContentArray = this.imageContent.split(',');
      console.log(this.imageContentArray)

      // Set Content Flags
      if (this.module[0].moduleContentVideo == '') {
        this.videoFlag = false;
      } else {
        this.videoFlag = true;
      }

      if (this.module[0].moduleContentText == '') {
        this.textFlag = false;
      } else {
        this.textFlag = true;
      }

      if (this.module[0].moduleContentImage == '') {
        this.ImageFlag = false;
      } else {
        this.ImageFlag = true;
      }

      this.createForm = this.fb.group({
        moduleName: [this.module[0].moduleName, Validators.required],
        moduleType: [this.module[0].moduleTypeId, Validators.required],
        moduleDescription: [this.module[0].moduleDescription, Validators.required],
        moduleLanguage: [this.module[0].moduleLanguage, Validators.required],
        moduleDuration: [this.module[0].moduleDuration, Validators.required],
        // Content Checkbox Group
        checkboxGroup: new FormGroup({
          videoCheck: new FormControl(this.videoFlag),
          textCheck: new FormControl(this.textFlag),
          imageCheck: new FormControl(this.ImageFlag)
        }, requireCheckboxesToBeCheckedValidator()),
      });

      // Initialize Create Content Form Group and Controls
      this.createContentForm = this.fb.group({
        // Video URL Input
        videoLink: [this.module[0].moduleContentVideo, Validators.required],
        // Text Content Input
        textContent: [this.module[0].moduleContentText, Validators.required],
        // Image Content
        imageContent: [''],
        // Content Order
        contentOrder: ['']
      })
      this.loadedFlag = true;
      this.loadingMode = false;
      console.log(this.imageContentArray);
      if (this.imageContentArray[0] == '') {
        this.imageFlag = false;
      } else {
        this.imageFlag = true;
      }

    }, (error: any) => {
      console.log("Unable to fetch training module information!")
      this.loadingMode = false;
    })
  }

  // Add images to array (After initial selection)
  onImageSelect(files: any = FileList) {

    this.markedDirty = true;

    // Empty Arrays
    this.imagePaths = [];
    this.files = [];
    for(let i = 0; i < files.length; i++) {
      this.files.push(files?.item(i));
    }

    if (files) {
      for(let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePaths.push(e.target.result);
        }
        reader.readAsDataURL(file);
      }
    }
    console.log(this.imagePaths);
    this.imageContentArray = this.imagePaths;
    if (files.length == 0) {
      this.imageFlag = false;
    } else {
      this.imageFlag = true;
    }
  }

  // Upload images on final publish
  uploadTrainingModule(selectedFiles: any = this.files) {
    // Perform Image Upload
    for (let i = 0; i < selectedFiles.length; i++) {
      this.filesUploaded.push(selectedFiles[i]);
    }
  }

  // Set Timeout (Wait for image upload)
  async getFlag(x: any): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, 10000);
    });
  }

  // Concatenate URL String
  receiveUrlString($event: any) {
    this.urlStringArray.push($event);
  }

  // Update Training Module Call
  async updateTrainingModule() {
    const confirm = this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        heading: 'Confirm Module Updates',
        message: 'Are you sure you would like to save the updates made to this module?'
      }
    });
    confirm.afterClosed().subscribe(resp => {
      if (resp) {
        this.loadingMode = 'query';
        this.uploadTrainingModule();
        this.getFlag(20).then(value => {

          // Get New Order
          let contentOrder = this.content.join(',');
          // Get Image String
          let urlString = this.urlStringArray.join(',')

          const moduleToUpdate = {
            name: this.createForm.controls['moduleName'].value,
            type: this.createForm.controls['moduleType'].value,
            description: this.createForm.controls['moduleDescription'].value,
            language: this.createForm.controls['moduleLanguage'].value,
            duration: this.createForm.controls['moduleDuration'].value,
            video: this.createContentForm.controls['videoLink'].value,
            text: this.createContentForm.controls['textContent'].value,
            image: urlString,
            order: contentOrder,
          }

          this.trainingService.updateTrainingModule(this.passedId, moduleToUpdate).subscribe((resp: any) => {
            console.log("Training Module Updated Successfully");
            this.loadingMode = 'determinate';
            this.route.navigateByUrl('/admin-home/maintain-training-module');
          }, (error: HttpErrorResponse) => {
            if (error.status === 404) {
              this.displayErrorMessage("Unable to Update Module!")
            }
            else if (error.status === 500 || error.status === 400) {
              this.displayErrorMessage("A module with that name already exists!")
            } else {
              this.displayErrorMessage("An error occured on the server side!")
            }
            this.loadingMode = 'determinate';
          })
        });
      }
    });
  }

  // Set Display Variables and Assign Content Array
  setDisplay() {

    // Set Video In List
    if(this.videoFlag)
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
    if(this.textFlag)
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
    if(this.ImageFlag)
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

  }

  // Method to reset forms to initial values (Discard Changes On Click)
  resetFirstDefault() {
    this.createForm.patchValue({
      moduleName: this.module[0].moduleName,
      moduleType: this.module[0].moduleTypeId,
      moduleDescription: this.module[0].moduleDescription,
      moduleLanguage: this.module[0].moduleLanguage,
      moduleDuration: this.module[0].moduleDuration,
    })
    this.createForm.markAsPristine();
  }

  resetSecondDefault() {
    this.createContentForm.patchValue({
      videoLink: this.module[0].moduleContentVideo,
      textContent: this.module[0].moduleContentText,
    })
    this.imageContentArray = this.originalImageContentArray;
    this.createContentForm.markAsPristine();
    this.markedDirty = false;
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

  resetDefaults() {
    this.createContentForm.markAsUntouched();
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

