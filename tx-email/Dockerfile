FROM alpine:3.9.2
RUN apk add --no-cache curl
RUN curl -L https://deno.land/x/install/install.sh | sh
FROM gcr.io/distroless/cc
COPY --from=0 /root/.deno/bin/deno /
COPY deps.ts /
COPY medigy-tx-authn-messages.ts /
COPY medigy-tx-claim-messages.ts /
COPY medigy-tx-email-layout.tmpl.ts /
COPY medigy-tx-email-messages.tmpl.ts /
ENTRYPOINT ["/deno", "run", "-A", "--unstable", "https://denopkg.com/gov-suite/governed-text-template@v0.2.4/toctl.ts", "server", "--module=file:///medigy-tx-email-messages.tmpl.ts,medigy-email", "--verbose"]
