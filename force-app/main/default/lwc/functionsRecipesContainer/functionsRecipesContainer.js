import { LightningElement, track } from "lwc";
import functionDetails from "@salesforce/resourceUrl/functionDetails";
import { loadScript } from "lightning/platformResourceLoader";

export default class FunctionsRecipesContainer extends LightningElement {
  selectedFunction = [];
  functionData;
  @track definition;
  libInitialized = false;

  renderedCallback() {
    if (this.libInitialized) {
      return;
    }
    this.libInitialized = true;
    loadScript(this, functionDetails).then(() => {
      // eslint-disable-next-line no-undef
      let result = functionData.getData();
      this.definition = result;
      this.selectedFunction = this.definition[0];
    });
  }

  handleNavSelect(event) {
    const name = event.detail;
    this.selectedFunction = this.definition.find((item) => item.name === name);
  }
}
