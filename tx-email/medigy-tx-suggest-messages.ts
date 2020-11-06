import { govnTxtTmpl as gtt } from "./deps.ts";
import {
  executeTemplate as layout,
  p,
  PersonalizedContent,
} from "./medigy-tx-email-layout.tmpl.ts";

export interface SuggestContent {
  readonly suggestContent: string;
  readonly suggestType: string;
}

export const [
  isValidPersonalizedSuggestContent,
  onInvalidPersonalizedSuggestContent,
] = gtt
  .contentGuard<SuggestContent & PersonalizedContent>(
    "toFirstName",
    "suggestContent",
    "suggestType",
  );

export function prepareSuggestionAlertEmailMessage(
  content: SuggestContent & PersonalizedContent,
): string {
  return layout({
    heading: `${p`A new suggestion for ${content.suggestType}`}`,
    body: `${p`Hi ${content.toFirstName}`}
    <p> You have a new suggestion for ${content.suggestType} in Medigy. Please see the details below.
    </p>
    </p>
    ${content.suggestContent}
    <p>
        
        Medigy highlights open source and commercially available digital health software which are targeting interoperability as a core capability. This is a perfect place for FHIR® enthusiasts to share and discover dozens of the latest interoperable healthcare solutions on one convenient platform.
    </p>`,
  });
}

export function prepareSuggestionThankYouEmailMessage(
  content: SuggestContent & PersonalizedContent,
): string {
  return layout({
    heading: `${p`Suggestion for ${content.suggestType}`}`,
    body: `${p`Hi ${content.toFirstName}`}
    <p> Thank you for the new suggestion for ${content.suggestType} in Medigy. Please find the details you submitted below.</p>
    </p>
    ${content.suggestContent}
    <p>
        
        Medigy highlights open source and commercially available digital health software which are targeting interoperability as a core capability. This is a perfect place for FHIR® enthusiasts to share and discover dozens of the latest interoperable healthcare solutions on one convenient platform.
    </p>`,
  });
}
