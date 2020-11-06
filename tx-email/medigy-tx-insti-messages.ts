import { govnTxtTmpl as gtt } from "./deps.ts";
import {
  anchorTip,
  callToActionButton,
  executeTemplate as layout,
  p,
  PersonalizedContent,
} from "./medigy-tx-email-layout.tmpl.ts";

export interface InstiContent {
  readonly userDisplayName: string;
  readonly institutionName: string;
  readonly instiURL: string;
}

export const [
  isValidPersonalizedInstiContent,
  onInvalidPersonalizedInstiContent,
] = gtt
  .contentGuard<InstiContent & PersonalizedContent>(
    "toFirstName",
    "userDisplayName",
    "institutionName",
    "instiURL",
  );

export const [
  isValidPersonalizedCreateInstiContent,
  onInvalidPersonalizedCreateInstiContent,
] = gtt
  .contentGuard<InstiContent & PersonalizedContent>(
    "toFirstName",
    "institutionName",
  );

export const [
  isValidPersonalizedClaimInstiInviteContent,
  onInvalidPersonalizedClaimInstiInviteContent,
] = gtt
  .contentGuard<InstiContent & PersonalizedContent>(
    "toFirstName",
    "institutionName",
    "userDisplayName",
  );

export function prepareCreateInstitutionEmailMessage(
  content: InstiContent & PersonalizedContent,
): string {
  return layout({
    heading: "Institution Created Successfully",
    body: `${p`Hi ${content.toFirstName}`}
      <p>
      You have successfully created the Institution ${content.institutionName}.
      </p>`,
  });
}

export function prepareClaimInstitutionInviteEmailMessage(
  content: InstiContent & PersonalizedContent,
): string {
  return layout({
    heading: "Institution Claim Request",
    body: `${p`Hi ${content.toFirstName}`}
    <p> ${content.userDisplayName} submitted a claim request for the ${content.institutionName} from Medigy. Please check and follow up the same.
    </p>`,
  });
}

export function prepareClaimInstitutionRequestEmailMessage(
  content: InstiContent & PersonalizedContent,
): string {
  return layout({
    heading: "Institution Claim Request Submitted",
    body: `${p`Hi ${content.toFirstName}`}
    <p>  Your request on ${content.institutionName} has been submitted successfully. Our curation team will check and get back to you on this.
    </p>`,
  });
}

export function prepareInstitutionInviteEmailMessage(
  content: InstiContent & PersonalizedContent,
): string {
  return layout({
    heading: "Institution Claim Request Submitted",
    body: `${p`Hi ${content.toFirstName}`}
    ${p
      `<p> ${content.userDisplayName} has invited you to the institution <b>${content.institutionName}</b> in Medigy. Please click the below button to register into Medigy and check out the project. <br/> If you are already a Medigy user please log in and continue.
    </p>
    </p>
    <p>
        
        Medigy highlights open source and commercially available digital health software which are targeting interoperability as a core capability. This is a perfect place for FHIR® enthusiasts to share and discover dozens of the latest interoperable healthcare solutions on one convenient platform.
    </p>`}
    ${callToActionButton("Accept Invitation", content.instiURL)}
    ${anchorTip(content.instiURL)}`,
  });
}
