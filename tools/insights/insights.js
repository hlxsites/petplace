async function runPlugin(){
    //populate url info, 
    const searchParams = new URLSearchParams(window.location.search);
    const url = searchParams.get('referrer');
    await getData(url.replace('https://', ''), 0, 7);
}

async function getData(url, offset, interval){
    fetch(`https://helix-pages.anywhere.run/helix-services/run-query@ci6232/rum-dashboard?domainkey=***REMOVED***&interval=${interval}&offset=${offset}&limit=4&url=${url}&exactmatch=true`)
    .then((res) => res.json())
    .then((resp) => {
        const metrics = ['s', '', 'ms', 'ms'];
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
    });
}

runPlugin()