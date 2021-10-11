class BugBattleNetworkIntercepter {
  requestId = 0;
  requests: any = {};
  maxRequests = 10;
  stopped = false;

  getRequests() {
    return Object.values(this.requests);
  }

  setMaxRequests(maxRequests: number) {
    this.maxRequests = maxRequests;
  }

  setStopped(stopped: boolean) {
    this.stopped = stopped;
  }

  cleanRequests() {
    var keys = Object.keys(this.requests);
    if (keys.length > this.maxRequests) {
      var keysToRemove = keys.slice(0, keys.length - this.maxRequests);
      for (var i = 0; i < keysToRemove.length; i++) {
        delete this.requests[keysToRemove[i]];
      }
    }
  }

  calcRequestTime(gleapRequestId: string | number) {
    if (!this.requests[gleapRequestId]) {
      return;
    }

    var startDate = this.requests[gleapRequestId].date;
    if (startDate) {
      this.requests[gleapRequestId].duration =
        new Date().getTime() - startDate.getTime();
      this.requests[gleapRequestId].date = this.requests[
        gleapRequestId
      ].date.toString();
    }
  }

  start() {
    this.setStopped(false);
    this.interceptNetworkRequests({
      onFetch: (params: any, gleapRequestId: any) => {
        if (this.stopped) {
          return;
        }

        if (params.length >= 2) {
          var method = params[1].method ? params[1].method : 'GET';
          this.requests[gleapRequestId] = {
            request: {
              payload: params[1].body,
              headers: params[1].headers,
            },
            type: method,
            url: params[0],
            date: new Date(),
          };
        } else {
          this.requests[gleapRequestId] = {
            request: {},
            url: params[0],
            type: 'GET',
            date: new Date(),
          };
        }

        this.cleanRequests();
      },
      onFetchLoad: (req: any, gleapRequestId: any) => {
        if (this.stopped) {
          return;
        }

        req.text().then((responseText: any) => {
          this.requests[gleapRequestId].success = true;
          this.requests[gleapRequestId].response = {
            status: req.status,
            statusText: req.statusText,
            responseText: responseText,
          };

          this.calcRequestTime(gleapRequestId);

          this.cleanRequests();
        });
      },
      onFetchFailed: (_err: any, gleapRequestId: any) => {
        if (this.stopped) {
          return;
        }

        this.requests[gleapRequestId].success = false;
        this.calcRequestTime(gleapRequestId);

        this.cleanRequests();
      },
      onOpen: (request: any, args: string | any[]) => {
        if (this.stopped) {
          return;
        }

        if (
          request &&
          request.gleapRequestId &&
          args.length >= 2 &&
          this.requests
        ) {
          this.requests[request.gleapRequestId] = {
            type: args[0],
            url: args[1],
            date: new Date(),
          };
        }

        this.cleanRequests();
      },
      onSend: (request: any, args: string | any[]) => {
        if (this.stopped) {
          return;
        }

        if (
          request &&
          request.gleapRequestId &&
          args.length > 0 &&
          this.requests &&
          this.requests[request.gleapRequestId]
        ) {
          this.requests[request.gleapRequestId].request = {
            payload: args[0],
            headers: request.requestHeaders,
          };
        }

        this.cleanRequests();
      },
      onError: (request: any) => {
        if (
          !this.stopped &&
          this.requests &&
          request &&
          request.gleapRequestId &&
          this.requests[request.gleapRequestId]
        ) {
          this.requests[request.gleapRequestId].success = false;
          this.calcRequestTime(request.gleapRequestId);
        }

        this.cleanRequests();
      },
      onLoad: (request: any) => {
        if (this.stopped) {
          return;
        }

        if (
          request &&
          request.gleapRequestId &&
          this.requests &&
          this.requests[request.gleapRequestId]
        ) {
          const contentType = request.getResponseHeader('content-type');
          const isTextOrJSON =
            contentType &&
            (contentType.includes('json') || contentType.includes('text'));

          var responseText = '<' + contentType + '>';
          if (request.responseType === '' || request.responseType === 'text') {
            responseText = request.responseText;
          }
          if (request._response && isTextOrJSON) {
            responseText = request._response;
          }

          this.requests[request.gleapRequestId].success = true;
          this.requests[request.gleapRequestId].response = {
            status: request.status,
            responseText: responseText,
          };

          this.calcRequestTime(request.gleapRequestId);
        }

        this.cleanRequests();
      },
    });
  }

  interceptNetworkRequests(callback: any) {
    // eslint-disable-next-line consistent-this
    var self = this;

    // XMLHttpRequest
    const open = XMLHttpRequest.prototype.open;
    const send = XMLHttpRequest.prototype.send;

    // @ts-ignore
    XMLHttpRequest.prototype.wrappedSetRequestHeader =
      XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
      // @ts-ignore
      this.wrappedSetRequestHeader(header, value);

      // @ts-ignore
      if (!this.requestHeaders) {
        // @ts-ignore
        this.requestHeaders = {};
      }

      // @ts-ignore
      if (!this.requestHeaders[header]) {
        // @ts-ignore
        this.requestHeaders[header] = [];
      }

      // @ts-ignore
      this.requestHeaders[header].push(value);
    };

    XMLHttpRequest.prototype.open = function () {
      (this as any).gleapRequestId = ++self.requestId;
      callback.onOpen && callback.onOpen(this, arguments);

      if (callback.onLoad) {
        this.addEventListener('load', function () {
          // @ts-ignore
          callback.onLoad(this);
        });
      }
      if (callback.onError) {
        this.addEventListener('error', function () {
          // @ts-ignore
          callback.onError(this);
        });
      }

      // @ts-ignore
      return open.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
      callback.onSend && callback.onSend(this, arguments);
      // @ts-ignore
      return send.apply(this, arguments);
    };

    // Fetch
    if (global) {
      (function () {
        var originalFetch = global.fetch;
        global.fetch = function () {
          var gleapRequestId = ++self.requestId;
          callback.onFetch(arguments, gleapRequestId);

          return (
            originalFetch
              // @ts-ignore
              .apply(this, arguments)
              .then(function (data) {
                return data.text().then((textData) => {
                  data.text = function () {
                    return Promise.resolve(textData);
                  };

                  data.json = function () {
                    return Promise.resolve(JSON.parse(textData));
                  };

                  callback.onFetchLoad(data, gleapRequestId);

                  return data;
                });
              })
              .catch((err) => {
                callback.onFetchFailed(err, gleapRequestId);
                throw err;
              })
          );
        };
      })();
    }

    return callback;
  }
}

export default BugBattleNetworkIntercepter;