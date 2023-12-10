let domain,resolvedIP,obj;
let ipv4Button = document.getElementById('ipv4');
let domainButton = document.getElementById('domain') ;
let aboutButton = document.getElementById('about') ;
let serverIP = document.getElementById('serverIP') ;
let country = document.getElementById('country') ;
let countryCode = document.getElementById('countryCode') ;
let latitude = document.getElementById('latitude') ;
let longtitude = document.getElementById('longtitude') ;
let timezone = document.getElementById('timezone') ;
let org = document.getElementById('organization') ;
let asn_Number = document.getElementById('ASN') ;


chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  handleTab(tabs[0]);
});


function handleTab(tab) {
  if (tab && tab.url) {
    var tabUrl = tab.url;
    domain = getExtractUrl(tabUrl);
    domain_resolve(domain);
  } else {
    console.log("No URL found");
  }
}


function getExtractUrl(tab) {
  let parsedUrl = new URL(tab);
  parsedUrl.hostname = parsedUrl.hostname.replace(/^www\./, '');
  return parsedUrl.hostname;
}


function domain_resolve(domain) {
  const googleDnsApiUrl = `https://dns.google/resolve?name=${domain}`;

  fetch(googleDnsApiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.Answer) {
        let addresses = data.Answer ;
        ip_fetch(addresses) ;
      } else {
        console.error(`Error resolving ${domain}`);
      }
    })
    .catch(error => console.error('Fetch error:', error));
}


function ip_fetch(address){
   let length_Array = address.length ;
   if(length_Array == 1){
     resolvedIP = address[0].data ;
     load(resolvedIP) ;
   }else{
     resolvedIP = address[1].data ;
     load(resolvedIP) ;
   }    

}


 async function load (resolvedIP) {
  let host = "https://api.seeip.org/geoip/";
  ipv4Button.style.backgroundColor = '#0d6125';
  let result = await fetch_ip(host,resolvedIP);

  if (result) {
    document.getElementById('imgContainer').style.display   =  'none';
    document.getElementById("tableContainer").style.display =  'block';
  }

   data_insert(result) ;
}

function data_insert(result){

   obj = JSON.parse(result) ;
  serverIP.innerText = obj.ip ;
  country.innerText = obj.country ;
  countryCode.innerText = obj.country_code ;
  latitude.innerText = obj.latitude ;
  longtitude.innerText = obj.longitude ;
  timezone.innerText =obj.timezone ;
  org.innerText =  obj.organization
  asn_Number.innerText =  obj.asn ;
      
}

async function fetch_ip(host,resolvedIP) {
  return await new Promise(async function (response, reject) {
    host = host + `${resolvedIP}`;
    let res = new XMLHttpRequest();
    res.open('GET', host, true);
    res.onreadystatechange = function () {
      if (res.readyState !== 4 || res.status != 200) return;
      response(res.responseText);
    };
    res.send();
  });
}

ipv4Button.addEventListener('click',()=>{
      domainButton.style.backgroundColor = "#2ea44f" ;
      aboutButton.style.backgroundColor = "#2ea44f" ;
      ipv4Button.style.backgroundColor = "#0d6125" ;
      serverIP.innerText = obj.ip  ;
      document.getElementById('tableContainer').style.display = 'block' ;
      document.getElementById('aboutContainer').style.display = 'none' ;
      
}) ;

domainButton.addEventListener("click",()=>{
      ipv4Button.style.backgroundColor = "#2ea44f" ;
      aboutButton.style.backgroundColor ="#2ea44f" ;
      domainButton.style.backgroundColor = "#0d6125"  ;
      serverIP.innerText = domain ;
      document.getElementById('tableContainer').style.display = 'block' ;
      document.getElementById('aboutContainer').style.display = 'none' ;
}) ;

aboutButton.addEventListener('click',()=>{
     
     domainButton.style.backgroundColor='#2ea44f' ;
     aboutButton.style.backgroundColor ="#0d6125" ;
     document.getElementById('tableContainer').style.display = 'none' ;
     document.getElementById('aboutContainer').style.display = 'block' ;
})

