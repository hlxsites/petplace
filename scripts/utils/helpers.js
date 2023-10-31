window.dataLayer ||= [];

export const pushToDataLayer = (layer) => {
  window.dataLayer.push(layer);
};

export const clickHelper = (category, text, type, url) => {
  console.log('here', category, text, type, url); // TODO remove
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

export const footerSocialHelper = () => {
  const socialTracking = document.querySelectorAll('.footer-social a');
  socialTracking.forEach((tag) => {
    tag.addEventListener('click', () => {
      clickHelper('Social', getSocialName(tag.href), 'link', tag.href);
    });
  });
};

export const footerNavHelper = () => {
  const footerTracking = document.querySelectorAll('.footer-nav-links a');
  footerTracking.forEach((tag) => {
    tag.addEventListener('click', () => {
      clickHelper('Footer', tag.innerHTML, 'link', tag.href);
    });
  });
};
