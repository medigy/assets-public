class SocialProofReactableAcquireArgs {
  constructor(metricName, metricQuery) {
    this.metricName = metricName || "medigy_social_proof";
    let domain = new URL(window.location.href);
    const domainPath = domain.pathname;
    domain = domain.hostname;
    this.metricQuery = metricQuery || domainPath;
  }
}

class SocialProofReactableStoreArgs {
  constructor(options) {
    this.metricName = options.metricName || "medigy_social_proof";
    this.metricJobName = options.metricJobName || this.metricName;
    let domain = new URL(window.location.href);
    const domainPath = domain.pathname;
    domain = domain.hostname;
    this.metricInstance = options.metricInstance || domain;
    this.accessToken =
      options.accessToken || getSocialProofCookie("medigyApiAccessToken");
    this.fingerPrintKey = options.fingerPrintKey || "fingerPrint";
    this.fingerPrintValue =
      options.fingerPrintValue || getSocialProofCookie("finger");
    this.socialProofTypeKey = options.socialProofTypeKey || "type";
    this.socialProofTypeValue = options.socialProofTypeValue || domainPath;
    this.emojiNameKey = options.emojiNameKey || "emojiName";
    this.socialProofKey = options.socialProofKey || "socialProof";
    this.socialProofValue = options.socialProofValue || domainPath;
    this.groupKey = options.groupKey || "group";
    this.groupValue = options.groupValue || "";
    this.sourceKey = options.sourceKey || "source";
    this.sourceValue = options.sourceValue || domain;
    this.userIdKey = options.userIdKey || "userId";
    this.userIdValue = options.userIdValue || getSocialProofCookie("personid");
    this.createdAtKey = options.createdAtKey || "createdAt";
    this.createdAtValue = options.createdAtValue || "";
    this.personNameKey = options.personNameKey || "personName";
    this.personNameValue =
      options.personNameValue ||
      getSocialProofCookie("firstname") ||
      "Anonymous";
  }
}

class SocialProofReactable {
  constructor(options) {
    this.label = options.label || "";
    this.emoji = options.emoji || "";
    this.showLabel = options.showLabel || "yes";
    this.showCountMin = options.showCountMin || 1;
    this.showReactors = options.showReactors || "yes";
    this.target = options.target || "www.medigy.com";
  }
}

class SocialProofReactableState {
  constructor(reactable, count, reactors) {
    this.reactable = reactable;
    this.count = count;
    this.reactors = reactors;
  }
}


class SocialProof {
  constructor(reactables, elementId, apiEndpoint, activeUserId) {

    this.reactables = reactables;
    this.apiEndpoint =
      apiEndpoint || "https://prime.dcp.infra.experimental.medigy.com/graphql";
    this.activeUserId = activeUserId || getSocialProofCookie("personid");
    this.elementId = elementId || "emoji-vanilla";
    this.reactablesStates = [];
    this.getStates(this.reactables);
  }

  getStates(reactables) {
    for (const r of reactables) {
      let count = 0;
      let reactors = [];
      // fetch object
      this.acquireArgs = new SocialProofReactableAcquireArgs() || ""; 

      const getSocialProofGraphQLQuery = JSON.stringify({
        query: `query PromData {\r\n  getPromData(\r\n    getPrometheusInput: {metricName: "${
          this.acquireArgs.metricName
        }", metricQuery: "{type= \\"${
          this.acquireArgs.metricQuery
        }\\",emojiName= \\"${slugify(
          r.label
        )}\\"}[10y]", groupByParam:["createdat"]}\r\n  ) {\r\n      status\r\n      error\r\n      message\r\n      data\r\n     }\r\n}`,
        variables: {},
      });
      fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "cache-control": "no-cache",
        },
        body: getSocialProofGraphQLQuery,
      })
        .then((res) => res.json())
        .then((result) => {
          const response = JSON.parse(result.data.getPromData.data);
          count = response.length;
          for (const socialProofResponseData of response) {
            reactors.push(socialProofResponseData.personNameModified);
          }
          const unique = (value, index, self) => {
            return self.indexOf(value) === index;
          };
          const uniqueReactors = reactors.filter(unique);
          const rs = new SocialProofReactableState(r, count, uniqueReactors);
          this.reactablesStates.push(rs);
          const spElement = document.querySelector("social-proof");
          this.apply(spElement);
        });
    }
  }
	apply(element) {
    element.innerHTML = "";
    const spr = document.createElement("social-proof-reactable");
    spr.reactableElement = this.reactablesStates;
    element.appendChild(spr);
	}

}
class SetSocialProof {
  constructor(elementObjct, apiEndpoint, activeUserId) {
    this.elementObjct = elementObjct;
    this.apiEndpoint =
      apiEndpoint || "https://prime.dcp.infra.experimental.medigy.com/graphql";
    this.activeUserId = activeUserId || getSocialProofCookie("personid");
    const storeArgs = new SocialProofReactableStoreArgs("");
    this.setStates(storeArgs);
  }

