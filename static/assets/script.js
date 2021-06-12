var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
new WOW().init();
var http = "http";
if (location.protocol == "https:")
  http = "https";
var submit = document.getElementById("submit");
var ipbox = document.getElementById("url");
var alias = document.getElementById("alias");
var url;
var opt;
var loader = document.getElementById("loader");
document.title = window.location.hostname + " | Shorten URL's with ease!";
submit.addEventListener("click", getURL);
function is_url(str) {
  var r = /^(?:(?:https?|http|www):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (r.test(str)) {
      document.getElementById("loader").style.display = "flex";
      submit.value = "Wait...";
      ipbox.value = "Processing ...";
      getShortID(str);
  }
  else {
      ipbox.value = "";
      alert("Invalid URL");
  }
}
function custom(str, opt) {
  var r = /^(?:(?:https?|http|www):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  var letterNumber = /^[0-9a-zA-Z]+$/;
  if (r.test(str) && letterNumber.test(opt)) {
      document.getElementById("loader").style.display = "flex";
      submit.value = "Wait...";
      ipbox.value = "Processing ...";
      alias.value = "Processing ...";
      getCustom(str, opt);
  }
  else {
      ipbox.value = "";
      alias.value = "";
      alert("Invalid URL or Alias");
  }
}
function getURL() {
  url = ipbox.value;
  opt = alias.value;
  if (opt != "") {
      custom(url, opt);
  }
  else {
      is_url(url);
  }
}
function getShortID(url) {
  return __awaiter(this, void 0, void 0, function () {
      var target, response, _a, r;
      return __generator(this, function (_b) {
          switch (_b.label) {
              case 0: return [4 /*yield*/, encodeURI(url)];
              case 1:
                  url = _b.sent();
                  submit.disabled = true;
                  target = http + "://" + window.location.host + "/p/" + url;
                  return [4 /*yield*/, fetch(target).then(function (response) { return response.json(); })];
              case 2:
                  response = _b.sent();
                  _a = ipbox;
                  return [4 /*yield*/, http + "://" + window.location.host + "/" + response];
              case 3:
                  _a.value = _b.sent();
                  return [4 /*yield*/, http + "://" + window.location.host + "/" + response];
              case 4:
                  r = _b.sent();
                  submit.value = "copy";
                  ipbox.select();
                  document.execCommand("copy");
                  submit.value = "Copied !";
                  document.getElementById("ta").innerHTML += r + "\r\n";
                  M.toast({
                      html: "Copied to Clipboard!",
                      inDuration: 1000,
                      classes: "toast"
                  });
                  document.getElementById("loader").style.display = "none";
                  setTimeout(function () {
                      submit.value = "Shorten";
                      submit.disabled = false;
                      ipbox.value = "";
                  }, 2000);
                  return [2 /*return*/];
          }
      });
  });
}
function getCustom(url, opt) {
  return __awaiter(this, void 0, void 0, function () {
      var target, response, _a, r;
      return __generator(this, function (_b) {
          switch (_b.label) {
              case 0: return [4 /*yield*/, encodeURI(url)];
              case 1:
                  url = _b.sent();
                  target = http + "://" + window.location.host + "/custom/" + url + "%3A%3A%3A69" + opt;
                  return [4 /*yield*/, fetch(target).then(function (response) { return response.json(); })];
              case 2:
                  response = _b.sent();
                  if (!(response == true)) return [3 /*break*/, 5];
                  submit.disabled = true;
                  _a = ipbox;
                  return [4 /*yield*/, http + "://" + window.location.host + "/" + opt];
              case 3:
                  _a.value = _b.sent();
                  return [4 /*yield*/, http + "://" + window.location.host + "/" + opt];
              case 4:
                  r = _b.sent();
                  submit.value = "copy";
                  ipbox.select();
                  document.execCommand("copy");
                  submit.value = "Copied !";
                  document.getElementById("ta").innerHTML += r + "\r\n";
                  document.getElementById("loader").style.display = "none";
                  M.toast({
                      html: "Copied to Clipboard!",
                      inDuration: 1000,
                      classes: "toast"
                  });
                  setTimeout(function () {
                      submit.value = "Shorten";
                      ipbox.value = "";
                      submit.disabled = false;
                      alias.value = "";
                  }, 2000);
                  return [3 /*break*/, 6];
              case 5:
                  /* window.alert(`${window.location.hostname}/${opt} already taken :(`); */
                  ipbox.value = "";
                  alias.value = "";
                  document.getElementById("loader").style.display = "none";
                  M.toast({
                      html: window.location.hostname + "/" + opt + " already taken :(",
                      inDuration: 1000,
                      classes: "red"
                  });
                  _b.label = 6;
              case 6: return [2 /*return*/];
          }
      });
  });
}
