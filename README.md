:construction: This is an early access technology and is still heavily in development. Reach out to us over slack before using it.

# AEM Edge Delivery Services Marketing Technology

The AEM Marketing Technology plugin helps you quickly set up a complete MarTech stack for your AEM project. It is currently available to customers in collaboration with AEM Engineering via co-innovation VIP Projects. To implement your use cases, please reach out to the AEM Engineering team in the Slack channel dedicated to your project.


## Features

The AEM MarTech plugin is essentially a wrapper around the Adobe Experience Platform WebSDK (v2.19.2) and the Adobe Client Data Layer (v2.0.2), and that can seamlessly integrate your website with:

- 🎯 Adobe Target or Adobe Journey Optimizer: to personalize your pages
- 📊 Adobe Analytics: to track customer journey data
- 🚩 Adobe Experience Platform Tags (a.k.a. Launch): to track your custom events

It's key differentiator are:
- 🌍 Experience Platform enabled: the library fully integrates with our main Adobe Experience Platform and all the services of our ecosystem
- 🚀 extremely fast: the library is optimized to reduce load delay, TBT and CLS, and has minimal impact on your Core Web Vitals
- 👤 privacy-first: the library does not track end users by default, and can easily be integrated with your preferred consent management system to open up more advanced use cases

## Prerequisites

You need to have access to:
- Adobe Experience Platform (AEP)
- Adobe Analytics
- Adobe Target or Adobe Journey Optimizer

And you need to have preconfigured:
- a datastream in AEP with Adobe Analytics, and Adobe Target or Adobe Journey Optimizer configured
- an Adobe Experience Platform Tag (Launch) container with the Adobe Analytics & Adobe Client Data Layer extensions at a minimum

We also recommend using a proper consent management system. If not, make sure to default the consent to `in` so you don't block out personalization use cases.

## Installation

Add the plugin to your AEM project by running:
```sh
git subtree add --squash --prefix plugins/martech git@github.com:adobe-rnd/aem-martech.git main
```

If you later want to pull the latest changes and update your local copy of the plugin
```sh
git subtree pull --squash --prefix plugins/martech git@github.com:adobe-rnd/aem-martech.git main
```

If you prefer using `https` links you'd replace `git@github.com:adobe-rnd/aem-martech.git` in the above commands by `https://github.com/adobe-rnd/aem-martech.git`.

If the `subtree pull` command is failing with an error like:
```
fatal: can't squash-merge: 'plugins/martech' was never added
```
you can just delete the folder and re-add the plugin via the `git subtree add` command above.


## Project instrumentation

To properly connect and configure the plugin for your project, you'll need to edit both the `head.html` and `scripts.js` in your AEM project and add the following:

1. Add preload hints for the dependencies we need to speed up the page load at the end of your `head.html`:
    ```html
    <link rel="preload" as="script" crossorigin="anonymous" href="/scripts/adobe-martech/index.js"/>
    <link rel="preload" as="script" crossorigin="anonymous" href="/scripts/adobe-martech/alloy.min.js"/>
    <link rel="preconnect" href="https://edge.adobedc.net"/>
    <!-- change to adobedc.demdex.net if you enable third party cookies -->
    ```
2. Import the various plugin methods at the top of your `scripts.js` file:
    ```js
    import {
      initMartech,
      updateUserConsent,
      martechEager,
      martechLazy,
      martechDelayed,
    } from './adobe-martech/index.js';
    ```
