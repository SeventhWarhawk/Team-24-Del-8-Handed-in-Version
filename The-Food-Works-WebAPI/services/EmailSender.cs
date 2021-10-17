using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace The_Food_Works_WebAPI.services
{
    public class EmailSender
    {
            public string SendGridKey = "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";
            public string SendGridUser = "TheFoodWorksAdmin";
   
        public Task SendEmailAsync(string email, string subject, string message)
        {
            return Execute(SendGridKey, subject, message, email);
        }

        public Task Execute(string apiKey, string subject, string message, string email)
        {
            var client = new SendGridClient(apiKey);
            var msg = new SendGridMessage()
            {
                From = new EmailAddress("u18061827@tuks.co.za", "TheFoodWorksAdmin"),// Options.SendGridUser,
                Subject = subject,
                PlainTextContent = message,
                HtmlContent = message
            };
            msg.AddTo(new EmailAddress(email));

            // Disable click tracking.
            // See https://sendgrid.com/docs/User_Guide/Settings/tracking.html
            msg.SetClickTracking(false, false);

            return client.SendEmailAsync(msg);
        }
    }
}

