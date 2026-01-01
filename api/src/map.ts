import Extent from "./extent";
import Layer from "./layer";
import Messenger from "./messenger";
import Listener from "./listener";
import { MapParameters, Message, Style } from "./model";

/**
 * Map is the root object of the API. To get started, you need
 * to create a instance of Map then call map.load() to link it with
 * the map viewer.
 */
class Map extends Listener {
  /**
   * The refresh ID is used to update the map data.
   */
  public refreshId: string;

  private readonly element: HTMLElement;
  private readonly options: MapParameters;
  private iframe: HTMLIFrameElement;
  private messenger: Messenger;
  private loaded: boolean = false;

  /**
   * Creates the main Map and define its parameters.
   *
   * @param element ID of the div that will contain the map
   * @param options See {@link MapParameters} for the map parameters
   */
  constructor(element: string | HTMLElement, options: MapParameters) {
    super();
    console.log("Welcome to Galigeo");
    this.options = options;
    if (typeof element === "string")
      this.element = document.getElementById(element);
    else this.element = element;

    if (!options.lang) options.lang = this.getLanguage();

    if (!options.url) options.url = "https://showroom.galigeo.com/Galigeo";
    if (options.id && !options.mapId) options.mapId = options.id; // handle legacy parameter
    if (options.name && !options.mapId)
      options.mapId = options.name
        .toUpperCase()
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, "");

    if (this.options.url.endsWith("/")) {
      this.options.url = this.options.url.slice(0, -1);
    }
    if (!this.options.data) this.options.data = [];

