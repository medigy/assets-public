import * as tmpl from "https://denopkg.com/shah/ts-safe-template@v0.1.0/mod.ts";
import stdEmailLayout from "./medigy-tx-emails-layout.html.ts";

export const p = tmpl.xmlTag("p");

export interface HeadingSupplier {
  readonly heading: string;
}

export interface SignatureSupplier {
  readonly signature: string;
}

export function emailMessage(
  supplier?: Partial<HeadingSupplier> & Partial<SignatureSupplier>,
): tmpl.TemplateLiteral {
  const defaultSignature = "Regards,<br> Medigy Team";
  return tmpl.governedTemplate(
    stdEmailLayout,
    tmpl.defaultGovernedTemplateOptions({
      bodyPlaceholderText: "<!-- BODY CONTENT GOES HERE -->",
      partials: [{
        placeholder: "<!-- HEADING PARTIAL CONTENT GOES HERE -->",
        content: supplier ? (supplier.heading || "") : "",
      }, {
        placeholder: "<!-- SIGNATURE PARTIAL CONTENT GOES HERE -->",
        content: supplier
          ? (supplier.signature || defaultSignature)
          : defaultSignature,
      }],
    }),
  );
}

export function anchorTip(href = "{{url}}"): string {
  return p
    `If you find any difficulty in clicking the above link, please copy and paste the below url into your browser.` +
    p`${href}`;
}

export function callToActionButton(text: string, href = "{{url}}"): string {
  return `
    <table style="width:200px;height:40px;">
      <tbody>
        <tr>
          <td style="background-color:#1a4e7a;height:30px;width:475px;text-align: center;vertical-align: middle;border-radius: 5px;">
              <a href="${href}"
                  style="color:#FFF;height:30px;width:200px;text-decoration:none !important; font-size:15px;text-decoration:none;">
                  ${text}
              </a>
          </td>
        </tr>
      </tbody>
    </table>`;
}

export interface EmailTemplate {
  readonly write: (report?: (name: string) => void) => Promise<void>;
}

export abstract class AbstractEmailTemplate implements EmailTemplate {
  readonly fileName: string;
  readonly layout: tmpl.TemplateLiteral;

  constructor(
    readonly name: string,
    layout?: tmpl.TemplateLiteral,
    fileName?: string,
  ) {
    this.layout = layout || emailMessage(this);
    this.fileName = fileName || `${name} Email Template.html`;
  }

  abstract get content(): string;

  get heading(): string {
    return this.name;
  }

  async write(report?: (name: string) => void): Promise<void> {
    Deno.writeTextFileSync(this.fileName, this.content);
    if (report) report(this.fileName);
  }
}

export abstract class PasswordEmail extends AbstractEmailTemplate {
  constructor(
    readonly name: string,
    readonly href = "{{url}}",
    layout?: tmpl.TemplateLiteral,
  ) {
    super(name, layout, `${name} Email Template.auto.html`);
  }
}

export class CreatePasswordEmail extends PasswordEmail {
  constructor(href = "{{url}}", layout?: tmpl.TemplateLiteral) {
    super("Create Password", href, layout);
  }

  get content(): string {
    return this.layout`
    <p>Hi,</p>

    Welcome to Medigy, please click below to create your password.

    ${callToActionButton("Create a new password", this.href)}
    ${anchorTip(this.href)}`;
  }
}

export class ResetPasswordEmail extends PasswordEmail {
  constructor(href = "{{url}}", layout?: tmpl.TemplateLiteral) {
    super("Reset Password", href, layout);
  }

  get content(): string {
    return this.layout`
      <p>Hi,</p>
  
      We're sorry you had trouble logging in, please tap below to reset your password.
  
      ${callToActionButton("Reset your password", this.href)}
      ${anchorTip(this.href)}`;
  }
}

