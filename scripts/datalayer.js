window.dataLayer ||= [];

// GLOBAL VARIABLES
const handleGlobalVariables = () => {
  // TODO : if meta category not present, create user story (avinash)
  const contentGroup = document.querySelector('meta[name="category"]');
  window.dataLayer.push({
    content_group: contentGroup ? contentGroup.content : '',
  });
};

// ARTICLE SHARE -> to come in later

export const handleDataLayerApproach = () => {
  handleGlobalVariables();
};
