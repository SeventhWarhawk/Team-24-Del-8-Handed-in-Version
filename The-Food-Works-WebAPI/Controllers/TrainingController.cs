using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;
using The_Food_Works_WebAPI.ViewModels;
using static The_Food_Works_WebAPI.ViewModels.TrainingVM;

namespace The_Food_Works_WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TrainingController : Controller
    {
        private TheFoodWorksContext db = new TheFoodWorksContext();

        [HttpGet]
        [Route("getAllTypes")]
        public List<dynamic> getAllTypes()
        {
            var types = db.TrainingModuleType.ToList();
            return getDynamicTypes(types);
        }
        public List<dynamic> getDynamicTypes(List<TrainingModuleType> types)
        {
            var dynamicUserRoles = new List<dynamic>();

            foreach (var userRole in types)
            {
                dynamic dynamicUserRole = new ExpandoObject();
                dynamicUserRole.ID = userRole.TrainingModuleTypeId;
                dynamicUserRole.Description = userRole.TrainingModuleTypeDescription;
                dynamicUserRoles.Add(dynamicUserRole);
            }

            return dynamicUserRoles;
        }

        [HttpPost]
        [Route("getTypeDetails")]
        public TrainingVM getTypeDetails(TrainingVM vm)
        {
            var role = db.TrainingModuleType.Where(x => x.TrainingModuleTypeId == vm.ID).FirstOrDefault();
            TrainingVM newType = new TrainingVM();
            newType.ID = role.TrainingModuleTypeId;
            newType.Description = role.TrainingModuleTypeDescription;
            return newType;
        }

        [HttpPost]
        [Route("updateType")]
        public ActionResult updateType(TrainingVM vm)
        {
            try
            {

                var typeToUpdate = db.TrainingModuleType.Where(x => x.TrainingModuleTypeId == vm.ID).FirstOrDefault();
                typeToUpdate.TrainingModuleTypeDescription = vm.Description;

                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("addType")]
        public ActionResult addType(TrainingVM type)
        {
            try
            {
                var id = db.TrainingModuleType.Select(x => x.TrainingModuleTypeId).Max();
                var newType = new TrainingModuleType
                {
                    TrainingModuleTypeId = id + 1,
                    TrainingModuleTypeDescription = type.Description
                };

                db.TrainingModuleType.Add(newType);
                db.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("deleteType")]
        public ActionResult deleteType(TrainingVM type)
        {
            try
            {
                var typeToUpdate = db.TrainingModuleType.Where(x => x.TrainingModuleTypeId == type.ID).FirstOrDefault();

                if (typeToUpdate.TrainingModule.Count == 0)
                {
                    db.TrainingModuleType.Remove(typeToUpdate);
                    db.SaveChanges();
                    return Ok();
                }
                else
                    return BadRequest();

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        //----------------DELETE MODULE-----------------------------------------------
        [Route("deleteModule")]
        public ActionResult deleteModule(TrainingVM type)
        {
            try
            {
                var mToUpdate = db.TrainingModule.Where(x => x.TrainingModuleId == type.ID).FirstOrDefault();
                var emplT = db.EmployeeTrainingModule.Where(x => x.TrainingModuleId == type.ID).FirstOrDefault();

                if (emplT == null || emplT.TrainingModule == null || mToUpdate.EmployeeTrainingModule.Count == 0)
                {
                    db.TrainingModule.Remove(mToUpdate);
                    db.SaveChanges();
                    return Ok();
                }
                else
                    return BadRequest();

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // Create New Training Module
        [HttpPost]
        [Route("CreateTrainingModule")]
        public ActionResult CreateTrainingModule([FromBody] TrainingModuleVM newModule)
        {
            List<TrainingModule> bs = new List<TrainingModule>();
            bs = db.TrainingModule.ToList();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                for (int i = 0; i < bs.Count; i++)
                {
                    if (newModule.moduleName == bs[i].ModuleName)
                    {
                        return BadRequest("A training module with this name already exists!");
                    }
                }

                using (var transSql = db.Database.BeginTransaction())
                {
                    var module = new TrainingModule
                    {
                        ModuleName = newModule.moduleName,
                        TrainingModuleTypeId = newModule.moduleType,
                        ModuleLanguage = newModule.moduleLanguage,
                        ModuleDuration = newModule.moduleDuration,
                        ModuleDescription = newModule.moduleDescription,
                        ModuleContentVideo = newModule.videoLink,
                        ModuleContentText = newModule.textContent,
                        ModuleContentImage = newModule.imageContent,
                        ContentOrder = newModule.contentOrder,
                    };
                    db.TrainingModule.Add(module);
                    db.SaveChanges();
                    transSql.Commit();
                    return Ok();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }

        // Get list of ALL Training Modules (For a specific employee)
        [HttpGet]
        [Route("GetTrainingModuleList/{employeeId}")]
        public List<dynamic> GetTrainingModuleList([FromRoute] int employeeId)
        {
            var modules = db.TrainingModule.Include(x => x.TrainingModuleType).Include(y => y.EmployeeTrainingModule.Where(z => z.EmployeeId == employeeId)).ToList();

            return GetDynamicModuleList(modules);
        }
        public List<dynamic> GetDynamicModuleList(List<TrainingModule> modules)
        {
            var dynamicTrainingModules = new List<dynamic>();

            foreach (var item in modules)
            {
                dynamic dynamicModules = new ExpandoObject();
                dynamicModules.TrainingModuleId = item.TrainingModuleId;
                dynamicModules.ModuleName = item.ModuleName;
                if (item.EmployeeTrainingModule.Select(x => x.EmployeeTrainingModuleStatus).FirstOrDefault() == true)
                {
                    dynamicModules.TrainingModuleCompleted = true;
                }
                else
                {
                    dynamicModules.TrainingModuleCompleted = false;
                }
                dynamicTrainingModules.Add(dynamicModules);

            }

            return dynamicTrainingModules;
        }

        // Get All Training Modules 
        [HttpGet]
        [Route("GetTrainingModules")]
        public List<TrainingModule> GetTrainingModules()
        {
            var modules = db.TrainingModule.Include(x => x.TrainingModuleType).ToList();
            return modules;
        }

        // Get specific training module (using ID)
        [HttpGet]
        [Route("GetTrainingModule/{moduleId}/{employeeId}")]
        public List<dynamic> GetTrainingModule([FromRoute] int moduleId, [FromRoute] int employeeId)
        {
            var module = db.TrainingModule.Include(x => x.TrainingModuleType).Include(y => y.EmployeeTrainingModule.Where(z => z.EmployeeId == employeeId)).Where(x => x.TrainingModuleId == moduleId).ToList();
            return GetDynamicTrainingModule(module);
        }
        public List<dynamic> GetDynamicTrainingModule(List<TrainingModule> module)
        {
            var dynamicTrainingModule = new List<dynamic>();
            foreach (var item in module)
            {
                dynamic dynamicModule = new ExpandoObject();
                dynamicModule.TrainingModuleId = item.TrainingModuleId;
                dynamicModule.ModuleName = item.ModuleName;
                dynamicModule.ModuleDescription = item.ModuleDescription;
                dynamicModule.ModuleLanguage = item.ModuleLanguage;
                dynamicModule.textContent = item.ModuleContentText;
                dynamicModule.videoLink = item.ModuleContentVideo;
                dynamicModule.imageContent = item.ModuleContentImage;
                dynamicModule.ModuleDuration = item.ModuleDuration;
                dynamicModule.ModuleType = item.TrainingModuleType.TrainingModuleTypeDescription;
                dynamicModule.ContentOrder = item.ContentOrder;
                if (item.EmployeeTrainingModule.Select(x => x.EmployeeTrainingModuleStatus).FirstOrDefault() == true)
                {
                    dynamicModule.TrainingModuleCompleted = true;
                    dynamicModule.DateCompleted = item.EmployeeTrainingModule.Select(x => x.DateCompleted).FirstOrDefault();
                    dynamicModule.TimeElapsed = item.EmployeeTrainingModule.Select(x => x.TimeElapsed).FirstOrDefault();
                }
                else
                {
                    dynamicModule.TrainingModuleCompleted = false;
                }
                dynamicTrainingModule.Add(dynamicModule);
            }
            return dynamicTrainingModule;
        }

        // Complete a Training Module (For a specific employee)
        [HttpPost]
        [Route("CompleteTrainingModule")]
        public ActionResult CompleteTrainingModule([FromBody] EmployeeTrainingVM newCompletedModule)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                using (var transSql = db.Database.BeginTransaction())
                {
                    var dateAndTime = DateTime.Now;

                    var completedModule = new EmployeeTrainingModule
                    {
                        TrainingModuleId = newCompletedModule.TrainingModuleId,
                        EmployeeId = newCompletedModule.EmployeeId,
                        TimeElapsed = newCompletedModule.TimeElapsed,
                        EmployeeTrainingModuleStatus = newCompletedModule.EmployeeTrainingModuleStatus,
                        DateCompleted = dateAndTime.Date
                    };
                    db.EmployeeTrainingModule.Add(completedModule);
                    db.SaveChanges();
                    transSql.Commit();
                    return Ok();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }

        // Get Training Module (For Viewing / Updating)
        [HttpGet]
        [Route("GetSpecificTrainingModule/{moduleId}")]
        public List<dynamic> GetSpecificTrainingModule([FromRoute] int moduleId)
        {
            var module = db.TrainingModule.Include(x => x.TrainingModuleType).Where(x => x.TrainingModuleId == moduleId).ToList();
            return GetDynamicSpecificTrainingModule(module);
        }
        public List<dynamic> GetDynamicSpecificTrainingModule(List<TrainingModule> module)
        {
            var dynamicTrainingModule = new List<dynamic>();
            foreach (var item in module)
            {
                dynamic dynamicModule = new ExpandoObject();
                dynamicModule.moduleId = item.TrainingModuleId;
                dynamicModule.moduleName = item.ModuleName;
                dynamicModule.moduleTypeId = item.TrainingModuleTypeId;
                dynamicModule.moduleTypeName = item.TrainingModuleType.TrainingModuleTypeDescription;
                dynamicModule.moduleLanguage = item.ModuleLanguage;
                dynamicModule.moduleDuration = item.ModuleDuration;
                dynamicModule.moduleDescription = item.ModuleDescription;
                dynamicModule.moduleContentVideo = item.ModuleContentVideo;
                dynamicModule.moduleContentImage = item.ModuleContentImage;
                dynamicModule.moduleContentText = item.ModuleContentText;
                dynamicTrainingModule.Add(dynamicModule);
            }
            return dynamicTrainingModule;
        }

        // Update Training Module
        [HttpPost]
        [Route("UpdateTrainingModule/{moduleId}")]
        public ActionResult UpdateBranch([FromBody] TrainingModuleVM updatedModule, [FromRoute] int moduleId)
        {
            List<TrainingModule> bs = new List<TrainingModule>();
            bs = db.TrainingModule.ToList();
            var existingModuleId = db.TrainingModule.Where(x => x.ModuleName == updatedModule.moduleName).Select(x => x.TrainingModuleId).FirstOrDefault();
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                for (int i = 0; i < bs.Count; i++)
                {
                    if (updatedModule.moduleName == bs[i].ModuleName && existingModuleId != moduleId)
                    {
                        return BadRequest("A training module with this name already exists!");
                    }
                }
                using (var transSQL = db.Database.BeginTransaction())
                {
                    var moduleToUpdate = db.TrainingModule.Where(x => x.TrainingModuleId == moduleId).FirstOrDefault();
                    moduleToUpdate.ModuleName = updatedModule.moduleName;
                    moduleToUpdate.ModuleDescription = updatedModule.moduleDescription;
                    moduleToUpdate.ModuleLanguage = updatedModule.moduleLanguage;
                    moduleToUpdate.ModuleContentText = updatedModule.textContent;
                    moduleToUpdate.ModuleContentVideo = updatedModule.videoLink;
                    moduleToUpdate.ModuleContentImage = updatedModule.imageContent;
                    moduleToUpdate.ModuleDuration = updatedModule.moduleDuration;
                    moduleToUpdate.TrainingModuleTypeId = updatedModule.moduleType;
                    moduleToUpdate.ContentOrder = updatedModule.contentOrder;               
                    db.SaveChanges();
                    transSQL.Commit();
                    return Ok();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.InnerException);
            }
        }
    }
}
