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

// HEADER HELPERS
export const headerNavHelper = () => {
  const navTracking = document.querySelectorAll('.nav-sections a');
  navTracking.forEach((tag) => {
    tag.addEventListener('click', () => {
      clickHelper('Header Nav', tag.innerHTML, 'link', tag.href);
    });
  });
};

export const headerMenuHelper = () => {
  const menuTracking = document.querySelectorAll('.nav-sidebar-links a');
  menuTracking.forEach((tag) => {
    tag.addEventListener('click', () => {
      clickHelper('Header Menu', tag.innerHTML, 'link', tag.href);
    });
  });
};

export const headerSidebarHelper = () => {
  const sidebarTracking = document.querySelectorAll('.nav-sidebar-misc a');
  sidebarTracking.forEach((tag) => {
    tag.addEventListener('click', () => {
      clickHelper('Header Sidebar', tag.innerHTML, 'link', tag.href);
    });
  });
};

// LINK HELPERS (coming next)

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
