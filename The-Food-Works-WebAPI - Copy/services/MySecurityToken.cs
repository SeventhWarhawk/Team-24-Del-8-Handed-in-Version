using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace The_Food_Works_WebAPI.services
{
    public class MySecurityToken
    {
        public static string GenerateToken(int userId, string[] userRoles)

        {

            var mySecret = "asdv234234^&%&^%&^hjsdfb2%%%";

            var mySecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(mySecret));



            var myIssuer = "http://mysite.com";

            var myAudience = "http://myaudience.com";



            var tokenHandler = new JwtSecurityTokenHandler();
            Claim[] claims = new Claim[userRoles.Count() + 1];
            for (int i = 0; i < userRoles.Count(); i++)
            {
                claims[i] = new Claim(ClaimTypes.Role, userRoles[i]);
            }
            claims[userRoles.Count()] = new Claim(ClaimTypes.NameIdentifier, userId.ToString());

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                    claims),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = myIssuer,
                Audience = myAudience,
                SigningCredentials = new SigningCredentials(mySecurityKey, SecurityAlgorithms.HmacSha256Signature)
            };




            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);

        }
        public static bool ValidateCurrentToken(string token, string roleName)
        {
            var mySecret = "asdv234234^&%&^%&^hjsdfb2%%%";
            var mySecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(mySecret));

            var myIssuer = "http://mysite.com";
            var myAudience = "http://myaudience.com";

            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken validatedToken;
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = myIssuer,
                    ValidAudience = myAudience,
                    IssuerSigningKey = mySecurityKey,
                    RoleClaimType = roleName
                }, out validatedToken);
            }
            catch(Exception e)
            {
                return false;
            }

            return ((System.IdentityModel.Tokens.Jwt.JwtSecurityToken)validatedToken).Claims.Any(c => c.Type == "role" && c.Value == roleName); ;
        }

        public static string GetClaim(string token, string claimName)
        {
            var mySecret = "asdv234234^&%&^%&^hjsdfb2%%%";
            var mySecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(mySecret));

            var myIssuer = "http://mysite.com";
            var myAudience = "http://myaudience.com";

            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken validatedToken;
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = myIssuer,
                    ValidAudience = myAudience,
                    IssuerSigningKey = mySecurityKey,
                    RoleClaimType = claimName
                }, out validatedToken);
            }
            catch
            {
                return "";
            }
            try
            {
                string ret = ((System.IdentityModel.Tokens.Jwt.JwtSecurityToken)validatedToken).Claims.Where(c => c.Type == claimName).FirstOrDefault().Value;
                return ret;
            }
            catch
            {
                return "";
            }
            //return ((System.IdentityModel.Tokens.Jwt.JwtSecurityToken)validatedToken).Claims.Any(c => c.Type == "role" && c.Value == roleName); ;
        }

    }
}