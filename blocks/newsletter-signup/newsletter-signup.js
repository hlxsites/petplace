function addCheckbox(parent, id, label) {
  const inputId = `newsletter-checkbox-${id}`;
  const container = document.createElement('span');
  container.classList.add(inputId);
  const check = document.createElement('input');
  check.setAttribute('type', 'checkbox');
  check.setAttribute('id', inputId);
  check.setAttribute('name', inputId);
  check.setAttribute('value', id);
  check.checked = true;

  const labelElem = document.createElement('label');
  labelElem.setAttribute('for', inputId);
  labelElem.innerText = label;

  container.append(check);
  container.append(labelElem);
  parent.append(container);

  return inputId;
}

function addTextbox(parent, id, label) {
  const inputId = `newsletter-text-${id}`;
  const text = document.createElement('input');
  text.classList.add(inputId);
  text.setAttribute('type', 'text');
  text.setAttribute('id', inputId);
  text.setAttribute('name', inputId);
  text.setAttribute('placeholder', label);
  parent.append(text);

  return inputId;
}

function enableElement(target, enable = true) {
  if (enable) {
    target.classList.remove('disabled');
  } else {
    target.classList.add('disabled');
  }
}

function showElement(target, show = true) {
  if (show) {
    target.classList.remove('hidden');
  } else {
    target.classList.add('hidden');
  }
}

export default function decorate(block) {
  const target = block.children[0];
  const dogInputId = addCheckbox(target, 'dog', 'Yes, Send Me The Paw Print Newsletter.');
  const catInputId = addCheckbox(target, 'cat', "Yes, Send Me The Cat's Meow Newsletter.");
  const emailInputId = addTextbox(target, 'email', 'Type your email');
  const nameInputId = addTextbox(target, 'name', 'Enter your name');

  const buttonContainer = document.createElement('p');
  buttonContainer.classList.add('button-container');

  let buttonClick = 0;

  const button = document.createElement('a');
  button.href = '#';
  button.title = 'Sign up now';
  button.classList.add('button', 'primary');
  button.innerText = 'Sign up now';
  button.addEventListener('click', (e) => {
    e.preventDefault();
    enableElement(button, false);

    const success = document.querySelector('.newsletter-signup .newsletter-success');
    const inputError = document.querySelector('.newsletter-signup .newsletter-input-error');
    const apiError = document.querySelector('.newsletter-signup .newsletter-api-error');

    const dognewsletter = document.getElementById(dogInputId).checked;
    const catnewsletter = document.getElementById(catInputId).checked;
    const email = String(document.getElementById(emailInputId).value).trim();
    const name = String(document.getElementById(nameInputId).value).trim();

    showElement(inputError, false);
    showElement(apiError, false);
    showElement(success, false);

    if (!email || !name) {
      showElement(inputError);
      enableElement(button);
      return;
    }

    const payload = {
      email,
      dataFields: {
        catnewsletter,
        dognewsletter
      },
      mergeNestedObjects: true,
      createNewFields: true
    };
    console.log('Calling API with payload', payload);
    // simulate API call
    setTimeout(() => {
      buttonClick += 1;
      // very other button click will generate an error
      if (buttonClick % 2 === 1) {
        showElement(apiError);
        enableElement(button);
      } else {
        showElement(success);
      }
    }, 1000);
  });
  buttonContainer.append(button);
  target.append(buttonContainer);

  const terms = document.createElement('span');
  terms.classList.add('newsletter-terms');
  terms.innerHTML = `
    <p class="newsletter-success hidden">Thank you for signing up! We've received your information and will start sending newsletters to you.</p>
    <p class="newsletter-error newsletter-input-error hidden">Please enter your name and a valid email address.</p>
    <p class="newsletter-error newsletter-api-error hidden">Unfortunately, there was an error submitting your information. Please try again shortly.</p>
    <p>By signing up, you agree to our <a href="/terms-of-use" target="_blank">Terms of Use</a> and <a href="/privacy-policy" target="_blank">Privacy Policy</a>.</p>
  `;
  target.append(terms);
}