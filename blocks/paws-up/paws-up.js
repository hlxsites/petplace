import { createOptimizedPicture, decorateIcons } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const count = 0;

  const form = `
  <div class="form-container"><span>How can we improve this article?</span>
    <form action="#"  data-form-type="contact">
        <textarea name="feedback"
            placeholder="Type your comment" data-form-type="other"></textarea>
        <button type="submit" data-form-type="action">SEND</button></form>
  </div>`;

  block.innerHTML = `  
    <div class="like-post-container">
      <div class="counter">
        <span class="icon icon-paw" ></span>
        <p>${count} ${count === 1 ? 'paw' : 'paws'} up</p>
      </div>
      <div class="paw-btn-container">
        <span>Was this article helpful?</span>
        <span class="paw-btn btn-yes">Yes</span>
        <span class="paw-btn btn-no">No</span>
      </div>
      <span class="email-pets"></span>
      <div class="sign-up-wrapper">
        <p>Get the best of PetPlace straight to your inbox.</p>
        <p>By signing up, you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div> 
    `;
  const optimizedPic = createOptimizedPicture('/images/cat-dog.png', 'email');
  block.querySelector('.email-pets').innerHTML = optimizedPic.outerHTML;

  block.querySelector('.btn-yes').addEventListener('click', () => {
    // Todo - Add logic
  });

  block.querySelector('.btn-no').addEventListener('click', () => {
    block.querySelector('.paw-btn-container').outerHTML = form;
  });

  decorateIcons(block);
}
