using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using The_Food_Works_WebAPI.Models;
using The_Food_Works_WebAPI.services;

namespace The_Food_Works_WebAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // public string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddCors(o => o.AddPolicy("AllowAllOrigins", builder =>
            //{
            //    builder.AllowAnyMethod()
            //           .AllowAnyHeader()
            //           .SetIsOriginAllowed(origin => true)
            //           .AllowCredentials();
            //}));

            services.AddControllers().AddNewtonsoftJson(options =>
             options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
            services.AddDbContext<TheFoodWorksContext>(options =>
             options.UseSqlServer(Configuration.GetConnectionString("TheFoodWorksDB")));

            services.AddControllers();

            //ADD CORS
            string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
            services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                  builder =>
                                  {
                                      builder.WithOrigins("http://localhost:4200",
                                                          "https://localhost:4200",
                                                          "https://localhost:44325",
                                                          "https://localhost:8080",
                                                          "http://localhost");
                                      builder.AllowAnyHeader();
                                      builder.AllowAnyMethod();
                                      builder.AllowCredentials();
                                  });
            });

            //END ADD CORS

            //JWT authentication
            var key = "This is my test key";

            services.AddAuthentication(zz =>
            {
                zz.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                zz.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(zz =>
            {
                zz.RequireHttpsMetadata = false;
                zz.SaveToken = true;
                zz.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key)),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            services.AddSingleton<IJwtAuthenticationManager>(new JwtAuthenticationManager(key));

            services.AddDbContext<TheFoodWorksContext>(options =>
             options.UseSqlServer(Configuration.GetConnectionString("TheFoodWorksDB")));

            // Make sure you call this previous to AddMvc
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);
            services.AddScoped<AuditFilterAttribute>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            //app.UseCors("AllowAllOrigins");

            //ADD CORS
            app.UseCors("_myAllowSpecificOrigins");

            app.Use((context, next) =>

            {
                context.Request.EnableBuffering();

                return next();
            });

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}