import {loadShopifyBuy} from '../../scripts/third-party.js';

export default async function decorate(block) {
  const container = block.parentElement.parentElement;
  let bytetagId = container.dataset.bytetagId;
  const bytetagToken = container.dataset.bytetagToken;
  if(bytetagId && bytetagToken) {
    if(bytetagId.indexOf('tel:') !== -1){
      bytetagId = bytetagId.replace('tel:', '');
    }
    loadShopifyBuy(bytetagId, block, bytetagToken)
  }
}
