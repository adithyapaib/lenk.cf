/*   new WOW().init();
      var http: string = "http";
      if (location.protocol == "https:") http = "https";
      var submit = (<HTMLInputElement>document.getElementById("submit"));
      var ipbox = (<HTMLInputElement>document.getElementById("url"));
      var alias = (<HTMLInputElement>document.getElementById("alias"));
      var url;
      var opt;
      var loader = document.getElementById("loader")
      document.title = window.location.hostname + " | Shorten URL's with ease!";
      submit.addEventListener("click", getURL);
      function is_url(str) {
        let r =
          /^(?:(?:https?|http|www):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (r.test(str)) {
          document.getElementById("loader").style.display = "flex";
          submit.value = "Wait...";
          ipbox.value = "Processing ...";
          getShortID(str);
        } else {
          ipbox.value = "";
          alert("Invalid URL");
        }
      }
      function custom(str, opt) {
        let r =
          /^(?:(?:https?|http|www):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        var letterNumber = /^[0-9a-zA-Z]+$/;
        if (r.test(str) && letterNumber.test(opt)) {
          document.getElementById("loader").style.display = "flex";
          submit.value = "Wait...";
          ipbox.value = "Processing ...";
          alias.value = "Processing ...";
          getCustom(str, opt);
        } else {
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
        } else {
          is_url(url);
        }
      }
      async function getShortID(url) {
        url = await encodeURI(url);
        submit.disabled = true;
        let target = `${http}://${window.location.host}/p/${url}`;
        let response = await fetch(target).then((response) => response.json());
        ipbox.value = await `${http}://${window.location.host}/${response}`;
        var r = await `${http}://${window.location.host}/${response}`;
        submit.value = "copy";
        ipbox.select();
        document.execCommand("copy");
        submit.value = "Copied !";
        document.getElementById("ta").innerHTML += r + "\r\n";
        M.toast({
          html: "Copied to Clipboard!",
          inDuration: 1000,
          classes: "toast",
        });
        document.getElementById("loader").style.display = "none";
        setTimeout(function () {
          submit.value = "Shorten";
          submit.disabled = false;
          ipbox.value = "";
        }, 2000);
      }
      async function getCustom(url, opt) {
        url = await encodeURI(url);
        let target = `${http}://${window.location.host}/custom/${url}%3A%3A%3A69${opt}`;
        let response = await fetch(target).then((response) => response.json());
        if (response == true) {
          submit.disabled = true;
          ipbox.value = await `${http}://${window.location.host}/${opt}`;
          var r = await `${http}://${window.location.host}/${opt}`;
          submit.value = "copy";
          ipbox.select();
          document.execCommand("copy");
          submit.value = "Copied !";
          document.getElementById("ta").innerHTML += r + "\r\n";
          document.getElementById("loader").style.display = "none";
          M.toast({
            html: "Copied to Clipboard!",
            inDuration: 1000,
            classes: "toast",
          });
          
          setTimeout(function () {
            submit.value = "Shorten";
            ipbox.value = "";
            submit.disabled = false;
            alias.value = "";
          }, 2000);
        } else {
          /* window.alert(`${window.location.hostname}/${opt} already taken :(`); 
          ipbox.value = "";
          alias.value = "";
          document.getElementById("loader").style.display = "none";
          M.toast({
            html: `${window.location.hostname}/${opt} already taken :(`,
            inDuration: 1000,
            classes: "red",
          });
        }
      } */