var OptionsLayout = Backbone.Marionette.LayoutView.extend({
  template: '#options_layout',
  className: 'options',
  regions: {
    nav: '#options_nav',
    content: '#options_content'
  },

  initialize: function() {
    OptionsApp.intercom.onMessage.addListener(function(msg) {
      if (msg.type == 'projects.set') {
        if (!msg.data) {
          OptionsApp.intercom.postMessage({type: 'options.get'});
          return;
        }

        if (this.initialized) return;

        this.initialized = true
        this.collection = new Projects(msg.data);
      }

      if (msg.type == 'options.set') {
        OptionsApp.options = new OptionsModel(msg.data.settings)
        OptionsApp.options.set({available_projects: this.collection})
        this.content.show(new OptionsProjectsView({
          model: OptionsApp.options,
          collection: this.collection
        }))
      }
    }.bind(this));

    OptionsApp.intercom.postMessage({type: 'projects.get'})
    OptionsApp.intercom.postMessage({type: 'options.get'})
    OptionsApp.options = new OptionsModel();
  },
})
