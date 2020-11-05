import { govnTxtTmpl as gtt } from "./deps.ts";
import {
  anchorTip,
  callToActionButton,
  executeTemplate as layout,
  p,
  PersonalizedContent,
} from "./medigy-tx-email-layout.tmpl.ts";

export interface InviteContent {
  readonly fromFirstName: string;
  readonly inviteURL: string;
  readonly invitePropertyName: string;
  readonly offeringName: string;
}

export const [
  isValidPersonalizedInviteContent,
  onInvalidPersonalizedInviteContent,
] = gtt
  .contentGuard<InviteContent & PersonalizedContent>(
    "toFirstName",
    "fromFirstName",
    "inviteURL",
    "invitePropertyName",
    "offeringName",
  );

export function prepareEvaluationFacetInviteEmailMessage(
  content: InviteContent & PersonalizedContent,
): string {
  return layout({
    heading: `${p
      `Checkout the Evaluation Facet -  ${content.invitePropertyName}`}`,
    body: `${p`Hi ${content.toFirstName}`}
    ${p
      `<p> ${content.fromFirstName} has invited you to complete the evaluation facet <b>${content.invitePropertyName}</b> of the product <b>${content.offeringName}</b> in Medigy. Please click the below button to register into Medigy and complete the facet. <br/> If you are already a Medigy user please log in and continue to save the facet.
      </p>
      </p>
      <p>
          
          Medigy highlights open source and commercially available digital health software which are targeting interoperability as a core capability. This is a perfect place for FHIR® enthusiasts to share and discover dozens of the latest interoperable healthcare solutions on one convenient platform.
      </p>`}
    ${callToActionButton("Accept Invitation", content.inviteURL)}
    ${anchorTip(content.inviteURL)}`,
  });
}

export function prepareTopicInviteEmailMessage(
  content: InviteContent & PersonalizedContent,
): string {
  return layout({
    heading: `${p`Checkout the Topic -  ${content.invitePropertyName}`}`,
    body: `${p`Hi ${content.toFirstName}`}
    ${p
      `<p> ${content.fromFirstName} has invited you to the topic <b>${content.invitePropertyName}</b> in Medigy. Please click the below button to register into Medigy and check out the project. <br/> If you are already a Medigy user please log in and continue.
      </p>
      <p>
          
          Medigy highlights open source and commercially available digital health software which are targeting interoperability as a core capability. This is a perfect place for FHIR® enthusiasts to share and discover dozens of the latest interoperable healthcare solutions on one convenient platform.
      </p>`}
    ${callToActionButton("Accept Invitation", content.inviteURL)}
    ${anchorTip(content.inviteURL)}`,
  });
}

export function prepareProjectInviteEmailMessage(
  content: InviteContent & PersonalizedContent,
): string {
  return layout({
    heading: `${p`Checkout the Project -  ${content.invitePropertyName}`}`,
    body: `${p`Hi ${content.toFirstName}`}
    ${p
      `<p> ${content.fromFirstName} has invited you to the project <b>${content.invitePropertyName}</b> in Medigy. Please click the below button to register into Medigy and check out the project. <br/> If you are already a Medigy user please log in and continue.
      </p>
      </p>
      <p>
          
          Medigy highlights open source and commercially available digital health software which are targeting interoperability as a core capability. This is a perfect place for FHIR® enthusiasts to share and discover dozens of the latest interoperable healthcare solutions on one convenient platform.
      </p>`}
    ${callToActionButton("Accept Invitation", content.inviteURL)}
    ${anchorTip(content.inviteURL)}`,
  });
}
