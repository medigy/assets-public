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
  onInalidPersonalizedClaimContent,
] = gtt
  .contentGuard<ClaimContent & PersonalizedContent>(
    "toFirstName",
    "claimURL",
    "claimantFirstName",
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