export class MedigyClaimInviteEmail extends PasswordEmail {
  constructor(href = "{{url}}", layout?: tmpl.TemplateLiteral) {
    super("Medigy Claim Invite", href, layout);
  }

  get content(): string {
    return this.layout`
      <p>Hi {{toName}},</p>
      <p>{{user}} submitted a claim request for the {{product}} from Medigy. Please check and follow up the same.</p>`;
  }
}

export class MedigyClaimRequestConfirmation extends PasswordEmail {
  constructor(layout?: tmpl.TemplateLiteral) {
    super("Medigy Claim Request Confirmation", "", layout);
  }
  get content(): string {
    return this.layout`
    <p>
    Hi {{toName}},
    </p>
    <p>  Your request on {{product}} has been submitted successfully. Our curation team will check and get back to you on this.
    </p>
    `;
  }
}

export class MedigyCreateInstitution extends PasswordEmail {
  constructor(layout?: tmpl.TemplateLiteral) {
    super("Medigy Create Insitution", "", layout);
  }
  get content(): string {
    return this.layout`
    <p>
    Hi {{displayName}},
    </p>
    <p>
    You have successfully created the Institution {{institutionName}}.
    </p>
    `;
  }
}

export class MedigyNewSuggestion extends PasswordEmail {
  constructor(layout?: tmpl.TemplateLiteral) {
    super("Medigy New Suggestion", "", layout);
  }
  get content(): string {
    return this.layout`
    <p>
    Hi {{toName}},
    </p>
    <p> You have a new suggestion for {{type}} in Medigy. Please see the details below.
    </p>
    </p>
        {{mailContent}}
    <p>
        
        Medigy highlights open source and commercially available digital health software which are targeting interoperability as a core capability. This is a perfect place for FHIR® enthusiasts to share and discover dozens of the latest interoperable healthcare solutions on one convenient platform.
    </p>
    `;
  }
}

export class MedigyNewSuggestionThankYou extends PasswordEmail {
  constructor(layout?: tmpl.TemplateLiteral) {
    super("Thank You - Medigy New Suggestion", "", layout);
  }
  get content(): string {
    return this.layout`
    <p>
    Hi {{toName}},
    </p>
    <p> Thank you for the new suggestion for {{type}} in Medigy. Please find the details you submitted below.
    </p>
    </p>
        {{mailContent}}
    <p>
        
        Medigy highlights open source and commercially available digital health software which are targeting interoperability as a core capability. This is a perfect place for FHIR&#174; enthusiasts to share and discover dozens of the latest interoperable healthcare solutions on one convenient platform.
    </p>
    `;
  }
}

export class MedigyILMSuccess extends PasswordEmail {
  constructor(layout?: tmpl.TemplateLiteral) {
    super("Thank You - Medigy ILM Project", "", layout);
  }
  get content(): string {
    return this.layout`
    <p>
        Dear {{displayName}},
    </p>
    <p>
        Thank you for creating the Innovator Life cycle Managment Project {{ILMProjectName}} in Medigy.
        You can start to add Offerings,Services , News and events etc to this by clicking Add to ILM button in Medigy
       
    </p>
    `;
  }
}

export class MedigyInitiateClaimSuccess extends PasswordEmail {
  constructor(layout?: tmpl.TemplateLiteral) {
    super("Thank You - Medigy Claim", "", layout);
  }
  get content(): string {
    return this.layout`
    <p>
      Thanks for claiming your {{Offering Type}} {{offeringName}} !
    </p>
    <p>  We’ll let you know once it is published on Medigy. If you do not receive a response from us within 3 working days, please write to us at reply@mail.medigy.com.
    </p>
    `;
  }
}

export class MedigyInsitutionClaimInvite extends PasswordEmail {
  constructor(layout?: tmpl.TemplateLiteral) {
    super("Medigy Insitution Claim Invite", "", layout);
  }
  get content(): string {
    return this.layout`
    <p>
    Hi {{toName}},
    </p>
    <p> {{user}} submitted a claim request for the {{institutionName}} from Medigy. Please check and follow up the same.
    </p>
    `;
  }
}

