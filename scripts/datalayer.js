window.dataLayerProxy ||= [];

export const pushToDataLayer = (layer) => {
  window.dataLayerProxy.push(layer);
};

// GLOBAL VARIABLES
const handleGlobalVariables = () => {
  // TODO : if meta category not present, create user story (avinash)
  const contentGroup = document.querySelector('meta[name="category"]');
  pushToDataLayer({
    content_group: contentGroup ? contentGroup.content : '',
  });
};

// ARTICLE SHARE -> to come in later

export const handleDataLayerApproach = () => {
  handleGlobalVariables();
};
