import * as Sentry from "@sentry/remix";
import { RemixBrowser, useLocation, useMatches } from "@remix-run/react";
import { startTransition, StrictMode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";

Sentry.init({
    dsn: "https://bd9dfb2ab27c022ce41faae176a650f2@o4506242183987200.ingest.sentry.io/4506555089027072",
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,

    // trying filtering
    beforeSend(event) {
      if (event.exception?.values[0].value === "shouldNotSeeThis is not defined") {
        console.log("found one!");
        return null;
      }
      console.log(event);
      return event;
    },

    // filtering out ui click breadcrumbs!
    beforeBreadcrumb(breadcrumb, hint) {
      return breadcrumb.category === "ui.click" ? null : breadcrumb
    },

    integrations: [new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.remixRouterInstrumentation(useEffect, useLocation, useMatches)
    }), new Sentry.Replay()]
})

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});