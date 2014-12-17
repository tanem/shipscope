var listener = null
var OptionsView = Backbone.Marionette.LayoutView.extend({
  hasError: false,
  template: '#options_view',
  regions: {
    project_selection: '#projects'
  },

  templateHelpers: function() {
    return {
      msg: {
        save: chrome.i18n.getMessage('save'),
        codeship_api_key: chrome.i18n.getMessage('codeship_api_key'),
        copy_api_key: chrome.i18n.getMessage('copy_api_key'),
        paste_api_key: chrome.i18n.getMessage('paste_api_key'),
      },
      hasError: this.hasError ? 'has-error' : ''
    }
  },

  events: {
    'click #options_submit': 'onSave',
  },

  onShow: function() {
    this.project_list = new ProjectsSelectorView({collection: this.model.get('projects')})
    this.project_selection.show(this.project_list)
    this.$('input[type=checkbox]').bootstrapSwitch()

    this.$('.nav-tabs a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    })

    this.$('#api_key').focus()
  },

  checkForValidApiResponse: function(msg) {
    this.stopListeningForApiResult()
    if (msg.type == 'error') {
      this.hasError = true
      this.render()
      return
    }

     if (msg.type == 'api_ok') {
      this.hasError = false
      Backbone.Events.trigger('show:home');
    }
  },

  destroy: function() {
    console.debug('options.destroy')
    this.stopListeningForApiResult()
  },

  listenForApiResult: function() {
    if (listener == null) {
      listener = this.checkForValidApiResponse.bind(this)
      App.intercom.onMessage.addListener(listener)
    }
  },

  stopListeningForApiResult: function() {
    if (listener != null) {
      App.intercom.onMessage.removeListener(listener)
      listener = null
    }
  },

  onSave: function() {
    event.preventDefault()

    this.listenForApiResult()
    this.model.set({api_key: $('textarea#api_key').val()})
    App.intercom.postMessage({type: 'options.set', data: this.model.attributes})
  }
});
