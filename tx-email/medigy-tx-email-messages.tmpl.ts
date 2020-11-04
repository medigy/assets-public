import { govnTxtTmpl as gtt, safety } from "./deps.ts";
import * as authn from "./medigy-tx-authn-messages.ts";
import * as claim from "./medigy-tx-claim-messages.ts";
import { PersonalizedContent } from "./medigy-tx-email-layout.tmpl.ts";

export const templateIdentities = [
  "create-password",
  "reset-password",
  "claim-invite",
] as const;

export type TemplateIdentity = typeof templateIdentities[number];

export const contentGuards: Record<TemplateIdentity, [
  safety.TypeGuard<unknown>,
  gtt.ContentGuardIssueReporter,
]> = {
  "create-password": [
    authn.isValidAuthnMessageContent,
    authn.onInvalidAuthnMessageContent,
  ],
  "reset-password": [
    authn.isValidAuthnMessageContent,
    authn.onInvalidAuthnMessageContent,
  ],
  "claim-invite": [
    claim.isValidPersonalizedClaimContent,
    claim.onInalidPersonalizedClaimContent,
  ],
};

export const [
  isValidContent,
  onInvalidContent,
  isValidTemplateID,
  onInvalidTemplateID,
] = gtt
  .templateIdentityGuard<TemplateIdentity>(templateIdentities, contentGuards);

export function executeTemplate(
  content:
    | authn.AuthnMessageContent
    | (claim.ClaimContent & PersonalizedContent),
  templateIdentity: TemplateIdentity,
): string {
  if (!isValidTemplateID(templateIdentity)) {
    return onInvalidTemplateID(templateIdentity, content);
  }
  switch (templateIdentity) {
    case "create-password":
      return authn.prepareCreatePasswordEmailMessage(
        content as authn.AuthnMessageContent,
      );

    case "reset-password":
      return authn.prepareResetPasswordEmailMessage(
        content as authn.AuthnMessageContent,
      );

    case "claim-invite":
      return claim.prepareClaimInviteEmailMessage(
        content as (claim.ClaimContent & PersonalizedContent),
      );
  }
}

export default [
  executeTemplate,
  isValidContent,
  onInvalidContent,
  isValidTemplateID,
  onInvalidTemplateID,
];
