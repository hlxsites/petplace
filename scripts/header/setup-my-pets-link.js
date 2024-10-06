import { getAuthToken, parseJwt } from '../parse-jwt.js';

export async function setupMyPetsLink() {
  const authToken = await getAuthToken();
  if (!authToken) return;

  // check if the user has the required claims to access the link
  const claim = parseJwt(authToken);
  if (!claim) return;

  const hasRelationId = claim.extension_CustRelationId !== '0';
  const hasAdoptionId = !!claim.extension_AdoptionId;

  // if the user have the required claims, include the link
  if (hasRelationId && hasAdoptionId) {
    document.getElementById('user-nav-my-pets-link')?.classList.remove('hidden');
  }
}
