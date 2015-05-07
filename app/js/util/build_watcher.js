var BuildWatcher = (function(options, api) {
  var
    PUSHER_APP_KEY = '1971ebf8928f03c907ed',
    PRIVATE_PROJECT = 'private-project-',
    PRIVATE_BUILD = 'private-build-',
    pusher,
    isWatching = {},
    projectChannels = {},
    buildChannels = {},

    initializePusher = function() {
      pusher = new Pusher(PUSHER_APP_KEY, {
          authEndpoint: 'https://codeship.com/pusher/auth',
          auth: {
            params: {
              api_key: options.api_key
            }
          },
          disableStats: true,
          encrypted: true
      })
      pusher.connection.bind('state_change', function(states) {
        console.debug('onConnectionStateChange:', pusher.connection.state)
        console.debug('...states:', states)
        getShipscopeSummary()
      })
    },

    ellipsify = function(str, max) {
      if (str == null) return str
      str = str.trim()
      if (str.length > max) str = str.substr(0, max) + '...'
      return str
    },

    onCreateNotification = function(notificationId) {
      if (notificationId) {
        setTimeout(function() {
            chrome.notifications.clear(notificationId, function(wasCleared) {})
          }, 5000)
      } else {
        console.error('runtime error:', chrome.runtime.lastError)
      }
    },

    clearNotification = function(notificationId) {
      delete isWatching[notificationId]
    },

    onNotificationClicked = function(notificationId) {
      var build = isWatching[notificationId]
      if (build) {
        chrome.tabs.create({url: 'https://codeship.com/projects/' + build.get('project_id') + '/builds/' + build.get('id')})
        clearNotification(notificationId)
      } else console.debug('could not find build for notificationId:', notificationId)
    },

    onNotificationClosed = function(notificationId) {
      clearNotification(notificationId)
    },

    showNotification = function(project, build) {
      var msg= '[' + ellipsify(build.get('branch'), 20) + '] ' + build.get('status') + '\n' + ellipsify(build.get('message'), 30),
          options = {
            type: "basic",
            title: project.get('repository_name'),
            message: msg,
            priority: 1,
            iconUrl: "img/shipscope_icon_" + build.get('status') + "_128.png"
          }

      chrome.notifications.create(build.get('uuid'), options, onCreateNotification);

      isWatching[build.get('uuid')].set({status: 'notifying'})
    },

    onUpdate = function(data) {
      var projects = this.projects,
          project = projects.get(this.projectId)

      api.fetchBuilds(options, project, function(builds) {
        project.set({builds: builds})
        scanProjects(projects)
      })
    },

    onSubscriptionSucceeded = function() {
      console.debug('buildWatcher.onSubscriptionSuccess')
    },

    onSubscriptionError = function(status) {
      console.error('buildWatcher.onSubscriptionError:', status)
    },

    scanProjects = function(projects) {
      projects.forEach(function(project) {
        var projectInfo = { projects: projects, projectId: project.id },
            projectChannel = PRIVATE_PROJECT + project.id,
            channel

        if (!projectChannels[projectChannel]) {
          channel = pusher.subscribe(projectChannel)
          projectChannels[projectChannel] = channel

          channel.bind('common', onUpdate.bind(projectInfo))
        }

        project.get('builds').forEach(function(build) {
          var uuid = build.get('uuid'),
              status = build.get('status')

          if (status == 'testing') {
            isWatching[uuid] = build.clone()
          } else if (isWatching[uuid] && isWatching[uuid].get('status') == 'testing') {
            showNotification(project, build)
          }
        })
      })
      getShipscopeSummary(projects)
    },

    getShipscopeSummary = function(projects) {
      var STATUS_COLORS = [
        '#feb71a',    // stopped
        '#60cc69',    // success
        '#fe402c',    // error
        '#5a95e5'     // testing
      ]

      if (projects !== undefined && pusher.connection.state == 'connected') {
        var status = projects.getSummary()

        chrome.browserAction.setBadgeText({text: status.count.toString()})
        chrome.browserAction.setBadgeBackgroundColor({color: STATUS_COLORS[status.state]})
      } else {
        chrome.browserAction.setBadgeText({text: 'X'})
        chrome.browserAction.setBadgeBackgroundColor({color: STATUS_COLORS[2]})
      }
    }

  chrome.notifications.onClicked.addListener(onNotificationClicked)
  chrome.notifications.onClosed.addListener(onNotificationClosed)

  initializePusher()

  return {
    scan: scanProjects,
    getWatchList: function() {
      return isWatching
    }
  }
});
