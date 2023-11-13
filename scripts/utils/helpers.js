window.dataLayer ||= [];

export const pushToDataLayer = (layer) => {
  console.log('layer:', layer); // TODO: remove later
  window.dataLayer.push(layer);
};

export const clickHelper = (...args) => {
  console.log('el_clicks:', args); // TODO: remove
  pushToDataLayer({
    event: 'element_click',
    element_category: args[0],
    element_text: args[1],
    element_type: args[2],
    element_url: args[3],
  });
};

export const getSocialName = (href) => {
  const strSplit = href.split('.com')[0];
  const strValue = strSplit.split('.')[1] || 'email';
  const strCaps = strValue.charAt(0).toUpperCase() + strValue.slice(1);
  return strCaps;
};
