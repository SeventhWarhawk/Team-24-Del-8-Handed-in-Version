using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace The_Food_Works_WebAPI.ViewModels
{
    public class TrainingVM
    {
        public int? ID { get; set; }
        public string Description { get; set; }

        public class TrainingModuleVM
        {
            public string moduleName { get; set; }
            public int moduleType { get; set; }
            public string moduleLanguage { get; set; }
            public string moduleDuration { get; set; }
            public string moduleDescription { get; set; }
            public string videoLink { get; set; }
            public string textContent { get; set; }
            public string imageContent { get; set; }
            public string contentOrder { get; set; }

        }
      
    }

    
}
