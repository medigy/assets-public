import { govnTxtTmpl as gtt } from "./deps.ts";
import {
  executeTemplate as layout,
  p,
  PersonalizedContent,
} from "./medigy-tx-email-layout.tmpl.ts";

export interface IlmContent {
  readonly ilmName: string;
}

export const [
  isValidPersonalizedIlmContent,
  onInvalidPersonalizedIlmContent,
] = gtt
  .contentGuard<IlmContent & PersonalizedContent>(
    "toFirstName",
    "ilmName",
  );

export function prepareCreateIlmSuccessEmailMessage(
  content: IlmContent & PersonalizedContent,
): string {
  return layout({
    heading: `${p`Created ILM - ${content.ilmName} Successfully`}`,
    body: `${p`Hi ${content.toFirstName}`}
    <p>
    Thank you for creating the Innovator Life cycle Managment Project ${content.ilmName} in Medigy.
    You can start to add Offerings,Services , News and events etc to this by clicking Add to ILM button in Medigy.
    </p>`,
  });
}
