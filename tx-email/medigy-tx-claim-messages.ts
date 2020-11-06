import { govnTxtTmpl as gtt } from "./deps.ts";
import {
  executeTemplate as layout,
  p,
  PersonalizedContent,
} from "./medigy-tx-email-layout.tmpl.ts";

export interface ClaimContent {
  readonly claimURL: string;
  readonly claimantFirstName: string;
  readonly offeringName: string;
  readonly offeringType: "product" | "service" | "solution" | "API";
}

export const [
  isValidPersonalizedClaimContent,
  onInvalidPersonalizedClaimContent,
] = gtt
  .contentGuard<ClaimContent & PersonalizedContent>(
    "toFirstName",
    "claimURL",
    "claimantFirstName",
    "offeringName",
    "offeringType",
  );

export const [
  isValidPersonalizedClaimRequestContent,
  onInvalidPersonalizedClaimRequestContent,
] = gtt
  .contentGuard<ClaimContent & PersonalizedContent>(
    "toFirstName",
    "offeringName",
  );

export const [
  isValidPersonalizedClaimSuccessContent,
  onInvalidPersonalizedClaimSuccessContent,
] = gtt
  .contentGuard<ClaimContent & PersonalizedContent>(
    "toFirstName",
    "offeringName",
    "offeringType",
  );

export function prepareClaimInviteEmailMessage(
  content: ClaimContent & PersonalizedContent,
): string {
  return layout({
    heading: "Confirm Medigy Claim",
    body: `${p`Hi ${content.toFirstName}`}
    <p>${content.claimantFirstName} submitted a claim request for the ${content.offeringName} ${content.offeringType}. 
    If you can manage this ${content.offeringType}, please <a href="${content.claimURL}">tap here</a> to confirm.</p>`,
  });
}

export function prepareClaimRequestConfirmationEmailMessage(
  content: ClaimContent & PersonalizedContent,
): string {
  return layout({
    heading: "Request Medigy Claim",
    body: `${p`Hi ${content.toFirstName}`}
    <p>  Your request on ${content.offeringName} has been submitted successfully. Our curation team will check and get back to you on this.</p>`,
  });
}

export function prepareClaimSuccessThankYouEmailMessage(
  content: ClaimContent & PersonalizedContent,
): string {
  return layout({
    heading: "Medigy Claim Successful",
    body: `${p`Hi ${content.toFirstName}`}
    <p>
    Thanks for claiming your ${content.offeringType} ${content.offeringName} !
    </p>
    <p>  We’ll let you know once it is published on Medigy. If you do not receive a response from us within 3 working days, please write to us at reply@mail.medigy.com.
    </p>`,
  });
}
