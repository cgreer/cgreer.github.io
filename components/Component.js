
class Component {

  spawn(containerId) {

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

