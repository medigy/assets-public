import { govnTxtTmpl as gtt } from "./deps.ts";
import {
  executeTemplate as layout,
  p,
  PersonalizedContent,
} from "./medigy-tx-email-layout.tmpl.ts";

export interface FeedbackContent {
  readonly feedbackContent: string;
  readonly fromFirstName: string;
}

export const [
  isValidPersonalizedFeedbackContent,
  onInvalidPersonalizedFeedbackContent,
] = gtt
  .contentGuard<FeedbackContent & PersonalizedContent>(
    "toFirstName",
    "feedbackContent",
    "fromFirstName",
  );

export const [
  isValidPersonalizedGeneralFeedbackContent,
  onInvalidPersonalizedGeneralFeedbackContent,
] = gtt
  .contentGuard<FeedbackContent & PersonalizedContent>(
    "toFirstName",
  );

export const [
  isValidPersonalizedGeneralFeedbackAlertContent,
  onInvalidPersonalizedGeneralFeedbackAlertContent,
] = gtt
  .contentGuard<FeedbackContent & PersonalizedContent>(
    "toFirstName",
    "fromFirstName",
  );

export const [
  isValidPersonalizedClaimFeedbackContent,
  onInvalidPersonalizedClaimFeedbackContent,
] = gtt
  .contentGuard<FeedbackContent & PersonalizedContent>(
    "toFirstName",
    "feedbackContent",
  );

export function preparePostClaimFeedbackAlertEmailMessage(
  content: FeedbackContent & PersonalizedContent,
): string {
  return layout({
    heading: "Feedback from Claim",
    body: `${p`Hi ${content.toFirstName}`}
    <p> You have a new feedback from post claim submit in Medigy. Please see the details below.
    </p>
    </p>
    ${content.feedbackContent}
    <p>
        
        Medigy highlights open source and commercially available digital health software which are targeting interoperability as a core capability. This is a perfect place for FHIR® enthusiasts to share and discover dozens of the latest interoperable healthcare solutions on one convenient platform.
    </p>`,
  });
}

export function preparePostClaimFeedbackThankYouEmailMessage(
  content: FeedbackContent & PersonalizedContent,
): string {
  return layout({
    heading: "Feedback from Claim",
    body: `${p`Hi ${content.toFirstName}`}
    <p> Your information will help us provide you with the most relevant and useful content – thank you! If you ever have feedback about the site or ideas of what you would like to see, please email us at reply@mail.medigy.com. 
    </p>
    Please find below the details you submitted.
    <p>
    ${content.feedbackContent}
    </p>
    `,
  });
}

export function prepareGeneralFeedbackThankYouEmailMessage(
  content: FeedbackContent & PersonalizedContent,
): string {
  return layout({
    heading: "Feedback from Claim",
    body: `${p`Hi ${content.toFirstName}`}
    <p>
        We greatly appreciate the time you've taken to share your feedback with us . We will go over this in detail and get back. Thank you very much.
        We will revert you back regarding this soon.
    </p>
    `,
  });
}

export function prepareGeneralFeedbackAlertEmailMessage(
  content: FeedbackContent & PersonalizedContent,
): string {
  return layout({
    heading: "Feedback from Claim",
    body: `${p`Hi ${content.toFirstName}`}
    <p>
        A feedback has been submitted from the  ${content.fromFirstName}. Please check this and process this feedback in Netspective Feedbacks.
    </p>
    `,
  });
}