3. Configure the plugin just after the import:
    ```js
    const isConsentGiven = /* hook in your consent check here to make sure you can run personalization use cases. */;
    const martechLoadedPromise = initMartech(
      // The WebSDK config
      // Documentation: https://experienceleague.adobe.com/en/docs/experience-platform/web-sdk/commands/configure/overview#configure-js
      {
        datastreamId: /* your datastream id here, formally edgeConfigId */,
        orgId: /* your ims org id here */,
        onBeforeEventSend: (payload) => {
          // set custom Target params via 
          // see doc at https://experienceleague.adobe.com/en/docs/platform-learn/migrate-target-to-websdk/send-parameters#parameter-mapping-summary
          payload.data.__adobe.target ||= {};

          // set custom Analytics params
          // see doc at https://experienceleague.adobe.com/en/docs/analytics/implementation/aep-edge/data-var-mapping
          payload.data.__adobe.analytics ||= {};
        }
      },
      // The library config
      {
        launchUrls: [/* your Launch container URLs here */],
        personalization: !!getMetadata('target') && isConsentGiven,
      },
    );
    ```
    Note that:
    - the WebSDK `context` flag will, by default, track the `web`, `device` and `environment` details
    - the WebSDK `debugEnabled` flag will, by default, be set to `true` on localhost and any `.page` URL
    - the WebSDK `defaultConsent` is set to `pending` to avoid tracking any sensitive information by default. This will also prevent personalization to properly run unless consent is explicitly given
    - we recommend enabling `personalization` only if needed to limit the performance impact, and only if consent has been given by the user to be compliant with privacy laws. We typically recommend using a page metadata flag for the former, and integrating with your preferred consent management system APIs for the latter.
4. Adjust your `loadEager` method so it waits for the martech to load and personalize the page:
    ```js
    /**
     * loads everything needed to get to LCP.
    */
    async function loadEager(doc) {
      …
      if (main) {
        decorateMain(main);
        await Promise.all([
          martechLoadedPromise.then(martechEager),
          waitForLCP(LCP_BLOCKS),
        ]);
      }
    }
    ```
5. Add a reference to the lazy logic jut above the `sampleRUM('lazy');` call in your `loadLazy` method:
    ```js
    async function loadLazy(doc) {
      …
      await martechLazy();
      sampleRUM('lazy');
      …
    }
    ```
6. Add a reference to the delayed logic in the `loadDelayed` method:
    ```js
    function loadDelayed() {
      // eslint-disable-next-line import/no-cycle
      window.setTimeout(() => {
        martechDelayed();
        return import('./delayed.js');
      }, 3000);
    }
    ```
