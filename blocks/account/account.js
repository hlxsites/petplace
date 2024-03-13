/* eslint-disable indent */
import TabsManual from './tabs-manual.js';
import endPoints from '../../variables/endpoints.js';
import { acquireToken } from '../../scripts/lib/msal/msal-authentication.js';
import { bindAccountDetailsEvents, createAccountDetailsPanel } from './account-details.js';
import { buildBlock, decorateBlock, loadBlock } from '../../scripts/lib-franklin.js';
async function createTabComponent() {
    const tabArray = [
        { title: 'Account Details', hash: 'details' },
        { title: 'Search Alerts', hash: 'searchalerts' },
        { title: 'Favorites', hash: 'favorites' },
        { title: 'Pet Match Survey', hash: 'survey' },
    ];
    const tabs = document.createElement('div');
    tabs.className = 'account-tabs';
    const title = document.createElement('h2');
    title.className = 'account-tabs-title';
    title.textContent = 'My Account';
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
    new TabsManual(tabListEl, dropdownEl, tabPanelEls);
    return tabs;
}

export async function callUserApi(token, method = 'GET', payload = null) {
    const baseUrl = endPoints.apiUrl;
    const userApi = `${baseUrl}/adopt/api/User`;
    let result = null;
    const config = {
        method: method,
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
        block.querySelector('#details').append(await createAccountDetailsPanel(initialUserData));
        await bindAccountDetailsEvents(block, token, initialUserData);

        const surveyContainer =  block.querySelector('#survey')
        const surveyBlock = buildBlock('pet-survey', '');
        surveyContainer.append(surveyBlock);
        decorateBlock(surveyBlock);
        await loadBlock(surveyBlock);
    }   
}