  setStates(storeArgs) {
    const timestamp = Date.now();
    const metricData = `[
      { "key": "${storeArgs.fingerPrintKey}", "value": "${
      storeArgs.fingerPrintValue
    }" },
      {
        "key": "${storeArgs.socialProofTypeKey}",
        "value": "${storeArgs.socialProofTypeValue}"
      },
      {
        "key": "${storeArgs.emojiNameKey}",
        "value": "${this.elementObjct.getAttribute("data-emoji")}"
      },
      { "key": "${storeArgs.socialProofKey}", "value": "${
      storeArgs.socialProofValue
    }" },
      { "key": "${storeArgs.groupKey}", "value": "${storeArgs.groupValue}" },
      { "key": "${storeArgs.sourceKey}", "value": "${storeArgs.sourceValue}" },
      { "key": "createdat", "value": "${timestamp}" },
      { "key": "${storeArgs.personNameKey}", "value": "${
      storeArgs.personNameValue
    }" }
    ]`;
    const setSocialProofGraphQLQuery = JSON.stringify({
      query: `mutation{
        addAnonymousPromData(input:{
        addAnonymousPromInput:{
        metricName:"${storeArgs.metricName}"
        metricJobname:"${storeArgs.metricName}"
        metricInstance:"${storeArgs.metricInstance}"
        metricData:${JSON.stringify(metricData)}
        }
        }) {
        addAnonymousPromDataResult{
        status
        error
        message
        }
        }
        }`,
    });
    fetch(this.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "cache-control": "no-cache",
      },
      body: setSocialProofGraphQLQuery,
    })
      .then((res) => res.json())
      .then((result) => {
        const currentCount = parseInt(
          this.elementObjct.childNodes[1].childNodes[0].childNodes[1]
            .childNodes[1].innerHTML
        );
        let updatedCount = currentCount + parseInt(1);
        this.elementObjct.childNodes[1].childNodes[0].childNodes[1].childNodes[1].innerHTML =
          updatedCount;
        this.elementObjct.childNodes[1].childNodes[0].childNodes[1].childNodes[1].style.visibility =
          "visible";
        if (this.elementObjct.nextSibling.childNodes[1].innerHTML == "")
          this.elementObjct.nextSibling.childNodes[1].innerHTML =
            storeArgs.personNameValue;
        else if (
          this.elementObjct.nextSibling.childNodes[1].innerHTML.includes(
            storeArgs.personNameValue
          ) != true
        )
          this.elementObjct.nextSibling.childNodes[1].innerHTML +=
            ", " + storeArgs.personNameValue;
      });
  }
}

class SocialProofShadowElement extends HTMLElement {
	constructor() {
	  super();
	  this.spShadowRoot = this.attachShadow({ mode: 'open' });
	}
  set reactableElement(reactablesStates){
    let emojiTag = `<link rel="stylesheet preload" as="style"  href="https://cdnjs.cloudflare.com/ajax/libs/design-system/2.14.2/styles/salesforce-lightning-design-system.min.css">`;
    for (const rs of reactablesStates) {
		  const r = rs.reactable;
		  const label = slugify(r.label);
		  const reactors = rs.reactors; // Todo: should only show when logged in
		  const emojiCount = rs.count;
		  emojiTag += `<span class="slds-m-right_x-small slds-m-right_x-bottom" style="position: relative;">
		  <a href="javascript:void(0);" class="tooltip-info-link social-proof-emoji ${label}_click"
		    id="${label}_click" data-emoji="${label}" onmouseover="displayTooltip(this);" onmouseout="displayOffTooltip(this);" onclick="setSocialProof(this);">
		    <span class="slds-badge font-size-10 ${label}_Button" id="${label}_Button">`;
		  if (r.showLabel == "yes") {
		    emojiTag += `<span>${r.label}<span>&nbsp;`;
		  }
		  emojiTag += r.emoji;
		  if (r.showCountMin <= emojiCount) {
		    emojiTag += `<span class="slds-m-left_xx-small ${label}_emojiCount" id="${label}_emojiCount">${emojiCount}</span>`;
		  } else {
		    emojiTag += `<span class="slds-m-left_xx-small ${label}_emojiCount" id="${label}_emojiCount" style="visibility:hidden" >${emojiCount}</span>`;
		  }
		  emojiTag += `</span></a>`;
		  if (r.showReactors == "yes") {
		    emojiTag += `<div class="slds-popover slds-popover_tooltip slds-nubbin_bottom-left slds-rise-from-ground tooltip-info"
		    role="tooltip"
		    style="position: absolute; left: 0px; min-width: 210px; line-height: 15px; top: -32px; display: none;">
		    <div class="slds-popover__body ${label}_tooltip" id="${label}_tooltip">${reactors}</div>
		  </div>`;
		  }
		  emojiTag += `</span>`;
		}
    this.spShadowRoot.innerHTML = emojiTag;
  }
}
customElements.define("social-proof-reactable", SocialProofShadowElement);

function displayTooltip(objc) {
  if (objc.nextSibling.childNodes[1].innerHTML != "") {
    objc.nextSibling.style.display = "block";
    const toolTipHeight =
      "-" + (parseInt(objc.nextSibling.offsetHeight) + parseInt(18)) + "px";
    objc.nextSibling.style.top = toolTipHeight;
  }
}

function displayOffTooltip(objc) {
  objc.nextSibling.style.display = "none";
}

function setSocialProof(elemntObjc) {
  let setSocialProof = new SetSocialProof(elemntObjc);
}

function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, "");
  str = str.toLowerCase();
  str = str
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return str;
}

function getSocialProofCookie(key) {
  const keyValue = document.cookie.match("(^|;) ?" + key + "=([^;]*)(;|$)");
  return keyValue ? keyValue[2] : null;
}

// initialization and call method

//     const sp = new SocialProof([new SocialProofReactable({ "label": "View", "emoji": "&#128083;", "showLabel": "yes", "showCountMin": 1, "showReactors": "yes" }), new SocialProofReactable({ "label": "I Interested In", "emoji": "&#128077;", "showLabel": "yes", "showCountMin": 1, "showReactors": "yes" })], "emoji-vanilla");


new SocialProof([new SocialProofReactable({ "label": "View", "emoji": "&#128083;", "showLabel": "yes", "showCountMin": 1, "showReactors": "yes" }), new SocialProofReactable({ "label": "I Interested In", "emoji": "&#128077;", "showLabel": "yes", "showCountMin": 1, "showReactors": "yes" })])