7. Connect your consent management system so you can track when consent is given. Typically call the `updateUserConsent` with a set of categories & booleans pairs once your consent management sends the event. Here is an example for the [consent banner block](https://github.com/adobe/aem-block-collection/pull/50) in AEM Block Collection:
    ```js
    function consentEventHandler(ev) {
      const collect = ev.detail.categories.includes('CC_ANALYTICS');
      const marketing = ev.detail.categories.includes('CC_MARKETING');
      const personalize = ev.detail.categories.includes('CC_TARGETING');
      const share = ev.detail.categories.includes('CC_SHARING');
      updateUserConsent({ collect, marketing, personalize, share });
    }
    window.addEventListener('consent', consentEventHandler);
    window.addEventListener('consent-updated', consentEventHandler);
    ```

### Custom options

There are various aspects of the plugin that you can configure via options you can pass to the `initMartech` method above.
Here is the full list we support:

```js
initMartech(
  // Documentation: https://experienceleague.adobe.com/en/docs/experience-platform/web-sdk/commands/configure/overview#configure-js
  {
    datastreamId: '...', // the Datastream ID you want to report to
    orgId: '...', // your IMS organisation ID,
    // See https://experienceleague.adobe.com/en/docs/experience-platform/web-sdk/commands/configure/overview for other options
  }
  // The library config
  {
    analytics: true, // whether to track data in Adobe Analytics (AA)
    alloyInstanceName: 'alloy', // the name of the global WebSDK instance
    dataLayer: true, // whether to use the Adobe Client Data Layer (ACDL)
    dataLayerInstanceName: 'adobeDataLayer', // the name of the global ACDL instance
    launchUrls: [], // the list of Launch containers to load
    personalization: true, // whether to apply page personalization from Adobe Target (AT) or Adobe Journey Optimizer (AJO)
    personalizationTimeout: 1000, // the amount of time to wait (in ms) before bailing out and continuing page rendering
  },
);
```

### Integrating Adobe EDS RUM events with Adobe Analytics

The library also exposes a few helper methods to let you quickly integrate default RUM events with your Adobe Analytics solution.

1. Create a new `rum-to-analytics.js` file:
    ```js
    import { sampleRUM } from './lib-franklin.js';
    import { initRumTracking, pushEventToDataLayer } from './adobe-martech/index.js';

    // Define RUM tracking function
    const track = initRumTracking(sampleRUM, { withRumEnhancer: true });

    // Track page views when the page is fully rendered
    // The data will be automatically enriched with applied propositions for personalization use cases
    track('lazy', () => {
      pushEventToDataLayer(
        'web.webpagedetails.pageViews', {
          web: {
            webPageDetails: {
              pageViews: { value: 1 },
              isHomePage: window.location.pathname === '/',
            },
          },
        },
        {
          __adobe: {
            analytics: {
              // see documentation at https://experienceleague.adobe.com/en/docs/analytics/implementation/aep-edge/data-var-mapping
            },
          },
        });
    });

    track('click', ({source, target}) => {
      pushEventToDataLayer('web.webinteraction.linkClicks', {
        web: {
          webInteraction: {
            URL: target,
            name: source,
            linkClicks: { value: 1 },
            type: target && new URL(target).origin !== window.location.origin
              ? 'exit'
              : 'other',
          },
        },
      });
    });

    // see documentation at https://www.aem.live/developer/rum#checkpoints for other events you can track
    ```
2. Load the `rum-to-analytics.js` file before calling `martechLazy()` in your `loadLazy` method:
    ```js
    async function loadLazy(doc) {
      …
      await import('./rum-to-analytics.js');
      await martechLazy();
      sampleRUM('lazy');
      …
    }
    ```


## FAQ

### Why shouldn't I use the default Adobe Tag/Launch approach to do all of this?

Typical instrumentations based on a centralized approach using Adobe Tag/Launch that is loaded early in the pagelife-cycle essentially impacts the user experience negatively for the benefit of marketing metrics. Core Web Vitals are noticeably impacted, and Google PageSpeed reports typically show a drop of 20~40 points in the performance category.

### But can't I just defer the launch container to solve this?

This can indeed solve the issue in some cases, but comes with its own drawbacks:
1. personalization use cases will be delayed as well, so you'll introduce content flickering when the personalization kicks in
2. analytics metrics gathering will be delayed as well, so if your website has a large percentage of early bounces, your analytics reports won't be able to catpture those

### What guarantee do I have that your approach will not break …some feature name…?

Adobe Tags/Launch will typically wrap the [Adobe Experience Platform SDK](https://experienceleague.adobe.com/en/docs/experience-platform/web-sdk/) and [Adobe Client Data Layer](https://github.com/adobe/adobe-client-data-layer), and configure your datastreams to connect to Adobe Target and Adobe Analytics.

Our approach just extracts those key elements from the launch container so we can instrument those selectively at the right time in the page load for optimial performance, but we still leverage the official documented APIs and configurations as Adobe Launch would.

We are basically building on top of:
- [Top and bottom of page events](https://experienceleague.adobe.com/en/docs/experience-platform/web-sdk/use-cases/top-bottom-page-events) so we can enable personalization early in the page load, and wait for the page to fully render to report metrics
- [Data object variable mapping](https://experienceleague.adobe.com/en/docs/analytics/implementation/aep-edge/data-var-mapping) so we can gather key page metadata for your page in Adobe Analytics 
- Adobe Launch to trigger additional rules and based on data elements in a delayed manner so we still support marketing use cases you'd expect to cover via Adobe Launch alone

On top of this, we also fine-tuned the code to:
- avoid content flicker as the DOM is dynamically rendered to support AEM EDS and/or SPA use cases
- dynamically load personalization and data layer dependencies only when needed

### So what's the catch?

Since we essentially just split up the Adobe Launch container to execute it in a more controlled way, not all features can be controlled from the launch UI, and some of the logic moves to the project code.

Also, some of the default Adobe Launch extensions won't work directly with such a setup.
We recommend the following baseline:
- Core Extension
- Adobe Client Data Layer: so you can react to data layer events
- AA via AEP Web SDK: so you can have rules setting variables, product strings and send beacons
- Mapping Table: so you can remap selected values in your data elements
