// Purpose: Define the end points for the application based on the current environment
const developmentEndPoints = {
  apiUrl: 'https://api-stg-petplace.azure-api.net',
};

const productionEndPoints = {
  apiUrl: 'https://api.petplace.com',
};

// Set the current environment (manually)
const currentEnvironment = 'production';

// Set the endPoints based on the current environment
const endPoints = currentEnvironment === 'development' ? developmentEndPoints : productionEndPoints;

export default endPoints;
