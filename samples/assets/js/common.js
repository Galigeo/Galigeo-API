
/**
 * Get an url parameter
 * 
 * @param key Name of the parameter
 * @param byDefault Default value if the parameter is missing
 * @returns The value of the parameter key
 */
function getUrlParam(key, byDefault) {
	var params = getUrlParams();
	var split = params.split('&');
	for (var j = 0; j < split.length; j++) { var pair=split[j].split('=' ); if (pair.length !==2) continue; if (pair[0]===key) { var result=pair[1]; if (!String.prototype.endsWith) { String.prototype.endsWith=function(suffix) { return this.indexOf(suffix, this.length - suffix.length) !==-1; }; } if (result.endsWith('#!')) result=result.substring(0, result.length - 2); return result; } } return byDefault; } function getUrlParams() { var params=location.search; if (location.hash && location.hash !=="" ) { params=params + location.hash; } if (params.indexOf('?')===0) params=params.substring(1); return params; } 
  
  
  function setBanner() { 
    let breadcumb = document.title === 'Galigeo API Samples'?'':`<li class="slds-breadcrumb__item">
    <a href="${window.location.href}">${document.title}</a>
  </li>`;
    $('#navBar').html(`
<div class="slds-tabs_card">
  <div class="slds-page-header">
    <div class="slds-page-header__row">
      <div class="slds-page-header__col-title">
        <div class="slds-media">
          <div class="slds-media__figure">
            <span class="slds-icon_container">
              <img src="logogaligeo.png"/>
            </span>
          </div>
          <div class="slds-media__body">
            <div class="slds-page-header__name">
              <div class="slds-page-header__name-title">
                <h1 class="slds-p-left_medium slds-p-top_x_small">
                  <span class="slds-page-header__title slds-truncate" title="Galigeo API">Galigeo API</span>
                  <span>Version 2.2.1</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="slds-page-header__col-actions"> 
        <div class="slds-page-header__controls">
        </div>
      </div>
    </div>
    <div class="slds-page-header__row">
      <div class="slds-page-header__col-meta">
        <nav role="navigation" aria-label="Breadcrumbs">
          <ol class="slds-breadcrumb slds-list_horizontal slds-wrap">
            <li class="slds-breadcrumb__item">
              <a href="index.html">API Samples</a>
            </li>
            ${breadcumb}
          </ol>
        </nav>
      </div>
      <div class="slds-page-header__col-controls">
        <div class="slds-page-header__controls">
          <div class="slds-page-header__control">
            <div class="slds-dropdown-trigger slds-dropdown-trigger_click">
              <button class="slds-button slds-button_neutral" onclick="window.location.href='doc'">Documentation</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`);
}

