import {loadShopifyBuy} from '../../scripts/third-party.js';

export default async function decorate(block) {
  const container = block.parentElement.parentElement;
  const bytetagId = container.dataset.bytetagId;
  const bytetagToken = container.dataset.bytetagToken;
  if(bytetagId && bytetagToken) {
    loadShopifyBuy(bytetagId, block, bytetagToken)
  }
}
