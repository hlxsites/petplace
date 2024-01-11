import { decorateBlocks, decorateSections, loadBlocks } from '../../scripts/lib-franklin.js';

const CRONTAB_PATH = '/.helix/crontab.xlsx';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Oktober', 'November', 'December'];

async function preview(skConfig, previewPath) {
  const { owner, repo, ref } = skConfig.config;
  const resp = await fetch(`https://admin.hlx.page/preview/${owner}/${repo}/${ref}${previewPath}`, { method: 'POST' });
  if (!resp.ok) {
    throw new Error(`Failed to update preview for ${previewPath}`);
  }
}

async function showModal(modalId, header, content, footer, type = 'info') {
  const { createDialog } = await import('../../blocks/modal/modal.js');
  const modal = await createDialog(modalId, header, content, footer, type);
  modal.showModal();
  if (footer) {
    return new Promise((resolve) => {
      modal.addEventListener('close', () => {
        modal.remove();
        resolve(modal.returnValue);
      });
    });
  }
  return modal;
}

async function wait(message) {
  const modal = await showModal('wait', null, `<p>${message}</p>`);
  return modal;
}

async function notify(message, type, duration = 3000) {
  const modal = await showModal('notify', null, `<p>${message}</p>`, null, type);
  return new Promise((resolve) => {
    setTimeout(() => {
      modal.close();
      modal.remove();
      resolve(modal.returnValue);
    }, duration);
  });
}

async function acknowledge(title, message, type, btnLabel = 'Ok') {
  return showModal(
    'acknowledge',
    `<h1>${title}</h1>`,
    `<p>${message}</p>`,
    `<button value="true">${btnLabel}</button>`,
    type,
  );
}

async function confirm(title, message, type, yesLabel = 'Yes', noLabel = 'No') {
  return showModal(
    'confirm',
    `<h1>${title}</h1>`,
    `<p>${message}</p>`,
    `<button value="true">${yesLabel}</button>
    <button value="false">${noLabel}</button>`,
    type,
  );
}

async function getPublishJobs(sdk, tableName) {
  const crontab = await sdk.getTableCells('/.helix/crontab.xlsx', tableName);
  return crontab.values;
}

function formatCronJobData({ datetime, url }) {
  const pad = (n) => n.toString().padStart(2, '0');
  return [[
    `at ${pad(datetime.getUTCHours())}:${pad(datetime.getUTCMinutes())} on the ${datetime.getUTCDate()} day of ${MONTHS[datetime.getUTCMonth()]} in ${datetime.getUTCFullYear()}`,
    `publish ${new URL(url).pathname}`,
  ]];
}

function parseCronJobData([datetime, url]) {
  const [, hh, mm, dd, mmm, yyyy] = datetime.match(/at (\d+):(\d+) on the (\d+) day of (\w+) in (\d+)/);
  const localDate = new Date(
    Date.UTC(yyyy, MONTHS.indexOf(mmm), dd, hh, mm) - new Date().getTimezoneOffset() * 60000,
  );
  return {
    datetime: localDate,
    url: `https://www.petplace.com${url.replace(/\.html$/, '')}`,
  };
}

async function addPublishJob(sdk, tableName, data) {
  const rows = formatCronJobData(data);
  try {
    await sdk.appendRowsToTable(CRONTAB_PATH, tableName, rows);
  } catch (err) {
    console.error(`Could not log add publish job to ${CRONTAB_PATH}`, err);
  }
}

async function updatePublishJob(sdk, tableName, data, index) {
  const rows = formatCronJobData(data);
  try {
    await sdk.updateRowInTable(CRONTAB_PATH, tableName, index, rows);
  } catch (err) {
    console.error(`Could not log add publish job to ${CRONTAB_PATH}`, err);
  }
}

