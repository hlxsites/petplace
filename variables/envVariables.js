function getCurrentEnvironment() {
  const currentUrl = window.location.href;

  // if URL contains "www.petplace.com", merge prodConfigs into b2cPolicies
  if (currentUrl.includes('www.petplace.com') || currentUrl.includes('main--petplace--hlxsites')) {
    return 'production';
  }
  if (currentUrl.includes('adopt-test--petplace--hlxsites') || currentUrl.includes('release')) {
    return 'staging';
  }
  return 'development';
}

export const isProdEnvironment = getCurrentEnvironment() === 'production';

export const isStagingEnvironment = getCurrentEnvironment() === 'staging';

export const isDevelopmentEnvironment = getCurrentEnvironment() === 'development';