export class MedigyInsitutionClaimRequestConfirmation extends PasswordEmail {
  constructor(layout?: tmpl.TemplateLiteral) {
    super("Medigy Insitution Claim Request Confirmation", "", layout);
  }
  get content(): string {
    return this.layout`
    <p>
    Hi {{toName}},
    </p>
    <p>  Your request on {{institutionName}} has been submitted successfully. Our curation team will check and get back to you on this.
    </p>
    `;
  }
}

export class MedigyInsitutionInvite extends PasswordEmail {
  constructor(href = "{{url}}", layout?: tmpl.TemplateLiteral) {
    super("Medigy Insitution Invite", href, layout);
  }
  get content(): string {
    return this.layout`
    <p>
    Hi {{toName}},
    </p>
    <p> {{fromName}} has invited you to the institution <b>{{institutionName}}</b> in Medigy. Please click the below button to register into Medigy and check out the project. <br/> If you are already a Medigy user please log in and continue.
    </p>
    </p>
    <p>
        
        Medigy highlights open source and commercially available digital health software which are targeting interoperability as a core capability. This is a perfect place for FHIR® enthusiasts to share and discover dozens of the latest interoperable healthcare solutions on one convenient platform.
    </p>
    ${callToActionButton("Accept Invitation", this.href)}
    ${anchorTip(this.href)}
    `;
  }
}

export class MedigyEvaluationFacetInvite extends PasswordEmail {
  constructor(href = "{{url}}", layout?: tmpl.TemplateLiteral) {
    super("Medigy Evaluation Facet Invite", href, layout);
  }
  get content(): string {
    return this.layout`
    <p>
    Hi {{ toName }},
    </p>
    <p> {{ fromName }} has invited you to complete the evaluation facet <b>{{ facetName }}</b> of the product <b>{{ productName }}</b> in Medigy. Please click the below button to register into Medigy and complete the facet. <br/> If you are already a Medigy user please log in and continue to save the facet.
    </p>
    </p>
    <p>
        
        Medigy highlights open source and commercially available digital health software which are targeting interoperability as a core capability. This is a perfect place for FHIR® enthusiasts to share and discover dozens of the latest interoperable healthcare solutions on one convenient platform.
    </p>
    ${callToActionButton("Accept Invitation", this.href)}
    ${anchorTip(this.href)}
    `;
  }
}

export class MedigyPostClaimFeedback extends PasswordEmail {
  constructor(layout?: tmpl.TemplateLiteral) {
    super("Medigy Post Claim Feedback", "", layout);
  }
  get content(): string {
    return this.layout`
    <p>
    Hi {{toName}},
    </p>
    <p> You have a new feedback from post claim submit in Medigy. Please see the details below.
    </p>
    </p>
        {{mailContent}}
    <p>
        
        Medigy highlights open source and commercially available digital health software which are targeting interoperability as a core capability. This is a perfect place for FHIR® enthusiasts to share and discover dozens of the latest interoperable healthcare solutions on one convenient platform.
    </p>
    `;
  }
}

export class MedigyPostClaimSubmissionThankYou extends PasswordEmail {
  constructor(layout?: tmpl.TemplateLiteral) {
    super("Thank You - Medigy Post Claim Submission", "", layout);
  }
  get content(): string {
    return this.layout`
    Hi {{toName}},
    </p>
    <p> Your information will help us provide you with the most relevant and useful content – thank you! If you ever have feedback about the site or ideas of what you would like to see, please email us at reply@mail.medigy.com. 
         </p>
        Please find below the details you submitted.
    </p>
    </p>
        {{mailContent}}
    <p>
        
        
    </p>
    `;
  }
}

