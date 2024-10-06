/* eslint-disable indent */
// eslint-disable-next-line
import { acquireToken } from '../../scripts/lib/msal/msal-authentication.js';
import endPoints from '../../variables/endpoints.js';
import TabsManual from './tabs-manual.js';
// eslint-disable-next-line
import { createAccountFavoritesPanel } from './account-favorites.js';
import { createAccountInquiriesPanel } from './account-inquiries.js';
import { createSavedSearchPanel } from './account-saved-searches.js';
import { createAccountSurveyPanel } from './account-survey.js';

async function createTabComponent() {
    const tabArray = [
        { title: 'Search Alerts', hash: 'searchalerts' },
        { title: 'Favorites', hash: 'favorites' },
        { title: 'Inquiries', hash: 'inquiries' },
        { title: 'Pet Match Survey', hash: 'survey' },
    ];
    const tabs = document.createElement('div');
    tabs.className = 'account-tabs';
    const title = document.createElement('h2');
    title.className = 'account-tabs-title';
    title.textContent = 'Pet Adoption';
    tabs.append(title);
    // create tab list for desktop display
    const tablist = document.createElement('ul');
    tablist.className = 'account-tablist';
    tablist.setAttribute('role', 'tablist');
    tabArray.forEach((tab, index) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('role', 'presentation');
        const link = document.createElement('a');
        link.className = `account-tab account-tab--${tab.hash}`;
        link.setAttribute('role', 'tab');
        link.setAttribute('href', `#${tab.hash}`);
        link.setAttribute('id', `account-tab-${index}`);
        link.setAttribute('data-tab-index', index);
        link.setAttribute('aria-selected', `${index === 0 ? 'true' : 'false'}`);
        link.setAttribute('aria-controls', tab.hash);
        const iconEl = document.createElement('span');
        iconEl.className = 'account-tab-icon';
        const textEl = document.createElement('span');
        textEl.className = 'account-tab-text';
        textEl.textContent = tab.title;
        link.append(iconEl, textEl);
        listItem.append(link);
        tablist.append(listItem);
    });
    tabs.append(tablist);

    // create select dropdown for mobile display
    const selectDiv = document.createElement('div');
    selectDiv.className = 'account-select-container';
    const selectEl = document.createElement('select');
    selectEl.className = 'account-select';
    selectEl.id = 'account-select';
    tabArray.forEach((tab, index) => {
        const option = document.createElement('option');
        option.textContent = tab.title;
        option.value = index;
        selectEl.append(option);
    });
    selectDiv.append(selectEl);
    tabs.append(selectDiv);
    // create tab panels
    const tabContents = document.createElement('div');
    tabContents.className = 'account-tab-contents';
    tabArray.forEach((tab, index) => {
        const panelWrapper = document.createElement('div');
        panelWrapper.className = `account-tabpanel account-tabpanel--${tab.hash}${index === 0 ? '' : ' is-hidden'}`;
        panelWrapper.setAttribute('id', tab.hash);
        panelWrapper.setAttribute('role', 'tabpanel');
        panelWrapper.setAttribute('aria-labelledby', `account-tab-${index}`);
        tabContents.append(panelWrapper);
    });
    tabs.append(tabContents);
    const tabListEl = tabs.querySelector('[role=\'tablist\']');
    const dropdownEl = tabs.querySelector('select.account-select');
    const tabPanelEls = tabs.querySelectorAll('[role=\'tabpanel\']');
    // eslint-disable-next-line no-new
    new TabsManual(tabListEl, dropdownEl, tabPanelEls);
    return tabs;
}

export async function callUserApi(token, method = 'GET', payload = null) {
    const baseUrl = endPoints.apiUrl;
    const userApi = `${baseUrl}/adopt/api/User`;
    let result = null;
    const config = {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
    if (method !== 'GET') {
        config.body = JSON.stringify(payload);
    }
    try {
        const resp = await fetch(userApi, config);
        if (resp.status === 200) {
            result = await resp.json();
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error:', error);
    }
    return result;
}

export default async function decorate(block) {
    block.innerHTML = '';
    let initialUserData = {};
    const token = await acquireToken();
    if (token) {
        initialUserData = await callUserApi(token);
        block.append(await createTabComponent());
        block.querySelector('#favorites').append(await createAccountFavoritesPanel(token));
        block.querySelector('#searchalerts').append(await createSavedSearchPanel(token));
        block.querySelector('#survey').append(await createAccountSurveyPanel(block, token, initialUserData));
        block.querySelector('#inquiries').append(await createAccountInquiriesPanel(token));
    }
}
