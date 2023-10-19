//Display Functionality
function hideAllExcept(selector){
    //Hide Everything
    const formHandle = document.querySelector('.domainkey-form');
    const insightsHandle = document.querySelector('.insights-container')
    formHandle.style = 'display: none';
    insightsHandle.style = 'display: none';

    //Show Exceptional Component
    const customHandle = document.querySelector(selector);
    customHandle.style = 'display: block';
}

//Event Handlers
function deleteKey(evt){
    evt.preventDefault();
    localStorage.removeItem('domainkey');
    window.location.href = window.location.href;
}

function saveKey(evt){
    evt.preventDefault();
    localStorage.setItem('domainkey', evt.target.value);
}

function setOnClicks(){
    const saveHandle = document.getElementById('save-domainkey');
    const inputHandle = document.getElementById('domainkey-input')

    inputHandle.addEventListener('input', saveKey)
    saveHandle.onclick = (evt) => {
        window.location.href = window.location.href
    }
}

//Data Callbacks
function processVitalsCallback(resp){
    const ranges = {
        avglcp: [2500, 4000],
        avginp: [200, 500],
        avgcls: [0.1, 0.25],
      };
    const { data } =  resp.results;
    const { url, pageviews, avglcp, avgcls, avginp } = data[0];
    const urlInfo = document.querySelector('#url-info');
    const pv = document.querySelector('#pageviews');
    const cls = document.querySelector('#cls');
    const lcp = document.querySelector('#lcp');
    const inp = document.querySelector('#inp');

    urlInfo.textContent = url;
    pv.textContent = `Pageviews: ${pageviews}`;
    const numCLS = parseFloat(avgcls);
    const numLCP = parseInt(avglcp, 10)/1000.00;
    const numINP = parseFloat(avginp);

    numCLS <= ranges['avgcls'][0] ? cls.classList.toggle('pass') : numCLS <= ranges['avgcls'][1] ? cls.classList.toggle('okay') : cls.classList.toggle('fail');
    numLCP <= ranges['avglcp'][0] ? lcp.classList.toggle('pass') : numLCP <= ranges['avglcp'][1] ? lcp.classList.toggle('okay') : lcp.classList.toggle('fail');
    numINP <= ranges['avginp'][0] ? inp.classList.toggle('pass') : numINP <= ranges['avginp'][1] ? inp.classList.toggle('okay') : inp.classList.toggle('fail');

    cls.textContent = numCLS ;
    lcp.textContent = `${numLCP}ms`;
    inp.textContent = `${numINP}ms`;

    document.querySelector('.metric-group').style = 'display:block;';
}

function processSearchCallback(resp){
    /* */
}

function processConversionsCallback(resp){
    /* */
}

async function getInsights(url, domainkey, offset, interval){
    const insightsUrl = `https://helix-pages.anywhere.run/helix-services/run-query@ci6232/rum-dashboard?domainkey=${domainkey}&interval=${interval}&offset=${offset}&limit=1&url=${url}&exactmatch=true`;
    fetch(insightsUrl)
    .then((res) => res.json())
    .then(processVitalsCallback)
}

//Entry
async function runPlugin(){
    //Get All Info Necessary for Query
    const searchParams = new URLSearchParams(window.location.search);
    const url = searchParams.get('referrer').replace('https://', '');
    const domainkey = localStorage.getItem('domainkey');

    const deleteHandle = document.getElementById('delete-domainkey');
    deleteHandle.onclick = deleteKey;

    if(!domainkey){
        hideAllExcept('.domainkey-form');
        setOnClicks();
    } else{
        getInsights(url, domainkey, 0, 7);
    }
}

runPlugin()