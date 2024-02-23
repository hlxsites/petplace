// Purpose: Define the end points for the application based on the current environment
const developmentEndPoints = {
  apiUrl: 'https://api-stg-petplace.azure-api.net',
};

const productionEndPoints = {
  apiUrl: '',
};

// Set the current environment (manually)
const currentEnvironment = 'development';

// Set the endPoints based on the current environment
const endPoints = currentEnvironment === 'development' ? developmentEndPoints : productionEndPoints;

export default endPoints;
