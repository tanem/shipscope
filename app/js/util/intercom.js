var Intercom = function() {
  var intercom;

  return {
    intercom: function() { return intercom },
    initialize: function() {
      intercom = chrome.runtime.connect({name: "shipscope intercom"})
    }
  }
};
