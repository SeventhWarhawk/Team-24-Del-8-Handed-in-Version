export interface ModuleType {
  ID: number;
  Description: string;
}

export interface Module {
  TrainingModuleId: number;
  ModuleName: string;
  ModuleType: number;
  ModuleLanguage: string;
  ModuleDuration: string;
  ModuleDescription: string;
  videoLink: string;
  textContent: string;
  imageContent: string;
  ContentOrder: string;
  TrainingModuleCompleted: boolean;
  TimeElapsed: number;
  DateCompleted: Date;
}

export interface Completed {
  TrainingModuleId: number;
  EmployeeId: number;
  TimeElapsed: any;
  EmployeeTrainingModuleStatus: boolean;
  DateCompleted: any;
}

export interface ModuleToUpdate {
  moduleId: number;
  moduleName: string;
  moduleTypeId: number;
  moduleTypeName: string;
  moduleLanguage: any;
  moduleDuration: any;
  moduleDescription: any;
  moduleContentVideo: any;
  moduleContentImage: any;
  moduleContentText: any;
}

export interface UpdatedModule {
  moduleName: any;
  moduleType: any;
  moduleLanguage: any;
  moduleDuration: any;
  moduleDescription: any;
  videoLink: any;
  textContent: any;
  imageContent: any;
  contentOrder: any;
}