async function getPublishLaterModal(existingEntry) {
  const response = await fetch('/tools/sidekick/publish-later.plain.html');
  const html = await response.text();

  const fragment = document.createElement('div');
  fragment.innerHTML = html;
  const link = fragment.querySelector('a[href*=".json"]');
  if (link && existingEntry) {
    link.href = `${link.href}?sheet=edit`;
    link.textContent = link.href;
  }
  const header = fragment.querySelector('h1,h2,h3');
  header.remove();

  decorateSections(fragment);
  decorateBlocks(fragment);
  await loadBlocks(fragment);

  const footer = [...fragment.querySelectorAll('button')].map((btn) => {
    btn.parentElement.remove();
    if (btn.type !== 'submit') {
      btn.classList.add('secondary');
    }
    return btn.outerHTML;
  }).join('') || null;

  let date;
  try {
    if (existingEntry) {
      date = parseCronJobData(existingEntry).datetime;
    }
  } catch (err) {
    console.error('Failed to parse existing schedule', err);
  }

  const minDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000 + 10 * 60000);
  const input = fragment.querySelector('input[type="datetime-local"]');
  if (input) {
    input.setAttribute('min', minDate.toISOString().slice(0, -8));
    if (date) {
      input.setAttribute('value', date.toISOString().slice(0, -8));
    }
    if (date < minDate) {
      input.setAttribute('disabled', true);
    }
  }

  const content = fragment.querySelector('form').innerHTML;

  const { createDialog } = await import('../../blocks/modal/modal.js');
  const dialog = await createDialog('dialog-modal', header, content, footer);
  return dialog;
}

let sdk;

export async function publishLater(skConfig) {
  let modal = await wait('Please wait…');
  if (!sdk) {
    const { SharepointSDK } = await import(`${window.location.origin}/tools/sidekick/sharepoint/index.js`);
    sdk = new SharepointSDK({
      domain: 'adobe.sharepoint.com',
      domainId: 'fac8f079-f817-4127-be6b-700b19217904',
      siteId: 'b1df5119-9614-4126-8064-ab9bd8cef865',
      rootPath: '/sites/petplace',
    });

    try {
      await sdk.signIn();
      console.log('Connected to sharepoint');
    } catch (err) {
      sdk = null;
      modal.close();
      modal.remove();
      console.error('Could not log into Sharepoint', err);
      await acknowledge('Error', 'Could not log into Sharepoint.', 'error');
      return;
    }
  }

  const { url } = skConfig.status.preview;

  const cronjobs = await getPublishJobs(sdk, 'jobs');
  const existing = cronjobs.find((job) => String(job[1]).endsWith(new URL(url).pathname));

  modal.close();
  modal.remove();

  let index;
  if (existing) {
    index = cronjobs.indexOf(existing);
  }

  modal = await getPublishLaterModal(existing);
  modal.addEventListener('close', async (ev) => {
    modal.remove();

    if (modal.returnValue === 'submit') {
      modal = await wait('Publishing schedule…');
      const formData = new FormData(ev.target.querySelector('form'));
      const datetime = new Date(formData.get('datetime'));

      try {
        if (existing) {
          await updatePublishJob(sdk, 'jobs', { datetime, url }, index - 1);
        } else {
          await addPublishJob(sdk, 'jobs', { datetime, url });
        }

        await preview(skConfig, CRONTAB_PATH.replace('.xlsx', '.json'));
        modal.close();
        modal.remove();
        await notify('Publishing scheduled successfully.', 'success', 3000);
      } catch (err) {
        modal.close();
        modal.remove();
        if (existing) {
          await acknowledge('Publish Later', 'Failed to update existing publishing schedule.', 'error');
          console.error('Failed to update publishing job', err);
        } else {
          await acknowledge('Publish Later', 'Failed to create publishing schedule.', 'error');
          console.error('Failed to prepare publishing job', err);
        }
      }
      return;
    }

    if (modal.returnValue === 'delete') {
      const confirmed = await confirm(
        'Delete schedule',
        'Are you sure you want to delete this publishing schedule?',
      );
      if (confirmed !== 'true') {
        return;
      }
      try {
        modal = await wait('Deleting schedule…');
        await sdk.deleteRowInTable(CRONTAB_PATH, 'jobs', index - 1);
        await preview(skConfig, CRONTAB_PATH.replace('.xlsx', '.json'));
        modal.close();
        modal.remove();
        await notify('Publishing job deleted successfully.', 'success', 3000);
      } catch (err) {
        console.error('Failed to delete publishing job', err);
        await acknowledge('Publish Later', 'Failed to delete existing publishing schedule.', 'error');
      }
    }
  });

  modal.showModal();
}
