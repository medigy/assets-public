import { govnTxtTmpl as gtt } from "./deps.ts";
import {
  anchorTip,
  callToActionButton,
  executeTemplate as layout,
  p,
} from "./medigy-tx-email-layout.tmpl.ts";

export interface AuthnMessageContent {
  readonly authnURL: string;
}

export const [isValidAuthnMessageContent, onInvalidAuthnMessageContent] = gtt
  .contentGuard<AuthnMessageContent>(
    "authnURL",
  );

export function prepareCreatePasswordEmailMessage(
  content: AuthnMessageContent,
): string {
  return layout({
    heading: "Create Password",
    body: `${p`Hi`}
    ${p`Welcome to Medigy, please click below to create your password.`}
    ${callToActionButton("Create a new password", content.authnURL)}
    ${anchorTip(content.authnURL)}`,
  });
}

export function prepareResetPasswordEmailMessage(
  content: AuthnMessageContent,
): string {
  return layout({
    heading: "Reset Password",
    body: `${p`Hi`}
    ${p
      `We're sorry you had trouble logging in, please tap below to reset your password.`}
    ${callToActionButton("Reset your password", content.authnURL)}
    ${anchorTip(content.authnURL)}`,
  });
}