export class MedigyProductSuccess extends PasswordEmail {
  constructor(layout?: tmpl.TemplateLiteral) {
    super("Thank You - Medigy Offering Submission", "", layout);
  }
  get content(): string {
    return this.layout`
    <p>
        Dear {{displayName}},
    </p>
    <p>
        Thank you for submitting {{offeringType}} <b>{{offeringName}}</b> ({{submissionId}}) in Medigy. Please find the details below.
    </p>
    <p>
        {{mailContent}}

    </p>
    <p>
        Our expert panel will review <b>{{offeringName}}</b> and notify you at <b>{{offeringOwnerEmail}}</b> when it's been published on the site. If you have questions in the meantime, please contact us via e-mail or +1 202 660-1351. You can use Submission ID <b>{{submissionId}}</b> as reference.
    </p>
    <p>
        This e-mail was sent to you because you have an account at www.medigy.com with user ID {{offeringOwnerEmail}}. If you did not submit {{offeringType}} <b>{{offeringName}}</b> on the Netspective Medigy site, please contact our security team at security@medigy.com.
    </p>
    `;
  }
}

export class MedigyProductUpdate extends PasswordEmail {
  constructor(layout?: tmpl.TemplateLiteral) {
    super("Thank You - Medigy Offering Update", "", layout);
  }
  get content(): string {
    return this.layout`
    <p>
        Dear {{displayName}},
    </p>
    <p>
        Thank you for updating {{offeringType}} <b>{{offeringName}}</b> ({{submissionId}}) in Medigy. Please find the details below.
    </p>
    <p>
        {{mailContent}}

    </p>
    <p>
        Our expert panel will review <b>{{offeringName}}</b> and notify you at <b>{{offeringOwnerEmail}}</b> when it's been published on the site. If you have questions in the meantime, please contact us via e-mail or +1 202 660-1351. You can use Submission ID <b>{{submissionId}}</b> as reference.
    </p>
    <p>
        This e-mail was sent to you because you have an account at www.medigy.com with user ID {{offeringOwnerEmail}}. If you did not submit {{offeringType}} <b>{{offeringName}}</b> on the Netspective Medigy site, please contact our security team at security@medigy.com.
    </p>

    `;
  }
}

export class MedigyProductApprove extends PasswordEmail {
  constructor(layout?: tmpl.TemplateLiteral) {
    super("Medigy Offering Approved", "", layout);
  }
  get content(): string {
    return this.layout`
    <p>
    <p>Hi {{user}} </p><p>We are delighted to inform you that your {{offeringType}} titled <b>{{offeringName}}</b>, which you submitted on <b>{{createdDate}}</b>, is approved by our expert panel of regulators/influencers today, <b>{{currentDate}}</b>.</p>
    </p>
    <p>
        Your offering is scheduled to publish between 9:30am and 11am USA East Coast time. Please check back to see.
    </p>
    <p>
        In the meantime, we encourage you to evaluate offerings from others.
    </p>

    `;
  }
}

export class MedigyProjectInvite extends PasswordEmail {
  constructor(href = "{{url}}", layout?: tmpl.TemplateLiteral) {
    super("Medigy Project Invite", href, layout);
  }
  get content(): string {
    return this.layout`
    <p>
    Hi {{ toName }},
    </p>
    <p> {{ fromName }} has invited you to the project <b>{{ projectName }}</b> in Medigy. Please click the below button to register into Medigy and check out the project. <br/> If you are already a Medigy user please log in and continue.
    </p>
    </p>
    <p>
        
        Medigy highlights open source and commercially available digital health software which are targeting interoperability as a core capability. This is a perfect place for FHIR® enthusiasts to share and discover dozens of the latest interoperable healthcare solutions on one convenient platform.
    </p>
    ${callToActionButton("Accept Invitation", this.href)}
    ${anchorTip(this.href)}
    `;
  }
}

