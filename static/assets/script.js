var loader = document.getElementById("loader");
document.title = window.location.hostname + " | Shorten URL's with ease!";
var http = "http";
if (location.protocol == "https:") http = "https";
var submitBtn = document.getElementById("submit");
var urlInput = document.getElementById("url");
var aliasInput = document.getElementById("alias");
var opt;
aliasInput.value == "";
submitBtn.addEventListener("click", submit);
function submit() {
  let str = urlInput.value;
  let r =
    /^(?:(?:https?|http|www):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (r.test(str)) {
    if (aliasInput.value != "") {
      var letterNumber = /^[0-9a-zA-Z]+$/;
      if (letterNumber.test(aliasInput.value))
        getCustomURL(aliasInput.value, str);
      else {
        aliasInput.value = "";
        alert("Invalid Alias");
      }
    } else {
      generateURL(str);
    }
  } else {
    urlInput.value = "";
    aliasInput.value = "";
    alert("Invalid URL");
  }
}
async function generateURL(url) {
  submitBtn.disabled = true;
  loader.style.display = "flex";
  let target = `${http}://${window.location.host}/p/${encodeURIComponent(url)}`;
  let response = await fetch(target).then((response) => response.json());
  urlInput.value = await `${http}://${window.location.host}/${response}`;
  var r = await `${http}://${window.location.host}/${response}`;
  submitBtn.value = "copy";
  urlInput.select();
  document.execCommand("copy");
  submitBtn.value = "Copied !";
  loader.style.display = "none";
  submitBtn.disabled = false;
  M.toast({
    html: "Copied to Clipboard!",
    inDuration: 1000,
    classes: "toast",
  });
  setTimeout(() => {
    urlInput.value = "";
    aliasInput.value = "";
    submitBtn.value = "Shorten";
  }, 2500);
}
async function getCustomURL(customID, url) {
  url = encodeURIComponent(url);
  submitBtn.disabled = true;
  loader.style.display = "flex";
  let customURL = await `${customID.length}_${customID}${url}`;
  let target = `${http}://${window.location.host}/custom/${customURL}`;
  console.log(target);
  let response = await fetch(target).then((response) => response.json());
  loader.style.display = "none";
  submitBtn.disabled = false;
  if (response == 0) {
    aliasInput.value = "";
    M.toast({
      html: `${window.location.hostname}/${customID} already taken :(`,
      inDuration: 1000,
      classes: "red",
    });
  } else {
    submit.disabled = false;
    urlInput.value = await `${http}://${window.location.host}/${customID}`;
    submit.value = "copy";
    urlInput.select();
    document.execCommand("copy");
    submitBtn.value = "Copied !";
    submitBtn.disabled = false;
    M.toast({
      html: "Copied to Clipboard!",
      inDuration: 1000,
      classes: "toast",
    });
    setTimeout(() => {
      urlInput.value = "";
      aliasInput.value = "";
      submitBtn.value = "Shorten";
    }, 2500);
  }
}
window.addEventListener("load", () => {
  registerSW();
});
async function registerSW() {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("/serviceworker");
    } catch (e) {
      console.log(e);
    }
  }
}

let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallPromotion();
});
/* let t = document.getElementById('head');
      t.innerHTML = ` ${window.location.hostname} <img src="/dog" width="55" height="55" alt="husky"/>`

 */
