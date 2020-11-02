# Netspective Medigy Transactional (TX) E-mail Content

The Medigy TX E-mail system uses the [github.com/shah/ts-safe-template](https://github.com/shah/ts-safe-template) library to define transactional e-mail content in TypeScript code and generate all the `*.html` files as validated, type-safe, content.

# How to create an email template

1. See if the standard layout in [medigy-tx-emails-layout.html.ts](medigy-tx-emails-layout.html.ts) matches your layout requirement. Assuming, it does, go to the next step.
2. In [medigy-tx-emails.ts](medigy-tx-emails.ts) create a new class that implements the `EmailTemplate` interface. See `CreatePasswordEmail` and `ResetPasswordEmail` for examples. 
3. Add your new class to the `emailTemplates` const declaration.
4. Execute `deno-run medigy-tx-emails.ts`

You should see the following output:

```bash
❯ deno-run medigy-tx-emails.ts
Check file:///home/snshah/workspaces/git.netspective.io/netspective-medigy/next.medigy.com/src/tx-email/medigy-tx-emails.ts
Wrote Create Password Email Template.auto.html
Wrote Reset Password Email Template.auto.html
```

From the single `medigy-tx-emails.ts` all the different `*.auto.html` files will be generated using the layout defined at [medigy-tx-emails-layout.html.ts](medigy-tx-emails-layout.html.ts).

# How to send email from Medigy Middleware

This is sample code for how we send a email from GraphQL Middleware now. This one need to be removed once we are ready with new email template server we can remove this from code 

```
const transporter = nodemailer.createTransport({
	host: config.smtpHost,//'smtp.mailgun.org'
	port: config.smtpPort,//587
	secure: false, // true for 465, false for other ports
	auth: {
		user: config.smtpUserName, // generated ethereal user
		pass: config.smtpPassword // generated ethereal password
	}
});


var templateNames = 'medigyPostClaimSubmissionThankYou';
var mailTo = args.email.email;
var displayName = args.email.displayName;

var genericEmailTemplateProjectId =
  config.genericEmailTemplateProjectId;

var optionsThankYouEmail = {
  method: 'GET',
  uri: config.gitApiBaseUrl +
    '/api/v4/projects/' +
    genericEmailTemplateProjectId +
    '/repository/files/' +
    templateNames +
    '.html?ref=master',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'PRIVATE-TOKEN': config.adminToken,
  },
  json: true,
};
rp(optionsThankYouEmail).then(async function (emailTemplateRes) {
  if (emailTemplateRes.message) {
    if (emailTemplateRes.message != '404 Project Not Found') {
      resolve(
        'Unexpected error occured. Please contact administrator.'
      );
    }
  } else {
    mailBody = Buffer.from(emailTemplateRes.content, 'base64').toString(
      'ascii'
    );

    mailBody = mailBody.replace(/{{mailContent}}/g, table);
    mailBody = mailBody.replace(/{{offeringName}}/g, args.dataInput.offeringName);
    mailBody = mailBody.replace(/{{toName}}/g, displayName);
    const htmlToSend = mailBody;
    const subject =
      'Thank you for your post claim feedback for ' +
      args.dataInput.offeringName +
      ' in Medigy';

    // const mailTo = email;
    let info = await transporter.sendMail({
      from: config.mailFrom, // sender address
      to: mailTo, // list of receivers
      subject: subject, // Subject line
      html: htmlToSend, // html body
    });
    result.status = 'SUCCESS';
    result.message = 'Mail sent successfully.';
    resolve(result);
  }
});
```