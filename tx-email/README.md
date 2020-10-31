# Netspective Medigy Transactional (TX) E-mail Content

The Medigy TX E-mail system uses the [github.com/shah/ts-safe-template](https://github.com/shah/ts-safe-template) library to define transactional e-mail content in TypeScript code and generate all the `*.html` files as validated, type-safe, content.

# How to create an email template

1. See if the standard layout in [medigy-tx-emails-layout.html.ts](medigy-tx-emails-layout.html.ts) matches your layout requirement. Assuming, it does, go to the next step.
2. In [medigy-tx-emails.ts](medigy-tx-emails.ts) create a new class that implements the `EmailTemplate` interface. See `CreatePasswordEmail` and `ResetPasswordEmail` for examples. 
3. Add your new class to the `emailTemplates` const declaration.
4. Execute `deno-run medigy-tx-emails.ts`

You should see the following output:

```bash
❯ deno-run medigy-tx-emails.ts
Check file:///home/snshah/workspaces/git.netspective.io/netspective-medigy/next.medigy.com/src/tx-email/medigy-tx-emails.ts
Wrote Create Password Email Template.auto.html
Wrote Reset Password Email Template.auto.html
```

From the single `medigy-tx-emails.ts` all the different `*.auto.html` files will be generated using the layout defined at [medigy-tx-emails-layout.html.ts](medigy-tx-emails-layout.html.ts).