export class MedigyTopicInvite extends PasswordEmail {
  constructor(href = "{{url}}", layout?: tmpl.TemplateLiteral) {
    super("Medigy Topic Invite", href, layout);
  }
  get content(): string {
    return this.layout`
    <p>
    Hi {{toName}},
    </p>
    <p> {{fromName}} has invited you to the topic <b>{{topicName}}</b> in Medigy. Please click the below button to register into Medigy and check out the project. <br/> If you are already a Medigy user please log in and continue.
    </p>
    <p>
        
        Medigy highlights open source and commercially available digital health software which are targeting interoperability as a core capability. This is a perfect place for FHIR® enthusiasts to share and discover dozens of the latest interoperable healthcare solutions on one convenient platform.
    </p>
    ${callToActionButton("Accept Invitation", this.href)}
    ${anchorTip(this.href)}
    `;
  }
}

export class MedigyFeedback extends PasswordEmail {
  constructor(layout?: tmpl.TemplateLiteral) {
    super("Thank You - Medigy Feedback", "", layout);
  }
  get content(): string {
    return this.layout`
    <p>Dear {{ userName }},</p>
    <p>
        We greatly appreciate the time you've taken to share your feedback with us . We will go over this in detail and get back. Thank you very much.
        We will revert you back regarding this soon.
    </p>

    `;
  }
}

export class MedigyFeedbackAlert extends PasswordEmail {
  constructor(layout?: tmpl.TemplateLiteral) {
    super("Medigy Feedback Alert", "", layout);
  }
  get content(): string {
    return this.layout`    
    <p>Hi,</p>
    <p>
        A feedback has been submitted from the  {{ userName }} . Please check this and process this feed back in Netspective Feedbacks 
    </p>

    `;
  }
}

export class MedigyResetPasswordSuccess extends PasswordEmail {
  constructor(layout?: tmpl.TemplateLiteral) {
    super("Medigy Reset Password Success", "", layout);
  }
  get content(): string {
    return this.layout`    
    <p>Hi,</p>
    <p>
        A feedback has been submitted from the  {{ userName }} . Please check this and process this feed back in Netspective Feedbacks 
    </p>

    `;
  }
}

export class MedigyUserSignUp extends PasswordEmail {
  constructor(href = "{{url}}", layout?: tmpl.TemplateLiteral) {
    super("Medigy User Signup", href, layout);
  }
  get content(): string {
    return this.layout`
    <p>You have successfully <b>created an account</b> in Medigy.</p>
    
        Click below to create your login password.

    </p>
    <p>
    ${callToActionButton("Create Password", this.href)}
    ${anchorTip(this.href)}
    `;
  }
}

export const emailTemplates: EmailTemplate[] = [
  new CreatePasswordEmail(),
  new ResetPasswordEmail(),
  new MedigyClaimInviteEmail(),
  new MedigyClaimRequestConfirmation(),
  new MedigyCreateInstitution(),
  new MedigyNewSuggestion(),
  new MedigyNewSuggestionThankYou(),
  new MedigyILMSuccess(),
  new MedigyInitiateClaimSuccess(),
  new MedigyInsitutionClaimInvite(),
  new MedigyInsitutionClaimRequestConfirmation(),
  new MedigyInsitutionInvite(),
  new MedigyEvaluationFacetInvite(),
  new MedigyPostClaimFeedback(),
  new MedigyPostClaimSubmissionThankYou(),
  new MedigyProductSuccess(),
  new MedigyProductUpdate(),
  new MedigyProductApprove(),
  new MedigyProjectInvite(),
  new MedigyTopicInvite(),
  new MedigyFeedback(),
  new MedigyFeedbackAlert(),
  new MedigyResetPasswordSuccess(),
  new MedigyUserSignUp(),
];

if (import.meta.main) {
  for (const emailTmpl of emailTemplates) {
    await emailTmpl.write((name: string): void => {
      console.log(`Wrote ${name}`);
    });
  }
}
