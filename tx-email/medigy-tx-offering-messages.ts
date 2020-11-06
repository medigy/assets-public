import { govnTxtTmpl as gtt } from "./deps.ts";
import {
  executeTemplate as layout,
  p,
  PersonalizedContent,
} from "./medigy-tx-email-layout.tmpl.ts";

export interface OfferingContent {
  readonly offeringType: "product" | "service" | "solution" | "API";
  readonly offeringName: string;
  readonly createdDate: string;
  readonly currentDate: string;
  readonly submissionId: string;
  readonly offeringDetails: string;
  readonly offeringOwnerEmail: string;
}

export const [
  isValidPersonalizedOfferingContent,
  onInvalidPersonalizedOfferingContent,
] = gtt
  .contentGuard<OfferingContent & PersonalizedContent>(
    "toFirstName",
    "offeringType",
    "offeringName",
    "submissionId",
    "offeringDetails",
    "offeringOwnerEmail",
  );

export const [
  isValidPersonalizedOfferingApprovalContent,
  onInvalidPersonalizedOfferingApprovalContent,
] = gtt
  .contentGuard<OfferingContent & PersonalizedContent>(
    "toFirstName",
    "offeringType",
    "offeringName",
    "createdDate",
    "currentDate",
  );

export function prepareOfferingApproveEmailMessage(
  content: OfferingContent & PersonalizedContent,
): string {
  return layout({
    heading: `${p`Approved ${content.offeringType} ${content.offeringName}`}`,
    body: `${p`Hi ${content.toFirstName}`}
    <p>We are delighted to inform you that your ${content.offeringType} titled <b>${content.offeringName}</b>, which you submitted on <b>${content.createdDate}</b>, is approved by our expert panel of regulators/influencers today, <b>${content.currentDate}</b>.</p>
    </p>
    <p>
        Your offering is scheduled to publish between 9:30am and 11am USA East Coast time. Please check back to see.
    </p>
    <p>
        In the meantime, we encourage you to evaluate offerings from others.
    </p>
`,
  });
}

export function prepareOfferingCreateEmailMessage(
  content: OfferingContent & PersonalizedContent,
): string {
  return layout({
    heading: `${p
      `Created ${content.offeringType} ${content.offeringName} Successfully`}`,
    body: `${p`Hi ${content.toFirstName}`}
    <p>
        Thank you for submitting ${content.offeringType} <b>${content.offeringName}</b> (${content.submissionId}) in Medigy. Please find the details below.
    </p>
    <p>
    ${content.offeringDetails}

    </p>
    <p>
        Our expert panel will review <b>${content.offeringName}</b> and notify you at <b>${content.offeringOwnerEmail}</b> when it's been published on the site. If you have questions in the meantime, please contact us via e-mail or +1 202 660-1351. You can use Submission ID <b>${content.submissionId}</b> as reference.
    </p>
    <p>
        This e-mail was sent to you because you have an account at www.medigy.com with user ID ${content.offeringOwnerEmail}. If you did not submit ${content.offeringType} <b>${content.offeringName}</b> on the Netspective Medigy site, please contact our security team at security@medigy.com.
    </p>

`,
  });
}

export function prepareOfferingUpdateEmailMessage(
  content: OfferingContent & PersonalizedContent,
): string {
  return layout({
    heading: `${p
      `Updated ${content.offeringType} ${content.offeringName} Successfully`}`,
    body: `${p`Hi ${content.toFirstName}`}
    <p>
        Thank you for updating ${content.offeringType} <b>${content.offeringName}</b> (${content.submissionId}) in Medigy. Please find the details below.
    </p>
    <p>
    ${content.offeringDetails}

    </p>
    <p>
        Our expert panel will review <b>${content.offeringName}</b> and notify you at <b>${content.offeringOwnerEmail}</b> when it's been published on the site. If you have questions in the meantime, please contact us via e-mail or +1 202 660-1351. You can use Submission ID <b>${content.submissionId}</b> as reference.
    </p>
    <p>
        This e-mail was sent to you because you have an account at www.medigy.com with user ID ${content.offeringOwnerEmail}. If you did not submit ${content.offeringType} <b>${content.offeringName}</b> on the Netspective Medigy site, please contact our security team at security@medigy.com.
    </p>
`,
  });
}
