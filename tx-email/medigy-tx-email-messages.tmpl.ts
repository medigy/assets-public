import { govnTxtTmpl as gtt, safety } from "./deps.ts";
import * as authn from "./medigy-tx-authn-messages.ts";
import * as claim from "./medigy-tx-claim-messages.ts";
import * as insti from "./medigy-tx-insti-messages.ts";
import * as invite from "./medigy-tx-invite-messages.ts";
import * as feedback from "./medigy-tx-feedback-messages.ts";
import * as suggest from "./medigy-tx-suggest-messages.ts";
import * as ilm from "./medigy-tx-ilm-messages.ts";
import * as offering from "./medigy-tx-offering-messages.ts";
import { PersonalizedContent } from "./medigy-tx-email-layout.tmpl.ts";

export const templateIdentities = [
  "create-password",
  "reset-password",
  "claim-invite",
  "reset-password-success",
  "user-signup",
  "claim-request-confirmation",
  "claim-success-thankyou",
  "create-institution",
  "claim-institution",
  "claim-institution-request-confirm",
  "institution-invite",
  "invite-evaluation-facet",
  "invite-topic",
  "invite-project",
  "post-claim-feedback-alert",
  "post-claim-feedback-thank-you",
  "general-feedback-thank-you",
  "general-feedback-alert",
  "suggestion-alert",
  "suggestion-thank-you",
  "create-ilm",
  "create-offering",
  "update-offering",
  "approve-offering",
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
    claim.onInvalidPersonalizedClaimContent,
  ],
  "reset-password-success": [
    authn.isValidAuthnMessageResetPassContent,
    authn.onInvalidAuthnMessageResetPassContent,
  ],
  "user-signup": [
    authn.isValidAuthnMessageContent,
    authn.onInvalidAuthnMessageContent,
  ],
  "claim-request-confirmation": [
    claim.isValidPersonalizedClaimRequestContent,
    claim.onInvalidPersonalizedClaimRequestContent,
  ],
  "claim-success-thankyou": [
    claim.isValidPersonalizedClaimSuccessContent,
    claim.onInvalidPersonalizedClaimSuccessContent,
  ],
  "create-institution": [
    insti.isValidPersonalizedCreateInstiContent,
    insti.onInvalidPersonalizedCreateInstiContent,
  ],
  "claim-institution": [
    insti.isValidPersonalizedClaimInstiInviteContent,
    insti.onInvalidPersonalizedClaimInstiInviteContent,
  ],
  "claim-institution-request-confirm": [
    insti.isValidPersonalizedCreateInstiContent,
    insti.onInvalidPersonalizedCreateInstiContent,
  ],
  "institution-invite": [
    insti.isValidPersonalizedInstiContent,
    insti.onInvalidPersonalizedInstiContent,
  ],
  "invite-evaluation-facet": [
    invite.isValidPersonalizedInviteContent,
    invite.onInvalidPersonalizedInviteContent,
  ],
  "invite-topic": [
    invite.isValidPersonalizedInviteTopicProjectContent,
    invite.onInvalidPersonalizedInviteTopicProjectContent,
  ],
  "invite-project": [
    invite.isValidPersonalizedInviteTopicProjectContent,
    invite.onInvalidPersonalizedInviteTopicProjectContent,
  ],
  "post-claim-feedback-alert": [
    feedback.isValidPersonalizedClaimFeedbackContent,
    feedback.onInvalidPersonalizedClaimFeedbackContent,
  ],
  "post-claim-feedback-thank-you": [
    feedback.isValidPersonalizedClaimFeedbackContent,
    feedback.onInvalidPersonalizedClaimFeedbackContent,
  ],
  "general-feedback-thank-you": [
    feedback.isValidPersonalizedGeneralFeedbackContent,
    feedback.onInvalidPersonalizedGeneralFeedbackContent,
  ],
  "general-feedback-alert": [
    feedback.isValidPersonalizedGeneralFeedbackAlertContent,
    feedback.onInvalidPersonalizedGeneralFeedbackAlertContent,
  ],
  "suggestion-alert": [
    suggest.isValidPersonalizedSuggestContent,
    suggest.onInvalidPersonalizedSuggestContent,
  ],
  "suggestion-thank-you": [
    suggest.isValidPersonalizedSuggestContent,
    suggest.onInvalidPersonalizedSuggestContent,
  ],
  "create-ilm": [
    ilm.isValidPersonalizedIlmContent,
    ilm.onInvalidPersonalizedIlmContent,
  ],
  "create-offering": [
    offering.isValidPersonalizedOfferingContent,
    offering.onInvalidPersonalizedOfferingContent,
  ],
  "update-offering": [
    offering.isValidPersonalizedOfferingContent,
    offering.onInvalidPersonalizedOfferingContent,
  ],
  "approve-offering": [
    offering.isValidPersonalizedOfferingApprovalContent,
    offering.onInvalidPersonalizedOfferingApprovalContent,
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
    | (claim.ClaimContent & PersonalizedContent)
    | (insti.InstiContent & PersonalizedContent)
    | (invite.InviteContent & PersonalizedContent)
    | (feedback.FeedbackContent & PersonalizedContent)
    | (suggest.SuggestContent & PersonalizedContent)
    | (ilm.IlmContent & PersonalizedContent)
    | (offering.OfferingContent & PersonalizedContent),
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

    case "reset-password-success":
      return authn.prepareResetPasswordSuccessEmailMessage(
        content as authn.AuthnMessageContent,
      );

    case "user-signup":
      return authn.prepareUserSignUpEmailMessage(
        content as authn.AuthnMessageContent,
      );

    case "claim-request-confirmation":
      return claim.prepareClaimRequestConfirmationEmailMessage(
        content as (claim.ClaimContent & PersonalizedContent),
      );

    case "claim-success-thankyou":
      return claim.prepareClaimSuccessThankYouEmailMessage(
        content as (claim.ClaimContent & PersonalizedContent),
      );

    case "create-institution":
      return insti.prepareCreateInstitutionEmailMessage(
        content as (insti.InstiContent & PersonalizedContent),
      );

    case "claim-institution":
      return insti.prepareClaimInstitutionInviteEmailMessage(
        content as (insti.InstiContent & PersonalizedContent),
      );

    case "claim-institution-request-confirm":
      return insti.prepareClaimInstitutionRequestEmailMessage(
        content as (insti.InstiContent & PersonalizedContent),
      );

    case "institution-invite":
      return insti.prepareInstitutionInviteEmailMessage(
        content as (insti.InstiContent & PersonalizedContent),
      );

    case "invite-evaluation-facet":
      return invite.prepareEvaluationFacetInviteEmailMessage(
        content as (invite.InviteContent & PersonalizedContent),
      );

    case "invite-topic":
      return invite.prepareTopicInviteEmailMessage(
        content as (invite.InviteContent & PersonalizedContent),
      );

    case "invite-project":
      return invite.prepareProjectInviteEmailMessage(
        content as (invite.InviteContent & PersonalizedContent),
      );

    case "post-claim-feedback-alert":
      return feedback.preparePostClaimFeedbackAlertEmailMessage(
        content as (feedback.FeedbackContent & PersonalizedContent),
      );

    case "post-claim-feedback-thank-you":
      return feedback.preparePostClaimFeedbackThankYouEmailMessage(
        content as (feedback.FeedbackContent & PersonalizedContent),
      );

    case "general-feedback-thank-you":
      return feedback.prepareGeneralFeedbackThankYouEmailMessage(
        content as (feedback.FeedbackContent & PersonalizedContent),
      );

    case "general-feedback-alert":
      return feedback.prepareGeneralFeedbackAlertEmailMessage(
        content as (feedback.FeedbackContent & PersonalizedContent),
      );

    case "suggestion-alert":
      return suggest.prepareSuggestionAlertEmailMessage(
        content as (suggest.SuggestContent & PersonalizedContent),
      );

    case "suggestion-thank-you":
      return suggest.prepareSuggestionThankYouEmailMessage(
        content as (suggest.SuggestContent & PersonalizedContent),
      );

    case "create-ilm":
      return ilm.prepareCreateIlmSuccessEmailMessage(
        content as (ilm.IlmContent & PersonalizedContent),
      );

    case "create-offering":
      return offering.prepareOfferingCreateEmailMessage(
        content as (offering.OfferingContent & PersonalizedContent),
      );

    case "update-offering":
      return offering.prepareOfferingUpdateEmailMessage(
        content as (offering.OfferingContent & PersonalizedContent),
      );

    case "approve-offering":
      return offering.prepareOfferingApproveEmailMessage(
        content as (offering.OfferingContent & PersonalizedContent),
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
