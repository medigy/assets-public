# Netspective Medigy Transactional (TX) E-mail Content

The Medigy TX E-mail system uses the [github.com/gov-suite/governed-text-template](github.com/gov-suite/governed-text-template) library to define transactional e-mail content in TypeScript code and generate all the `*.html` files as validated, type-safe, content.

# How to create an email template

1. See if the standard layout in [medigy-tx-email-layout.tmpl.ts](medigy-tx-email-layout.tmpl.ts) matches your layout requirement. Assuming, it does, go to the next step.
2. In [medigy-tx-authn-messages.ts](medigy-tx-authn-messages.ts) or [medigy-tx-claim-messages.ts](medigy-tx-claim-messages.ts) (or a new TypeScript file if you have a new type of message that doesn't fit into those categories) create a new function that accepts a single parameter with the template's placeholder variables. See `prepareCreatePasswordEmailMessage` and `prepareResetPasswordEmailMessage` in [medigy-tx-authn-messages.ts](medigy-tx-authn-messages.ts) for examples.
3. In [medigy-tx-email-messages.tmpl.ts](medigy-tx-email-messages.tmpl.ts) "register" those functions in `templateIdentities` and `contentGuards` like the other methods.
4. In [medigy-tx-email-messages.tmpl.ts](medigy-tx-email-messages.tmpl.ts) add your new function created in step 2 to body of the `executeTemplate` function.

# How to generate an email message via HTTP Service

Run:

```bash
deno-run https://denopkg.com/gov-suite/governed-text-template@v0.1.5/toctl.ts server --verbose --module=file://`pwd`/medigy-tx-email-messages.tmpl.ts,medigy-email
```

You should see the following output:

```bash
Template Orchestration service running at http://localhost:8163
Pre-defined template modules:
{ "medigy-email": "./medigy-tx-email-messages.tmpl.ts" }
```

Now you can open a browser and run:

```
http://localhost:8163/transform/medigy-email/create-password?authnURL=testURL
http://localhost:8163/transform/medigy-email/reset-password?authnURL=testURL
http://localhost:8163/transform/medigy-email/claim-invite?toFirstName=toFN&claimURL=claimUrl&claimantFirstName=Claimant&offeringName=Offering&offeringType=product
```

You'll see the full email in an HTML Preview - if you need to save the output, just use `cURL` or `wget`.

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