
class Component {

  constructor() {
    this.rootContainerId = null;
  }

  spawn(containerId) {

    // Set rootContainerId
    this.rootContainerId = containerId

    // Replace/add html to container
    document.getElementById(containerId).innerHTML = this.buildHtml();

    // Link/stash references to objects
    this.buildRefs();

    // Create any event handlers
    this.buildEventHandlers();
  }

  buildHtml() {
     throw new Error("Method must be implemented.");
  }

  buildRefs() {}

  buildEventHandlers() {}

}

