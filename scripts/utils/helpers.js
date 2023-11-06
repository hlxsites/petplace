window.dataLayer ||= [];

export const pushToDataLayer = (layer) => {
  console.log('layer', layer); // TODO: remove later
  window.dataLayer.push(layer);
};

export const clickHelper = (category, text, type, url) => {
  console.log('here', category, text, type, url); // TODO: remove
  pushToDataLayer({
    event: 'element_click',
    element_category: category,
    element_text: text,
    element_type: type,
    element_url: url,
  });
};

export const getSocialName = (href) => {
  const strSplit = href.split('.com')[0];
  const strValue = strSplit.split('.')[1] || 'Email';
  const strCaps = strValue.charAt(0).toUpperCase() + strValue.slice(1);
  return strCaps;
};

// FOOTER HELPERS
export const footerSocialHelper = () => {
  const socialTracking = document.querySelectorAll('.footer-social a');
  socialTracking.forEach((tag) => {
    tag.addEventListener('click', () => {
      clickHelper('Footer Social', getSocialName(tag.href), 'link', tag.href);
    });
  });
};

export const footerNavHelper = () => {
  const footerTracking = document.querySelectorAll('.footer-nav-links a');
  footerTracking.forEach((tag) => {
    tag.addEventListener('click', () => {
      clickHelper('Footer Nav', tag.innerHTML, 'link', tag.href);
    });
  });
};

// TODO - revisit later (phase 2)
export const footerLegalHelper = () => {
  const legalTracking = document.querySelectorAll('.footer-legal a');
  legalTracking.forEach((tag) => {
    tag.addEventListener('click', () => {
      clickHelper('Footer Legal', tag.innerHTML, 'link', tag.href);
    });
  });
};
