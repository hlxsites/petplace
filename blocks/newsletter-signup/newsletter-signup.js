function addCheckbox(parent, id, label) {
  const inputId = `newsletter-checkbox-${id}`;
  const container = document.createElement('span');
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
  text.setAttribute('type', 'text');
  text.setAttribute('id', inputId);
  text.setAttribute('name', inputId);
  text.setAttribute('placeholder', label);
  parent.append(text);

  return inputId;
}

export default function decorate(block) {
  const target = block.children[0];
  const dogInputId = addCheckbox(target, 'dog', 'Yes, Send Me The Paw Print Newsletter.');
  const catInputId = addCheckbox(target, 'cat', "Yes, Send Me The Cat's Meow Newsletter.");
  const emailInputId = addTextbox(target, 'email', 'Type your email');
  addTextbox(target, 'name', 'Enter your name');

  const buttonContainer = document.createElement('p');
  buttonContainer.classList.add('button-container');

  const button = document.createElement('a');
  button.href = '#';
  button.title = 'Sign up now';
  button.classList.add('button', 'primary');
  button.innerText = 'Sign up now';
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const dognewsletter = document.getElementById(dogInputId).checked;
    const catnewsletter = document.getElementById(catInputId).checked;
    const email = document.getElementById(emailInputId).value;
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
  });
  buttonContainer.append(button);
  target.append(buttonContainer);

  const terms = document.createElement('p');
  terms.classList.add('newsletter-terms');
  terms.innerHTML = `By signing up, you agree to our <a href="/terms-of-use" target="_blank">Terms of Use</a> and <a href="/privacy-policy" target="_blank">Privacy Policy</a>.`;
  target.append(terms);
}