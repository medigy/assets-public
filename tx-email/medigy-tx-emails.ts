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
          ? (supplier.heading || defaultSignature)
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

export const emailTemplates: EmailTemplate[] = [
  new CreatePasswordEmail(),
  new ResetPasswordEmail(),
  new MedigyClaimInviteEmail(),
];

if (import.meta.main) {
  for (const emailTmpl of emailTemplates) {
    await emailTmpl.write((name: string): void => {
      console.log(`Wrote ${name}`);
    });
  }
}
