using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Data.SqlClient.Server;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using The_Food_Works_WebAPI.Models;
// using System.Windows.Forms;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using System.Configuration;
using Microsoft.AspNetCore.Http;
using The_Food_Works_WebAPI.ViewModels;

namespace The_Food_Works_WebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BackupController : Controller
    {
        // SqlConnection con = new SqlConnection("Server=.;Initial Catalog=The Food Works;Integrated Security=True");
        SqlConnection con = new SqlConnection("Server=tcp:tfwserver.database.windows.net,1433;Initial Catalog=tcp:tfwserver.database.windows.net,1433;Initial Catalog=The Food Works;Persist Security Info=False;User ID=tfwadmin;Password=tFW@dmin1786;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");
        [HttpPost]
        [Route("Backup")]
        public IActionResult Backup(BackupVM updateFile)
        {
            try
            {
                string filename = Path.GetFileName(updateFile.fileName);
                string fileExtension = Path.GetExtension(filename);

                string file = filename.Replace(fileExtension, "");//HttpContext.Request.Form.Files[0];
                string db = con.Database.ToString();
                //string cmd = "BACKUP DATABASE [" + db + "] TO DISK=C:" + "\\" + filename +""; //"\\" + "database" + "-" + DateTime.Now.ToString("yyyy-MM-dd--HH-mm-ss") + ".bak'";
                // C:\Program Files(x86)/Microsoft SQL Server/MSSQL12.MSSQLSERVER/MSSQL/Backup/"
                // string cmd = "BACKUP DATABASE[The Food Works] to Disk = 'C:\\Program Files (x86)\\Microsoft SQL Server\\MSSQL12.MSSQLSERVER\\MSSQL\\Backup\\" + filename + "';";
                string cmd = "BACKUP DATABASE[The Food Works] to Disk = 'C:\\Backups\\" + filename + "';";

                con.Open();
                SqlCommand command = new SqlCommand(cmd, con);
                command.ExecuteNonQuery();
                con.Close();
                return Ok();
            }
            catch(Exception e)
            {
                return BadRequest();
            }
             
        }

        [HttpPost]
        [Route("Restore")]
        public void Restore(string formData)
        {
            string db = con.Database.ToString();
            con.Open();
            try
            {
                string str1 = string.Format("ALTER DATABASE [" + db + "] SET SINGLE_USER WITH ROLLBACK IMMEDIATE");
                SqlCommand cmd1 = new SqlCommand(str1, con);
                cmd1.ExecuteNonQuery();
                string str2 = "USE MASTER RESTORE DATABASE [" + db + "] FROM DISK='" + formData + "' WITH REPLACE;";
                SqlCommand cmd2 = new SqlCommand(str2, con);
                cmd2.ExecuteNonQuery();

                string str3 = string.Format("ALTER DATABASE [" + db + "] SET MULTI_USER");
                SqlCommand cmd3 = new SqlCommand(str3, con);
                cmd3.ExecuteNonQuery();
            }
            catch
            {

            }
            
            con.Close();
        }
    }
}
