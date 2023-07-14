const GTM_ID = 'GTM-WP2SGNL';

const GTM_SCRIPT = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

function createInlineScript(innerHTML, parent) {
  const script = document.createElement('script');
  script.type = 'text/partytown';
  script.innerHTML = innerHTML;
  parent.appendChild(script);
}

export default function integrateMartech() {
  createInlineScript(GTM_SCRIPT, document.body);
}
