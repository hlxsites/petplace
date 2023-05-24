import { decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const form = `
  <div class="form-container"><span>How can we improve this article?</span>
    <form action="#" data-dashlane-rid="8dbbc1903519762c" data-form-type="contact"><textarea name="feedback"
            placeholder="Type your comment" data-dashlane-rid="184aee2caa5ea3ad"
            data-form-type="other"></textarea><button type="submit" data-dashlane-label="true"
            data-dashlane-rid="be3d6a500264ea13" data-form-type="action">SEND</button></form>
  </div>`;

  block.innerHTML = `  
    <div class="like-post-container">
      <div class="counter">
        <span class="icon icon-paw" ></span>
        <p>0 paws up</p>
      </div>
      <div class="paw-btn-container">
        <span>Was this article helpful?</span>
        <span class="paw-btn btn-yes">Yes</span>
        <span class="paw-btn btn-no">No</span>
      </div>
      <img class="email-pets" src="/images/cat-dog.png" alt="email">
      <div class="sign-up-wrapper">
        <p>Get the best of PetPlace straight to your inbox.</p>
        <div id="nav-digioh-btn"></div>
        <p>By signing up, you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div> 
    `;
  block.querySelector('.btn-yes').addEventListener('click', () => {
    alert('hi');
  });

  block.querySelector('.btn-no').addEventListener('click', () => {
    block.querySelector('.paw-btn-container').outerHTML = form;
  });

  decorateIcons(block);
}
