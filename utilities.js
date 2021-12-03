
function preventZoom(e) {
  var t2 = e.timeStamp;
  var t1 = e.currentTarget.dataset.lastTouch || t2;
  var dt = t2 - t1;
  var fingers = e.touches.length;
  e.currentTarget.dataset.lastTouch = t2;
  console.log("prevented double tap");

  if (!dt || dt > 500 || fingers > 1) return; // not double-tap

  e.preventDefault();
  e.target.click();
}

function childNodesRecursive(node) {
  var children = [];

  var to_expand = [];
  to_expand.push(node);

  var expandingNode;
  while (to_expand.length > 0) {
    expandingNode = to_expand.pop();
    for (var i = 0; i < expandingNode.childNodes.length; i++) {
      to_expand.push(expandingNode.childNodes[i]);
      children.push(expandingNode.childNodes[i]);
    }
  }
  return children;
}
