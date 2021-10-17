import { environment } from './../../../environments/environment';
import { Completed, Module, ModuleToUpdate, UpdatedModule } from './../../interfaces/training';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModuleType } from 'src/app/interfaces/training';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  moduleType: ModuleType;
  server = 'https://localhost:44325/';
  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    }),
    // withCredentials: true,
    // observe: 'response' as 'body',

  };

  curState = false;
  state: BehaviorSubject<boolean>

  constructor(private http: HttpClient) {
    this.state = new BehaviorSubject(this.curState);
  }

  getAllTypes(): Observable<ModuleType[]> {
    return this.http.get<ModuleType[]>(`${this.server}Training/getAllTypes`, this.httpOptions);
  }
  getTypeDetails(id: number): Observable<ModuleType> {
    const JSONObjectToSend = { 'ID': id };
    return this.http.post<ModuleType>(`${this.server}Training/getTypeDetails`, JSONObjectToSend, this.httpOptions);
  }
  updateType(type: any) {
    return this.http.post<any>(`${this.server}Training/updateType`, type, this.httpOptions);
  }
  addType(type: ModuleType) {
    console.log(type);
    return this.http.post<ModuleType>(`${this.server}Training/addType`, type, this.httpOptions);
  }
  deleteType(type: ModuleType) {
    return this.http.post<ModuleType>(`${this.server}Training/deleteType`, type, this.httpOptions);
  }
  deleteModule(type: number) {
    const JSONObjectToSend = { 'ID': type };
    return this.http.post(`${this.server}Training/deleteModule`, JSONObjectToSend, this.httpOptions);
  }

  // Connect to "CreateTrainingModule" endpoint
  // Adds a new training module to the system
  createTrainingModule(module: any) {
    console.log(module)
    const body: Module = {
      TrainingModuleId: 0,
      ModuleName: module.name,
      ModuleType: module.type,
      ModuleLanguage: module.language,
      ModuleDuration: module.duration,
      ModuleDescription: module.description,
      videoLink: module.video,
      textContent: module.text,
      imageContent: module.image,
      ContentOrder: module.content,
      TrainingModuleCompleted: false,
      TimeElapsed: 0,
      DateCompleted: new Date()
    }
    return this.http.post(`${this.server}Training/CreateTrainingModule`, body, this.httpOptions);
  }

  completeTrainingModule(completed: any) {
    console.log(completed)
    const body: Completed = {
      TrainingModuleId: completed.moduleId,
      EmployeeId: completed.employeeId,
      TimeElapsed: completed.time,
      EmployeeTrainingModuleStatus: true,
      DateCompleted: completed.date
    }
    return this.http.post(`${this.server}Training/CompleteTrainingModule`, body, this.httpOptions)
  }

  getTrainingModuleList(employeeId: any) {
    return this.http.get(`${this.server}Training/GetTrainingModuleList/` + employeeId, this.httpOptions);
  }

  getTrainingModule(moduleId: any, employeeId: any) {
    console.log(moduleId);
    console.log(employeeId);
    return this.http.get(`${this.server}Training/GetTrainingModule/` + moduleId + '/' + employeeId);
  }

  changeState(state: boolean) {
    this.state.next(state);
  }

  getAllTrainingModules() {
    return this.http.get(`${this.server}Training/GetTrainingModules`, this.httpOptions);
  }

  getSpecificTrainingModule(id: any) {
    return this.http.get(environment.baseURI + 'Training/GetSpecificTrainingModule/' + id, this.httpOptions);
  }

  updateTrainingModule( id: any, module: any) {
    const body: UpdatedModule = {
      moduleName: module.name,
      moduleType: module.type,
      moduleLanguage: module.language,
      moduleDuration: module.duration,
      moduleDescription: module.description,
      videoLink: module.video,
      textContent: module.text,
      imageContent: module.image,
      contentOrder: module.order,
    }
    return this.http.post(environment.baseURI + 'Training/UpdateTrainingModule/' + id, body, this.httpOptions);
  }
}