    for (const dataset of this.options.data) {
      if (dataset.url) {
        dataset.url = this.fixRelativeUrl(dataset.url);
      }
    }
  }

  /**
   * Link the map with an instance of the map viewer.
   * The map cannot be used until the load is not
   * terminated.
   *
   * @returns a promise when the map is loaded
   */
  async load() {
    console.log("Loading Map");
    try {
      const json = await (
        await fetch(this.options.url + "/api/openMap/encoded", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          mode: "cors",
          body: `status=200&lang=${this.getLanguage()}&data=${encodeURIComponent(JSON.stringify(this.options))}`,
        })
      ).json();

      if (!json.message) {
        await this.setMapInstance(json);
        return this;
      } else {
        this.showError(json.message, null);
      }
    } catch (err) {
      this.showError("Unable to access Galigeo", err);
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }

  /**
   * Inject the result of the openMap/encoded API into the map. In most cases, this method is called by load() automatically.
   * @param json Result of the openMap/encoded API
   * @returns
   */
  async setMapInstance(json: any) {
    this.iframe = this.createIframe(this.element, json);
    this.messenger = new Messenger(this.iframe, this.options.timeout);
    this.refreshId = json.refreshId;
    this.registerEvents();

    await this.messenger.waitMapIsLoad();
    console.log("API- Map loaded", json);
    this.loaded = true;
    this.setMapControlsVisible(false);
    return this;
  }

  /**
   * Update the current map without having to reload it.
   * When this method is used to update the map data, the layers
   * are updated without having to reload the map.
   *
   * @param mapParameters
   */
  public update(mapParameters: MapParameters) {
    if (!this.refreshId || !this.loaded)
      throw new Error("Data update not available");
    return new Promise((resolve, reject) => {
      fetch(
        this.options.url + "/api/openMap/encoded?refreshId=" + this.refreshId,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: `status=200&lang=${navigator.language
            }&data=${encodeURIComponent(JSON.stringify(mapParameters))}`,
        }
      )
        .then((res) =>
          res.json().then((json) => {
            if (!json.message) {
              resolve(json);
            } else {
              reject(
                new Error(
                  typeof json.message === "string"
                    ? json.message
                    : JSON.stringify(json)
                )
              );
            }
          })
        )
        .catch((err) => {
          this.showError("Unable to update data", err);
          reject(new Error(err instanceof Error ? err.message : String(err)));
        });
    });
  }
  private showError(msg: string, err: any) {
    console.error("Failed to load map", msg, err);
    // clean up dom when showing error
    const root: HTMLElement = this.element;
    while (root.firstChild) {
      root.removeChild(root.firstChild);
    }

    // Création du conteneur d'erreur en DOM pur
    const errorDiv = document.createElement("div");
    errorDiv.id = "galigeoError";
    errorDiv.style.height = "100%";
    errorDiv.style.textAlign = "center";
    errorDiv.style.padding = "30px";
    errorDiv.style.backgroundImage =
      "linear-gradient(135deg, #2ecc71 0%, #27a0ad 100%)";
    errorDiv.style.color = "white";
    errorDiv.style.fontSize = "x-large";

    const h4 = document.createElement("h4");
    h4.textContent = `Unable to access Galigeo from ${this.options.url}`;
    errorDiv.appendChild(h4);

    const pMsg = document.createElement("p");
    pMsg.textContent = msg;
    errorDiv.appendChild(pMsg);

    const pErr = document.createElement("p");
    pErr.textContent = err ? err.toLocaleString() : "";
    errorDiv.appendChild(pErr);

    root.appendChild(errorDiv);
  }
  /**
   *
   * @returns true if the map is ready to use
   */
  isLoaded(): boolean {
    return this.loaded;
  }
  /**
   * Refresh the map. This function is useful to see data updated on the map.
   *
   */
  refresh() {
    return this.messenger.postMessage("refresh", {});
  }
  /**
   * Set the extent of the map
   * @param extent The extent to set
   */
  setExtent(extent: Extent) {
    return this.messenger.postMessage("setExtent", extent);
  }
  /**
   * Zoom to a specific location using fly method
   * @param x x coordinate to zoom in
   * @param y y coordinate to zoom in
   * @param zoom zoom level used in the zoom
   */
  flyTo(x: number, y: number, zoom: number) {
    return this.messenger.postMessage("flyTo", { x, y, zoom });
  }
  /**
   * Zoom to a specific location without animations
   * @param x x coordinate to zoom in
   * @param y y coordinate to zoom in
   * @param zoom zoom level used in the zoom
   */
  zoomTo(x: number, y: number, zoom: number) {
    return this.messenger.postMessage("zoomTo", { x, y, zoom });
  }
  /**
   * Take a screenshot of the map
   * @param {String} title of screen saved
   * @param {Boolean} savePng save the png in your disc
   * @param {Boolean} withLegend add legend to print
   */
  print(withLegend: boolean, savePng: boolean, title: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.messenger
        .postMessage("print", { withLegend, savePng, title })
        .then((textBlob) => {
          resolve(textBlob);
        });
    });
  }
  /**
   * enable navigation like zoom & pan ... when it's disabled
   */
  enableMapNavigation() {
    return this.messenger.postMessage("enableMapNavigation", {});
  }
  /**
   * disable navigation like zoom & pan ... when it's enabled
   */
  disableMapNavigation() {
    return this.messenger.postMessage("disableMapNavigation", {});
  }
  /**
   * Define the visibility of the vertical menu (top left of the viewer).
   * This option is useful to display a "minimal" embeded map.
   * @param visible Set to false to hide the menu (default true)
   */
  setMenuVisible(visible: boolean) {
    return this.messenger.postMessage("setMenuVisible", visible);
  }
  /**
   * Define the visibility for the buttons at the bottom rights on the map.
   * Note that the zoom in/out buttons and the 3D button are always visible.
   *
   * @param visible Set to true to show all controls (default false)
   */
  setMapControlsVisible(visible: boolean) {
    return this.messenger.postMessage("setMapControlsVisible", visible);
  }
  /**
   * Define the visibility of the open in new tab button at
   * the bottom right.
   *
   * @param visible Set to true to display the control
   */
  setOpenNewTabVisible(visible: boolean) {
    return this.messenger.postMessage("setOpenNewTabVisible", visible);
  }
  /**
   * Set the basemap on the map. The list of basemap parameters is described on the
   * main product {@link https://doc.galigeo.com/G21_0/GGO/USER_GUIDE/en/#t=Basemaps_Configuration.htm&rhsearch=basemap&rhhlterm=basemap&rhsyns=%20|documentation}.
   * @param {String}  basemap name of the basemap
   */
  setBasemap(basemap: string) {
    return this.messenger.postMessage("setBasemap", basemap);
  }
  addDataUrl(url: string, name: string) {
    if (this.isLoaded())
      throw new Error("Cannot add new data once the map is loaded");
    this.options.data.push({
      format: "link",
      url: this.fixRelativeUrl(url),
      name: name,
    });
  }
  /**
     * Add a array of geojson features to the map. This function adds a new layer on the map.
     * @param {Object[]} features 
     * - ex: lines [{
      "type": "Feature",
      "properties": {
        "party": "abc",
        "popupContent": "popupContent !!!!!!!"
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
      }
    }, {
      "type": "Feature",
      "properties": {
        "party": "abc",
        "popupContent": "popupContent !!!!!!!"
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
      }
    }]
    * - ex: polygons {
      "type": "Feature",
      "properties": {
        "party": "Republican",
        "popupContent": "popupContent !!!!!!!"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-104.05, 48.99],
          [-97.22, 48.98],
          [-96.58, 45.94],
          [-104.03, 45.94],
          [-104.05, 48.99]
        ]]
      }
    }, {
      "type": "Feature",
      "properties": {
        "party": "Democrat",
        "popupContent": "popupContent !!!!!!!"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-109.05, 41.00],
          [-102.06, 40.99],
          [-102.03, 36.99],
          [-109.04, 36.99],
          [-109.05, 41.00]
        ]]
      }
    }]
     * @param {Style | undefined} style a style of features
     * @returns layerId of the object in the map
     */
  createGeojsonFeatures(features: any[], style: Style): Promise<Layer> {
    return new Promise((resolve, reject) => {
      this.messenger
        .postMessage("createGeojsonFeatures", { features, style })
        .then((res) => {
          const layer = new Layer(res.layer_id, {
            name: res.layer_id,
            isApiLayer: true,
            datasetId: undefined,
            datasourceId: undefined,
            visible: true,
            messenger: this.messenger,
          });
          resolve(layer);
        });
    });
  }
  /**
     * Create new marker in the position x,y with custom svg image or style
     * @example
     * var coordinates = [ event.lat, event.lng ];
     * var iconSvgOptions = { iconSize : [ 40, 40 ] };
     * var svgXml = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker" class="svg-inline--fa fa-map-marker fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="${color}" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"></path></svg>`;
     * var url = encodeURI("data:image/svg+xml," + svgXml).replace('#', '%23');
     * markerLayer = mapGaligeo.addMarker(coordinates, undefined, iconSvgOptions, svgXml);
     *
     * @param coordinates coordinates [x,y]
     * @param style style object or undefined
     * @param iconSvgOptions icon SVG options, ex: {iconSize: [40, 40]}
     * @param urlSvg URL of the SVG

     * @returns layerLeaflet the marker object leaflet in the map
     */
  addMarker(
    coordinates: number[],
    style: any,
    iconSvgOptions: any,
    urlSvg: any
  ): Promise<Layer> {
    return new Promise((resolve, reject) => {
      this.messenger
        .postMessage("addMarker", {
          coordinates,
          style,
          iconSvgOptions,
          urlSvg,
        })
        .then((res) => {
          const layer = new Layer(res.layer_id, {
            name: res.layer_id,
            isApiLayer: true,
            datasetId: undefined,
            datasourceId: undefined,
            visible: true,
            messenger: this.messenger,
          });
          resolve(layer);
        });
    });
  }
  /**
   * Remove a layer on the map. This method works on marker/geojson layers created with the API,
   * as well with standard Galigeo layers created from the map itself.
   * @param layer the layer to remove
   */
  removeLayer(layer: Layer): Promise<string> {
    return new Promise((resolve, reject) => {
      this.messenger.postMessage("removeLayer", { layer }).then((res) => {
        resolve(res);
      });
    });
  }

  /**
   * Get the list of layers
   * @returns Promise<Layer[]>
   */
  getLayers(): Promise<Layer[]> {
    return new Promise((resolve, reject) => {
      this.messenger.postMessage("getLayers", null).then((messageLayers) => {
        const layers: Layer[] = [];
        for (const l of messageLayers) {
          const layer = new Layer(l.id, {
            name: l.name,
            datasetId: l.datasetId,
            datasourceId: l.datasourceId,
            visible: l.visible,
            messenger: this.messenger,
          });
          layers.push(layer);
        }
        resolve(layers);
      });
    });
  }

  /**
   * Get the list of views available in the map
   */
  async getViews(): Promise<any[]> {
    const views = await this.messenger.postMessage("getViews", null);
    return views;
  }

  /**
   * Toggle the specified view on the map.
   * @param viewId the id of the view to set
   */
  async setView(viewId: number) {
    await this.messenger.postMessage("setView", { viewId });
  }

  /**
   * Listen the events received from the messenger then propagate
   */
  private registerEvents() {
    this.messenger.addEventListener("map", (msg: Message) => {
      // adapt the object passed through the event to match API objects
      let value: any;
      if (msg.action === "zoomend") {
        value = new Extent(
          msg.value.minX,
          msg.value.minY,
          msg.value.maxX,
          msg.value.maxY
        );
      } else {
        value = msg.value;
      }
      this.fireEvent(msg.action, value);
    });
  }

  private createIframe(element: HTMLElement, json: any): HTMLIFrameElement {
    const mapDiv = element;
    let indexPage = "index.html";
    if (this.options.devMode) indexPage = "indexdev.jsp";
    if (this.options.viewerGL) indexPage = "indexgl.html";

    // eventually remove the error page
    const errorDiv: HTMLElement = document.getElementById("galigeoError");
    if (errorDiv) {
      errorDiv.remove();
    }

    // build the map url
    let urlOptions = "listenMessages=true";
    if (this.options.crossDomain) urlOptions += "&crossDomain=true";
    if (this.options.parent) urlOptions += "&parent=" + this.options.parent;
    if (this.options.lang) urlOptions += "&lang=" + this.options.lang;
    if (this.options.listenExternalLinks)
      urlOptions += "&listenExternalLinks=" + this.options.listenExternalLinks;
    if (json.showLoginButton)
      urlOptions += "&showLoginButton=" + json.showLoginButton;
    const serviceUrl = this.options.url + "/" + json.relativeUrlServiceUrl;
    let src = `${this.options.url
      }/viewer/${indexPage}?${urlOptions}&url=${serviceUrl}&lang=${this.getLanguage()
      }`;

    // sso ?
    if (json.sso && this.options.oauth2Enabled) {
      src = `${this.options.url}/oauth/login.html?orgId=${json.orgId}&service=${json.service
        }&redirect=${encodeURIComponent(src)}`;
      if (this.options.oauth2Popup) {
        src += "&popup=true";
      }
      console.log("sso", src);
    }

    // If redirect=true, then skip iframe creation
    if (this.options.redirect) {
      window.location.href = src;
      return null;
    }

    let iframe: HTMLIFrameElement = element.querySelector(
      "#galigeoMap"
    ) as HTMLIFrameElement;
    if (iframe) {
      iframe.src = src;
    } else {
      iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.title = "Galigeo Map";
      iframe.id = "galigeoMap";
      iframe.setAttribute("style", "border: 0px");
      iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-forms allow-modals");
      iframe.addEventListener("error", function (event) {
        console.log("Failed to load iframe : ", event);
      });

      if (navigator.platform === "iPhone" || navigator.platform === "iPad") {
        // Workaround for iOS : reload the iframe if it's empty
        setTimeout(() => {
          try {
            const bodyContent =
              iframe.contentWindow.document.querySelector("body").innerHTML;
            if (bodyContent === "") {
              iframe.focus();
              // set the src again
              iframe.src = src;
            }
          } catch (e) {
            console.log("Failed to load iframe : ", e);
          }
        }, 2000);
      }
      // Empty div before adding the iframe
      while (mapDiv.firstChild) {
        mapDiv.removeChild(mapDiv.firstChild);
      }

      mapDiv.appendChild(iframe);

      this.observeElementResize();
    }
    return iframe;
  }


  public observeElementResize() {
    if (!this.element || !this.iframe) return;
    const resizeObserver = new window.ResizeObserver(() => {
      this.resizeIframeToElement();
    });
    resizeObserver.observe(this.element);
  }

  public resizeIframeToElement() {
    if (this.iframe && this.element) {
      // Récupère la taille actuelle de l'élément parent
      const width = this.element.offsetWidth;
      const height = this.element.offsetHeight;
      // Applique la taille à l'iframe
      this.iframe.style.width = width + "px";
      this.iframe.style.height = height + "px";
    }
  }

  private fixRelativeUrl(url: string): string {
    const httpIdx = url.toLowerCase().indexOf("http");
    if (httpIdx !== 0) {
      // in case of relative path, build the full url
      const baseIdx = window.location.href.lastIndexOf("/");
      return window.location.href.substring(0, baseIdx + 1) + url;
    }
    return url;
  }

  private getLanguage(): string {
    return navigator.language.split("-")[0];
  }
}


export default Map;
