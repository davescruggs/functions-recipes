import { LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import validateDeployment from "@salesforce/apex/FunctionUtilities.validateDeployment";
import invoke from "@salesforce/apex/InvokeProcessLargeDataFunction.invoke";

export default class ProcessLargeDataFunction extends LightningElement {
  functionLabel = "JavaScript";
  functionName = "functions_recipes.processlargedatajs";
  length = 5;
  loading = true;
  sourceMap = {
    JavaScript:
      "https://github.com/trailheadapps/functions-recipes/blob/main/functions/01_Intro_ProcessLargeData_JS/index.js"
  };
  functionDeployed;
  userLocation;
  mapMarkers = [];
  nearbyLocations;
  error;

  connectedCallback() {
    this.validateFunctionDeployment();
  }

  validateFunctionDeployment() {
    // The validateDeployment method in apex will check to see if a function has been deployed
    validateDeployment({ functionName: this.functionName })
      .then((result) => {
        this.functionDeployed = result;
        this.loading = false;
      })
      .catch((error) => {
        this.showError(error);
      });
  }

  invokeFunction() {
    this.getGeolocation();
    this.loading = true;
  }

  getGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Get the Latitude and Longitude from Geolocation API and set the user location
          this.userLocation = {
            location: {
              Latitude: position.coords.latitude,
              Longitude: position.coords.longitude
            }
          };
          this.getNearbyLocations();
        },
        (error) => {
          // In the event of an error show a message and set a default latitude and longitude
          this.showToast("Current Location", error.message, "info");
          this.userLocation = {
            location: {
              Latitude: 37.789828572142724,
              Longitude: -122.39724878744052
            }
          };
          this.getNearbyLocations();
        }
      );
    }
  }

  getNearbyLocations() {
    // Define the payload using the properties defined
    const payload = {
      latitude: this.userLocation.location.Latitude,
      longitude: this.userLocation.location.Longitude,
      length: this.length
    };

    // Invoke Function
    invoke({
      functionName: this.functionName,
      payload: JSON.stringify(payload)
    })
      .then((data) => {
        const parsedData = JSON.parse(data);
        this.mapMarkers = [];
        parsedData.schools.forEach((location) => {
          const distance =
            Math.round((location.distance + Number.EPSILON) * 100) / 100;
          const marker = {
            location: {
              Street: location.street,
              City: location.city,
              State: location.state,
              PostalCode: location.zip
            },
            description: location.description,
            title: `${location.name} (${distance}mi)`,
            value: location.website
          };
          this.mapMarkers.push(marker);
        });
        this.loading = false;
      })
      .catch((error) => {
        this.showError(error);
      });
  }

  handleChangeLength(event) {
    this.length = +event.detail.value;
  }

  handleChangeFunction(event) {
    this.functionName = event.detail.value;
    this.functionLabel = event.target.options.find(
      (opt) => opt.value === event.detail.value
    ).label;
  }

  showError(error) {
    this.error = error;
    this.loading = false;
    this.showToast(
      "An error has ocurred",
      error?.message || error?.body?.message,
      "error"
    );
  }

  showToast(title, message, variant) {
    const event = new ShowToastEvent({
      title,
      message,
      variant
    });
    this.dispatchEvent(event);
  }

  get functionTitle() {
    return `ProcessLargeData ${this.functionLabel}`;
  }

  get mapLoaded() {
    return this.mapMarkers.length >= 1;
  }

  get lengthOptions() {
    return [
      { label: "5", value: 5 },
      { label: "10", value: 10 },
      { label: "15", value: 15 },
      { label: "20", value: 20 }
    ];
  }

  get sourceURL() {
    return this.sourceMap[this.functionLabel];
  }

  get functionOptions() {
    return [
      {
        label: "JavaScript",
        value: "functions_recipes.processlargedatajs"
      }
    ];
  }
}
