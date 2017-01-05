/* jshint ignore:start */
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
angular.module('md5', []).constant('md5', (function() {

  /*
   * Configurable variables. You may need to tweak these to be compatible with
   * the server-side, but the defaults work in most cases.
   */
  var hexcase = 0;   /* hex output format. 0 - lowercase; 1 - uppercase        */
  var b64pad  = "";  /* base-64 pad character. "=" for strict RFC compliance   */

  /*
   * These are the functions you'll usually want to call
   * They take string arguments and return either hex or base-64 encoded strings
   */
  function hex_md5(s)    { return rstr2hex(rstr_md5(str2rstr_utf8(s))); }
  function b64_md5(s)    { return rstr2b64(rstr_md5(str2rstr_utf8(s))); }
  function any_md5(s, e) { return rstr2any(rstr_md5(str2rstr_utf8(s)), e); }
  function hex_hmac_md5(k, d)
    { return rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
  function b64_hmac_md5(k, d)
    { return rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
  function any_hmac_md5(k, d, e)
    { return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

  /*
   * Perform a simple self-test to see if the VM is working
   */
  function md5_vm_test()
  {
    return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
  }

  /*
   * Calculate the MD5 of a raw string
   */
  function rstr_md5(s)
  {
    return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
  }

  /*
   * Calculate the HMAC-MD5, of a key and some data (raw strings)
   */
  function rstr_hmac_md5(key, data)
  {
    var bkey = rstr2binl(key);
    if(bkey.length > 16) bkey = binl_md5(bkey, key.length * 8);

    var ipad = Array(16), opad = Array(16);
    for(var i = 0; i < 16; i++)
    {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    var hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
    return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
  }

  /*
   * Convert a raw string to a hex string
   */
  function rstr2hex(input)
  {
    try { hexcase } catch(e) { hexcase=0; }
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var output = "";
    var x;
    for(var i = 0; i < input.length; i++)
    {
      x = input.charCodeAt(i);
      output += hex_tab.charAt((x >>> 4) & 0x0F)
             +  hex_tab.charAt( x        & 0x0F);
    }
    return output;
  }

  /*
   * Convert a raw string to a base-64 string
   */
  function rstr2b64(input)
  {
    try { b64pad } catch(e) { b64pad=''; }
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var output = "";
    var len = input.length;
    for(var i = 0; i < len; i += 3)
    {
      var triplet = (input.charCodeAt(i) << 16)
                  | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                  | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
      for(var j = 0; j < 4; j++)
      {
        if(i * 8 + j * 6 > input.length * 8) output += b64pad;
        else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
      }
    }
    return output;
  }

  /*
   * Convert a raw string to an arbitrary string encoding
   */
  function rstr2any(input, encoding)
  {
    var divisor = encoding.length;
    var i, j, q, x, quotient;

    /* Convert to an array of 16-bit big-endian values, forming the dividend */
    var dividend = Array(Math.ceil(input.length / 2));
    for(i = 0; i < dividend.length; i++)
    {
      dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
    }

    /*
     * Repeatedly perform a long division. The binary array forms the dividend,
     * the length of the encoding is the divisor. Once computed, the quotient
     * forms the dividend for the next step. All remainders are stored for later
     * use.
     */
    var full_length = Math.ceil(input.length * 8 /
                                      (Math.log(encoding.length) / Math.log(2)));
    var remainders = Array(full_length);
    for(j = 0; j < full_length; j++)
    {
      quotient = Array();
      x = 0;
      for(i = 0; i < dividend.length; i++)
      {
        x = (x << 16) + dividend[i];
        q = Math.floor(x / divisor);
        x -= q * divisor;
        if(quotient.length > 0 || q > 0)
          quotient[quotient.length] = q;
      }
      remainders[j] = x;
      dividend = quotient;
    }

    /* Convert the remainders to the output string */
    var output = "";
    for(i = remainders.length - 1; i >= 0; i--)
      output += encoding.charAt(remainders[i]);

    return output;
  }

  /*
   * Encode a string as utf-8.
   * For efficiency, this assumes the input is valid utf-16.
   */
  function str2rstr_utf8(input)
  {
    var output = "";
    var i = -1;
    var x, y;

    while(++i < input.length)
    {
      /* Decode utf-16 surrogate pairs */
      x = input.charCodeAt(i);
      y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
      if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
      {
        x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
        i++;
      }

      /* Encode output as utf-8 */
      if(x <= 0x7F)
        output += String.fromCharCode(x);
      else if(x <= 0x7FF)
        output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                      0x80 | ( x         & 0x3F));
      else if(x <= 0xFFFF)
        output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                      0x80 | ((x >>> 6 ) & 0x3F),
                                      0x80 | ( x         & 0x3F));
      else if(x <= 0x1FFFFF)
        output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                      0x80 | ((x >>> 12) & 0x3F),
                                      0x80 | ((x >>> 6 ) & 0x3F),
                                      0x80 | ( x         & 0x3F));
    }
    return output;
  }

  /*
   * Encode a string as utf-16
   */
  function str2rstr_utf16le(input)
  {
    var output = "";
    for(var i = 0; i < input.length; i++)
      output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                    (input.charCodeAt(i) >>> 8) & 0xFF);
    return output;
  }

  function str2rstr_utf16be(input)
  {
    var output = "";
    for(var i = 0; i < input.length; i++)
      output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                     input.charCodeAt(i)        & 0xFF);
    return output;
  }

  /*
   * Convert a raw string to an array of little-endian words
   * Characters >255 have their high-byte silently ignored.
   */
  function rstr2binl(input)
  {
    var output = Array(input.length >> 2);
    for(var i = 0; i < output.length; i++)
      output[i] = 0;
    for(var i = 0; i < input.length * 8; i += 8)
      output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
    return output;
  }

  /*
   * Convert an array of little-endian words to a string
   */
  function binl2rstr(input)
  {
    var output = "";
    for(var i = 0; i < input.length * 32; i += 8)
      output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
    return output;
  }

  /*
   * Calculate the MD5 of an array of little-endian words, and a bit length.
   */
  function binl_md5(x, len)
  {
    /* append padding */
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var a =  1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d =  271733878;

    for(var i = 0; i < x.length; i += 16)
    {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;

      a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
      d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
      c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
      b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
      a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
      d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
      c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
      b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
      a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
      d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
      c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
      b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
      a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
      d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
      c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
      b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

      a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
      d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
      c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
      b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
      a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
      d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
      c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
      b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
      a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
      d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
      c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
      b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
      a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
      d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
      c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
      b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

      a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
      d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
      c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
      b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
      a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
      d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
      c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
      b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
      a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
      d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
      c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
      b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
      a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
      d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
      c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
      b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

      a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
      d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
      c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
      b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
      a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
      d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
      c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
      b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
      a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
      d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
      c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
      b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
      a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
      d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
      c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
      b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);
  }

  /*
   * These functions implement the four basic operations the algorithm uses.
   */
  function md5_cmn(q, a, b, x, s, t)
  {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
  }
  function md5_ff(a, b, c, d, x, s, t)
  {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  function md5_gg(a, b, c, d, x, s, t)
  {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }
  function md5_hh(a, b, c, d, x, s, t)
  {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5_ii(a, b, c, d, x, s, t)
  {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  /*
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
   * to work around bugs in some JS interpreters.
   */
  function safe_add(x, y)
  {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  /*
   * Bitwise rotate a 32-bit number to the left.
   */
  function bit_rol(num, cnt)
  {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  return hex_md5;
})());
/* jshint ignore:end */
(function() {
  var gravatarDirectiveFactory;

  gravatarDirectiveFactory = function(bindOnce) {
    return [
      'gravatarService', function(gravatarService) {
        var filterKeys;
        filterKeys = function(prefix, object) {
          var k, retVal, v;
          retVal = {};
          for (k in object) {
            v = object[k];
            if (k.indexOf(prefix) !== 0) {
              continue;
            }
            k = k.substr(prefix.length).toLowerCase();
            if (k.length > 0) {
              retVal[k] = v;
            }
          }
          return retVal;
        };
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            var directiveName, item, opts, unbind;
            directiveName = bindOnce ? 'gravatarSrcOnce' : 'gravatarSrc';
            item = attrs[directiveName];
            delete attrs[directiveName];
            opts = filterKeys('gravatar', attrs);
            unbind = scope.$watch(item, function(newVal) {
              element.attr('src', gravatarService.url(newVal, opts));
              if (bindOnce) {
                if (newVal == null) {
                  return;
                }
                unbind();
              }
            });
          }
        };
      }
    ];
  };

  angular.module('ui.gravatar', ['md5']).provider('gravatarService', [
    'md5', function(md5) {
      var hashRegex, self, serialize;
      self = this;
      hashRegex = /^[0-9a-f]{32}$/i;
      serialize = function(object) {
        var k, params, v;
        params = [];
        for (k in object) {
          v = object[k];
          params.push("" + k + "=" + (encodeURIComponent(v)));
        }
        return params.join('&');
      };
      this.defaults = {};
      this.secure = false;
      this.protocol = null;
      this.urlFunc = function(opts) {
        var params, pieces, prefix, src, urlBase;
        prefix = opts.protocol ? opts.protocol + ':' : '';
        urlBase = opts.secure ? 'https://secure' : prefix + '//www';
        src = hashRegex.test(opts.src) ? opts.src : md5(opts.src);
        pieces = [urlBase, '.gravatar.com/avatar/', src];
        params = serialize(opts.params);
        if (params.length > 0) {
          pieces.push('?' + params);
        }
        return pieces.join('');
      };
      this.$get = [
        function() {
          return {
            url: function(src, params) {
              if (src == null) {
                src = '';
              }
              if (params == null) {
                params = {};
              }
              return self.urlFunc({
                params: angular.extend(angular.copy(self.defaults), params),
                protocol: self.protocol,
                secure: self.secure,
                src: src
              });
            }
          };
        }
      ];
      return this;
    }
  ]).directive('gravatarSrc', gravatarDirectiveFactory()).directive('gravatarSrcOnce', gravatarDirectiveFactory(true));

}).call(this);

/*jshint browser: true */
/*globals angular, ng */

(function () {
    'use strict';

    var barkbaudConfig = {
        apiUrl: 'https://barkbaud.herokuapp.com/'
    };

    function config($locationProvider, $urlRouterProvider, bbWindowConfig) {
        $locationProvider.html5Mode(false);

        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state');
            $state.go('dashboard');
        });

        bbWindowConfig.productName = 'Barkbaud';
    }

    config.$inject = ['$locationProvider', '$urlRouterProvider', 'bbWindowConfig'];

    function run(bbDataConfig, bbWait, barkbaudAuthService, $rootScope, $state) {

        function addBaseUrl(url) {
            return barkbaudConfig.apiUrl + url;
        }

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            var redirect;
            if (!barkbaudAuthService.authenticated) {
                event.preventDefault();
                $rootScope.$emit('bbBeginWait');

                redirect = $state.href(toState, toParams, { absolute: true });
                barkbaudAuthService.isAuthenticated().then(function (authenticated) {
                    $rootScope.$emit('bbEndWait');
                    if (authenticated) {
                        $state.go(toState, toParams);
                    } else {
                        barkbaudAuthService.modal(redirect).then(function () {
                            return $state.go(toState.name, toParams);
                        });
                    }
                });
            }
        });

        $rootScope.$on('bbBeginWait', function (e, opts) {
            e.stopPropagation();
            bbWait.beginPageWait(opts);
        });

        $rootScope.$on('bbEndWait', function (e, opts) {
            e.stopPropagation();
            bbWait.endPageWait(opts);
        });

        bbDataConfig.dataUrlFilter = addBaseUrl;
        bbDataConfig.resourceUrlFilter = addBaseUrl;
    }

    run.$inject = ['bbDataConfig', 'bbWait', 'barkbaudAuthService', '$rootScope', '$state'];

    function MainController(barkbaudAuthService) {
        var self = this;
        self.logout = barkbaudAuthService.logout;
    }

    MainController.$inject = ['barkbaudAuthService'];

    angular.module('barkbaud', ['sky', 'ui.select', 'ui.bootstrap', 'ui.router', 'ngAnimate', 'barkbaud.templates', 'ui.gravatar'])
        .constant('barkbaudConfig', barkbaudConfig)
        .config(config)
        .run(run)
        .controller('MainController', MainController);
}());

/*global angular */

(function () {
    'use strict';

    function barkbaudAuthService(barkbaudConfig, bbData, bbModal, $q, $window) {
        var modal,
            service = {};

        function go(action, redirect) {
            $window.location.href = [
                barkbaudConfig.apiUrl,
                'auth/',
                action,
                '?redirect=',
                encodeURIComponent(redirect)
            ].join('');
        }

        service.isAuthenticated = function () {
            var deferred = $q.defer();
            bbData.load({
                data: 'auth/authenticated?' + (new Date().getTime())
            }).then(function (result) {
                service.authenticated = result.data.authenticated;
                service.tenantId = result.data.tenant_id;
                deferred.resolve(result.data.authenticated);
            });
            return deferred.promise;
        };

        service.login = function (redirect) {
            go('login', redirect);
        };

        service.logout = function (redirect) {
            go('logout', redirect);
        };

        service.update = function () {
            modal.close(service.authenticated);
        };

        service.modal = function (redirect) {
            if (!modal) {
                modal = bbModal.open({
                    controller: 'LoginPageController as loginPage',
                    templateUrl: 'login/loginpage.html',
                    resolve: {
                        barkbaudRedirect: function () {
                            return redirect;
                        }
                    }
                });
            }

            return modal.result;
        };

        return service;
    }

    barkbaudAuthService.$inject = [
        'barkbaudConfig',
        'bbData',
        'bbModal',
        '$q',
        '$window'
    ];

    angular.module('barkbaud')
        .factory('barkbaudAuthService', barkbaudAuthService);
}());

/*global angular */

(function () {
    'use strict';

    function constituentUrlFilter(barkbaudAuthService) {
        return function (constituentId) {
            return [
                'https://renxt.blackbaud.com/constituents/',
                encodeURIComponent(constituentId),
                '?tenantid=',
                barkbaudAuthService.tenantId
            ].join('');
        };
    }

    constituentUrlFilter.$inject = ['barkbaudAuthService'];

    angular.module('barkbaud')
        .filter('barkConstituentUrl', constituentUrlFilter);

}());

/*global angular */

(function () {
    'use strict';

    function barkPhoto(gravatarService) {
        return {
            scope: {
                barkPhotoUrl: '=',
                barkPhotoBase64: '=',
                barkPhotoGravatarEmail: '='
            },
            bindToController: true,
            controller: angular.noop,
            controllerAs: 'barkPhoto',
            link: function (scope, el, attr, barkPhoto) {

                function setImageData(data) {
                    el.css('background-image', 'url("data:image/png;base64,' + data + '")');
                }

                function setImageUrl(url) {
                    el.css('background-image', 'url(\'' + url + '\')');
                }

                scope.$watch(function () {
                    return barkPhoto.barkPhotoUrl;
                }, function (newValue) {
                    if (newValue) {
                        setImageUrl(newValue.replace('http://', '//'));
                    }
                });

                scope.$watch(function () {
                    return barkPhoto.barkPhotoBase64;
                }, function (newValue) {
                    if (newValue) {
                        setImageData(newValue);
                    }
                });

                scope.$watch(function () {
                    return barkPhoto.barkPhotoGravatarEmail;
                }, function (newValue) {
                    if (newValue) {
                        setImageUrl(gravatarService.url(newValue, {default: 'mm'}));
                    }
                });
            },
            replace: true,
            templateUrl: 'components/photo.directive.html'
        };
    }

    barkPhoto.$inject = [
        'gravatarService'
    ];

    angular.module('barkbaud')
        .directive('barkPhoto', barkPhoto);
}());

/*global angular */

(function () {
    'use strict';

    function dashboardPageConfig($stateProvider) {
        $stateProvider
            .state('dashboard', {
                controller: 'DashboardPageController as dashboardPage',
                templateUrl: 'dashboard/dashboardpage.html',
                url: '/dashboard'
            });
    }

    dashboardPageConfig.$inject = ['$stateProvider'];

    angular.module('barkbaud')
        .config(dashboardPageConfig);
}());

/*global angular */

(function () {
    'use strict';

    function DashboardPageController($scope, $stateParams, bbData, bbWindow) {
        var self = this;

        $scope.$emit('bbBeginWait');
        bbWindow.setWindowTitle('Dashboard');
        bbData.load({
            data: 'api/dogs'
        }).then(function (result) {
            self.dogs = result.data.value;
            $scope.$emit('bbEndWait');
        }).catch(function (result) {
            self.error = result.data.error;
        });
    }

    DashboardPageController.$inject = [
        '$scope',
        '$stateParams',
        'bbData',
        'bbWindow'
    ];

    angular.module('barkbaud')
        .controller('DashboardPageController', DashboardPageController);
}());

/*jslint browser: false */
/*global angular */

(function () {
    'use strict';

    function BehaviorAddController($scope, formOptions, loadResult, $uibModalInstance, bbData, bbEventTracker, bbFuzzyDateFormatter, bbWait, bbToast) {

        var FORM_NAME = 'Ratings Add Form',
            initialTime = new Date().getTime(),
            initialData = angular.copy(loadResult.data),
            self = this,
            dataUrl = 'prospectui/constituents/' + formOptions.constituentId + '/ratings',
            codeTableEntriesCache = {};

        bbEventTracker.trackFormLoaded({ form_name: FORM_NAME });

        // we will eventually call this when there is support in Sky for invoking custom modal close event handler
        function closeForm() {
            bbEventTracker.trackFormClosed({ form_name: FORM_NAME, final_data: self.locals.data, initial_data: initialData, start_time: initialTime });
        }

        function save() {

            if (self.locals.ratingsaddform.$valid) {

                self.locals.errorMessage = '';
                self.locals.isSaving = true;

                bbEventTracker.trackFormSaved({ form_name: FORM_NAME, final_data: self.locals.data, initial_data: initialData, start_time: initialTime });

                var selected_source_id,
                    dataToSave = {};

                if (self.locals.data.selected_rating_source) {
                    selected_source_id = self.locals.data.selected_rating_source.id;
                }

                dataToSave = {
                    source_id: selected_source_id,
                    rating_type_id: self.locals.data.selected_rating_type.id,
                    date: self.locals.data.selected_rating_date,
                    comments: self.locals.data.selected_rating_comments,
                    value: self.locals.data.selected_value
                };

                bbWait.beginPageWait();

                bbData.save({
                    url: dataUrl,
                    data: dataToSave
                }).then(function () {
                    $uibModalInstance.close(self.locals.data.selected_rating_type.id);
                    bbWait.endPageWait();
                    bbToast.open({
                        message: self.locals.resources.ratings_form_save_success,
                        toastType: "success"
                    });
                }).catch(function (response) {
                    if (response && response.data && response.data[0] && response.data[0].Message) {
                        self.locals.errorMessage = response.data[0].Message;
                    } else {
                        self.locals.errorMessage = self.locals.resources.ratings_form_save_error;
                    }
                    self.locals.isSaving = false;
                    bbWait.endPageWait();
                });
            } else {
                self.locals.errorMessage = self.locals.resources.ratings_form_save_error;
            }
        }

        function isTypeSystem(item) {
            if (item && item.id && (item.id.substring(0, 3) === "PR_")) {
                return true;
            }
            return false;
        }

        function setTypeOptionsNonSystem() {
            if (self.locals && self.locals.data && self.locals.data.rating_type) {
                self.locals.typeOptions = [];
                self.locals.data.rating_type.forEach(function (item) {
                    if (!isTypeSystem(item)) {
                        self.locals.typeOptions.push(item);
                    }
                });
            }
        }

        if (loadResult.httpResults.data.status === 200) {

            self.locals = {
                loadErrorOccurred: false,
                data: loadResult.data,
                resources: loadResult.resources,
                customFormat: bbFuzzyDateFormatter,
                isSaving: false,
                save: save,
                dateFormatString: bbFuzzyDateFormatter,
                closeForm: closeForm,
                yesno: [{
                    value: true,
                    label: loadResult.resources.proposal_custom_field_yes
                }, {
                    value: false,
                    label: loadResult.resources.proposal_custom_field_no
                }],
                minDate: new Date(1753, 1, 1),
                maxDate: new Date(9999, 1, 1),
                numberValueSettings: {
                    mDec: 0,
                    vMin: -0,
                    vMax: 2147483647.1
                },
                errorMessage: ""
            };
            self.locals.sourceOptions = self.locals.data.sources;
            setTypeOptionsNonSystem();
            self.locals.data.selected_rating_date = new Date();
        } else {
            self.locals = { loadErrorOccurred: true };

            //Load failed so just getting resources for form to display failure
            bbWait.beginPageWait();
            bbData.load({
                resources: 'prospectui/resources'
            }).then(function (result) {
                self.locals.resources = result.resources;
                bbWait.endPageWait();
            }).catch(function () {
                bbWait.endPageWait();
            });
        }

        $scope.$watch(
            function () {
                if (self.locals && self.locals.data && self.locals.data.selected_rating_source) {
                    return self.locals.data.selected_rating_source;
                }
                return undefined;
            },
            function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (self.locals && self.locals.ratingsaddform && self.locals.ratingsaddform.ratingType) {
                        self.locals.ratingsaddform.ratingType.$touched = false;
                    }
                    if (newValue) {
                        self.locals.typeOptions = [];
                        self.locals.data.rating_type.forEach(function (item) {
                            if ((item.source_id === self.locals.data.selected_rating_source.id) || ((self.locals.data.selected_rating_source.is_system === false) && (!(item.source_id)))) {
                                self.locals.typeOptions.push(item);
                            }
                        });
                    } else {
                        setTypeOptionsNonSystem();
                    }
                }
            }
        );

        $scope.$watch(
            function () {
                if (self.locals && self.locals.data && self.locals.data.selected_rating_type) {
                    return self.locals.data.selected_rating_type;
                }
                return undefined;
            },
            function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (newValue) {
                        self.locals.data.selected_value = "";
                        if ((self.locals.data.selected_rating_type.id) && (self.locals.data.selected_rating_type.data_type === 3)) {
                            self.locals.data.selected_value = new Date();
                        } else if ((self.locals.data.selected_rating_type.id) && (self.locals.data.selected_rating_type.data_type === 5)) {
                            self.locals.data.selected_value = self.locals.yesno[1].value;
                        } else if ((self.locals.data.selected_rating_type.id) && (self.locals.data.selected_rating_type.data_type === 6)) {
                            var ratingTypeId = self.locals.data.selected_rating_type.id;

                            if (!(codeTableEntriesCache[ratingTypeId])) {
                                bbWait.beginPageWait();
                                bbData.load({
                                    data: 'prospectui/ratings/codetableentries/' + ratingTypeId
                                }).then(function (result) {
                                    codeTableEntriesCache[ratingTypeId] = result.data;
                                    self.locals.codeTableOptions = codeTableEntriesCache[ratingTypeId];
                                    bbWait.endPageWait();
                                }).catch(function () {
                                    bbWait.endPageWait();
                                });
                            } else {
                                self.locals.codeTableOptions = codeTableEntriesCache[ratingTypeId];
                            }
                        }
                    }
                }
            }
        );
    }

    BehaviorAddController.$inject = ['$scope', 'formOptions', 'loadResult', '$uibModalInstance', 'bbData', 'bbEventTracker', 'bbFuzzyDateFormatter', 'bbWait', 'bbToast'];

    function RatingAddForm(bbData, bbModal, bbWait) {
        return {
            openForm: function (options) {
                return bbModal.open({
                    templateUrl: 'prospectviews/constituentratingslist/constituentratingadd.html',
                    controller: 'ConstituentRatingAddController as addController',
                    resolve: {
                        formOptions: function () {
                            return {
                                constituentId: options.constituentId
                            };
                        },
                        loadResult: function () {
                            bbWait.beginPageWait();

                            var promise = bbData.load({
                                data: 'prospectui/constituents/' + options.constituentId + '/ratings/add',
                                resources: 'prospectui/resources'
                            });

                            promise
                                .then(function () {
                                    bbWait.endPageWait();
                                }).catch(function () {
                                    bbWait.endPageWait();
                                    return null;
                                });

                            return promise;
                        }
                    }
                }).result;
            }
        };
    }

    RatingAddForm.$inject = ['bbData', 'bbModal', 'bbWait'];

    angular.module('barkbaud')
        .controller('BehaviorAddController', BehaviorAddController)
        .service('RatingAddForm', RatingAddForm);

}());
/*jslint browser: false */
/*global angular */

(function () {
    'use strict';

    function BehaviorEditController(formOptions, loadResult, $uibModalInstance, bbData, bbEventTracker, bbDatepickerConfig, bbWait, bbToast) {

        var FORM_NAME = 'Ratings Edit Form',
            initialTime = new Date().getTime(),
            initialData = angular.copy(loadResult.data),
            self = this,
            dataUrl = 'prospectui/ratings/' + formOptions.ratingId;

        bbEventTracker.trackFormLoaded({ form_name: FORM_NAME });

        // we will eventually call this when there is support in Sky for invoking custom modal close event handler
        function closeForm() {
            bbEventTracker.trackFormClosed({ form_name: FORM_NAME, final_data: self.locals.data, initial_data: initialData, start_time: initialTime });
        }

        function save() {

            if (self.locals.ratingseditform.$valid) {

                self.locals.errorMessage = '';
                self.locals.isSaving = true;

                bbEventTracker.trackFormSaved({ form_name: FORM_NAME, final_data: self.locals.data, initial_data: initialData, start_time: initialTime });

                var dataToSave = {};

                dataToSave = {
                    date: self.locals.data.date,
                    comments: self.locals.data.comments,
                    value: self.locals.data.selected_value
                };

                bbWait.beginPageWait();

                bbData.save({
                    url: dataUrl,
                    data: dataToSave
                }).then(function () {
                    $uibModalInstance.close();
                    bbWait.endPageWait();
                    bbToast.open({
                        message: self.locals.resources.ratings_form_save_success,
                        toastType: "success"
                    });
                }).catch(function (response) {
                    if (response && response.data && response.data[0] && response.data[0].Message) {
                        self.locals.errorMessage = response.data[0].Message;
                    } else {
                        self.locals.errorMessage = self.locals.resources.ratings_form_save_error;
                    }
                    self.locals.isSaving = false;
                    bbWait.endPageWait();
                });
            } else {
                self.locals.errorMessage = self.locals.resources.ratings_form_save_error;
            }
        }

        if (loadResult.httpResults.data.status === 200) {

            self.locals = {
                loadErrorOccurred: false,
                data: loadResult.data,
                resources: loadResult.resources,
                isSaving: false,
                save: save,
                dateFormat: bbDatepickerConfig.currentCultureDateFormatString,
                closeForm: closeForm,
                yesno: [{
                    value: true,
                    label: loadResult.resources.proposal_custom_field_yes
                }, {
                    value: false,
                    label: loadResult.resources.proposal_custom_field_no
                }],
                minDate: new Date(1753, 1, 1),
                maxDate: new Date(9999, 1, 1),
                numberValueSettings: {
                    mDec: 0,
                    vMin: -0,
                    vMax: 2147483647.1
                },
                errorMessage: ""
            };

            self.locals.data.selected_value = "";
            if (self.locals.data.data_type === 6) {
                self.locals.data.table_entries.forEach(function (item) {
                    if (item.description === self.locals.data.value) {
                        self.locals.data.selected_value = item.id;
                    }
                });
            } else {
                self.locals.data.selected_value = self.locals.data.value;
            }
        } else {
            self.locals = { loadErrorOccurred: true };

            //Load failed so just getting resources for form to display failure
            bbWait.beginPageWait();
            bbData.load({
                resources: 'prospectui/resources'
            }).then(function (result) {
                self.locals.resources = result.resources;
                bbWait.endPageWait();
            }).catch(function () {
                bbWait.endPageWait();
            });
        }
    }

    BehaviorEditController.$inject = ['formOptions', 'loadResult', '$uibModalInstance', 'bbData', 'bbEventTracker', 'bbDatepickerConfig', 'bbWait', 'bbToast'];

    function RatingEditForm(bbData, bbModal, bbWait) {
        return {
            openForm: function (options) {
                return bbModal.open({
                    templateUrl: 'dogs/behaviortraining/behavioredit.html',
                    controller: 'BehaviorEditController as editController',
                    resolve: {
                        formOptions: function () {
                            return {
                                constituentId: options.constituentId,
                                ratingId: options.ratingId
                            };
                        },
                        loadResult: function () {
                            bbWait.beginPageWait();

                            var promise = bbData.load({
                                data: 'prospectui/ratings/' + options.ratingId,
                                resources: 'prospectui/resources'
                            });

                            promise
                                .then(function () {
                                    bbWait.endPageWait();
                                }).catch(function () {
                                    bbWait.endPageWait();
                                    return null;
                                });

                            return promise;
                        }
                    }
                }).result;
            }
        };
    }

    RatingEditForm.$inject = ['bbData', 'bbModal', 'bbWait'];

    angular.module('barkbaud')
        .controller('BehaviorEditController', BehaviorEditController)
        .service('RatingEditForm', RatingEditForm);
}());
/*jshint es5: true */
/*jslint browser: false */
/*global angular */

(function () {
    'use strict';

    function DogBehaviorTrainingTileController($scope, bbData, bbPaging, bbDatepickerConfig, RatingAddForm, dogId) {

        $scope.range = function (size) {
            return new Array(size);
        };

        function calculateTileCount(data) {
            if (!data.custom_ratings) {
                return;
            }

            var tileCount = data.custom_ratings.length;

            if (data.minimum_asset_rating || data.maximum_asset_rating) {
                tileCount += 1;
            }

            if (data.minimum_ask_rating || data.maximum_ask_rating) {
                tileCount += 1;
            }

            if (data.overall_wealth_rating) {
                tileCount += 1;
            }

            if (data.donor_type_rating) {
                tileCount += 1;
            }

            return tileCount;
        }

        function loadData(ratingCategory) {

            var data,
                locals,
                pagingConfig = {};

            locals = $scope.locals;

            return bbData.load({
                data: 'api/dogs/' + encodeURIComponent(dogId) + '/ratings',
                loadManager: {
                    scope: $scope,
                    name: 'DogBehaviorTrainingTileController'
                }
            }).then(function (result) {
                $scope.data = data = result.data;
                $scope.resources = result.resources;

                var ratingPageToDisplay = 1,
                    i = 0,
                    itemsPerPage,
                    totalItems;

                if (ratingTypeId) {

                    //Set Initial Display Page
                    if ($scope.data.value) {
                        totalItems = $scope.data.value.length || 0;
                    }

                    if ($scope.locals.paged_ratings) {
                        itemsPerPage = $scope.locals.paged_ratings.itemsPerPage || 5;
                    }

                    for (i = 0; i < totalItems; i += 1) {
                        if ($scope.data.value[i].category.name === ratingCategory) {
                            ratingPageToDisplay = Math.ceil(((i + 1) / itemsPerPage));
                            break;
                        }
                    }
                }

                pagingConfig.currentPage = ratingPageToDisplay;

                $scope.locals.paged_ratings = bbPaging.init(result.data.custom_ratings, pagingConfig);
                $scope.locals.dateFormat = bbDatepickerConfig.currentCultureDateFormatString;
                $scope.locals.tileCount = calculateTileCount(data);
            }).catch(function () {
                $scope.locals.tileIsVisible = false;
            });
        }

        function showRatingsAddForm() {
            bbConstituentRatingAddForm.openForm({ constituentId: $stateParams.id }).then(function (ratingTypeId) {
                loadData(ratingTypeId);
            });
        }

        $scope.locals = {
            max_star_rating: 5,
            showRatingsAddForm: showRatingsAddForm,
            reloadData: loadData,
            numericFieldOptions: {
                mDec: 0 // No decimal places
            }
        };

        loadData();
    }

    DogBehaviorTrainingTileController.$inject = ['$scope', 'bbData', 'bbPaging', 'bbDatepickerConfig', 'RatingAddForm'];

    function ratingsList(bbModal, bbWait, bbData, bbDatepickerConfig, bbConstituentRatingEditForm) {

        function link(scope) {
            scope.locals = {
                dateFormat: bbDatepickerConfig.currentCultureDateFormatString
            };

            scope.showRatingsEditForm = function (ratingId) {
                bbConstituentRatingEditForm.openForm({ constituentId: scope.constituentId, ratingId: ratingId }).then(function (ratingTypeId) {
                    scope.reloadData(ratingTypeId);
                });
            };

            scope.deleteRating = function (ratingId) {
                return bbData.save({ url: 'prospectui/ratings/' + ratingId, type: 'delete' }).then(function () {
                    scope.reloadData();
                });
            };
        }

        return {
            restrict: 'E',
            link: link,
            scope: {
                ratings: '=',
                canEditRatings: '=',
                canDeleteRatings: '=',
                resources: '=',
                reloadData: '='
            },
            templateUrl: 'dogs/behaviortraining/behaviortrainingtile.html'
        };
    }

    ratingsList.$inject = ['bbModal', 'bbWait', 'bbData', 'bbDatepickerConfig', 'RatingEditForm'];

    angular.module('barkbaud')
        .controller('DogBehaviorTrainingTileController', DogBehaviorTrainingTileController)
        .directive('ratingsList', ratingsList);
}());
/*global angular */

(function () {
    'use strict';

    function DogCurrentHomeTileController($rootScope, $scope, bbData, bbMoment, barkFindHome, dogId) {
        var self = this;

        self.load = function () {
            $scope.$emit('bbBeginWait', { nonblocking: true });
            bbData.load({
                data: 'api/dogs/' + encodeURIComponent(dogId) + '/currenthome'
            }).then(function (result) {
                self.currentHome = result.data;
                $scope.$emit('bbEndWait', { nonblocking: true });
            }).catch(function (result) {
                self.error = result.data.error;
                $scope.$emit('bbEndWait', { nonblocking: true });
            });
        };

        self.getTimeInHome = function (fromDate) {
            var fromDateMoment = bbMoment(fromDate);
            return 'since ' + fromDateMoment.format('L') + ' (' + fromDateMoment.startOf('month').fromNow(true) + ')';
        };

        self.findHome = function () {
            barkFindHome.open(dogId).result.then(function () {
                self.load();
                $rootScope.$broadcast('bbNewCurrentOwner');
            });
        };

        self.load();
    }

    DogCurrentHomeTileController.$inject = [
        '$rootScope',
        '$scope',
        'bbData',
        'bbMoment',
        'barkFindHome',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('DogCurrentHomeTileController', DogCurrentHomeTileController);
}());

/*global angular */

(function () {
    'use strict';

    function FindHomeController($uibModalInstance, bbData, dogId) {
        var self = this;

        self.search = function (searchText) {

            if (searchText && searchText.length > 0) {
                return bbData.load({
                    data: 'api/dogs/' + dogId + '/findhome?searchText=' + searchText
                }).then(function (results) {
                    self.results = results.data.value;
                }).catch(function (result) {
                    self.error = result.data.error;
                });
            }
        };

        self.saveData = function () {
            if (self.constituent) {
                bbData.save({
                    url: 'api/dogs/' + dogId + '/currenthome',
                    data: self.constituent,
                    type: 'POST'
                }).then(function (result) {
                    $uibModalInstance.close(result.data);
                }).catch(function (result) {
                    self.error = result.data.error;
                });
            }
        };
    }

    FindHomeController.$inject = [
        '$uibModalInstance',
        'bbData',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('FindHomeController', FindHomeController);
}());

/*global angular */

(function () {
    'use strict';

    function barkFindHome(bbModal) {
        return {
            open: function (dogId) {
                return bbModal.open({
                    controller: 'FindHomeController as findHome',
                    templateUrl: 'dogs/currenthome/findhome.html',
                    resolve: {
                        dogId: function () {
                            return dogId;
                        }
                    }
                });
            }
        };
    }

    barkFindHome.$inject = ['bbModal'];

    angular.module('barkbaud')
        .factory('barkFindHome', barkFindHome);
}());

/*global angular */

(function () {
    'use strict';

    function dogPageConfig($stateProvider) {
        $stateProvider
            .state('dog', {
                abstract: true,
                controller: 'DogPageController as dogPage',
                templateUrl: 'dogs/dogpage.html',
                url: '/dogs/:dogId',
                resolve: {
                    dogId: ['$stateParams', function ($stateParams) {
                        return $stateParams.dogId;
                    }]
                }
            })
            .state('dog.views', {
                url: '',
                views: {
                    'currenthome': {
                        controller: 'DogCurrentHomeTileController as dogCurrentHomeTile',
                        templateUrl: 'dogs/currenthome/currenthometile.html'
                    },
                    'previoushomes': {
                        controller: 'DogPreviousHomesTileController as dogPreviousHomesTile',
                        templateUrl: 'dogs/previoushomes/previoushomestile.html'
                    },
                    'notes': {
                        controller: 'DogNotesTileController as dogNotesTile',
                        templateUrl: 'dogs/notes/notestile.html'
                    },
                    'behaviortraining': {
                        controller: 'DogBehaviorTrainingTileController as dogBehaviorTrainingTile',
                        templateUrl: 'dogs/behaviortraining/behaviortrainingtile.html'
                    },
                }
            });
    }

    dogPageConfig.$inject = ['$stateProvider'];

    angular.module('barkbaud')
        .config(dogPageConfig);
}());

/*global angular */

(function () {
    'use strict';

    function DogPageController($scope, $stateParams, bbData, bbWindow, dogId) {
        var self = this;

        self.tiles = [
            {
                id: 'DogCurrentHomeTile',
                view_name: 'currenthome',
                collapsed: false,
                collapsed_small: false
            },
            {
                id: 'DogPreviousHomesTile',
                view_name: 'previoushomes',
                collapsed: false,
                collapsed_small: false
            },
            {
                id: 'DogNotesTile',
                view_name: 'notes',
                collapsed: false,
                collapsed_small: false
            },
            {
                id: 'DogBehaviorTrainingTile',
                view_name: 'behaviortraining',
                collapsed: false,
                collapsed_small: false
            }
        ];

        self.layout = {
            one_column_layout: [
                'DogCurrentHomeTile',
                'DogPreviousHomesTile',
                'DogNotesTile',
                'DogBehaviorTrainingTile'
            ],
            two_column_layout: [
                [
                    'DogCurrentHomeTile',
                    'DogPreviousHomesTile'
                ],
                [
                    'DogNotesTile',
                    'DogBehaviorTrainingTile'
                ]
            ]
        };

        bbData.load({
            data: 'api/dogs/' + encodeURIComponent(dogId)
        }).then(function (result) {
            self.dog = result.data;
            bbWindow.setWindowTitle(self.dog.name);
        });
    }

    DogPageController.$inject = [
        '$scope',
        '$stateParams',
        'bbData',
        'bbWindow',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('DogPageController', DogPageController);
}());

/*global angular */

(function () {
    'use strict';

    function NoteAddController($uibModalInstance, bbData, dogId) {
        var self = this;

        bbData.load({
            data: 'api/dogs/notetypes'
        }).then(function (result) {
            self.noteTypes = result.data.value;
        });

        self.note = {};
        self.saveData = function () {
            bbData.save({
                url: 'api/dogs/' + dogId + '/notes',
                data: self.note,
                type: 'POST'
            }).then(function (result) {
                $uibModalInstance.close(result.data);
            }).catch(function (result) {
                self.error = result.data.error;
            });
        };
    }

    NoteAddController.$inject = [
        '$uibModalInstance',
        'bbData',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('NoteAddController', NoteAddController);
}());

/*global angular */

(function () {
    'use strict';

    function barkNoteAdd(bbModal) {
        return {
            open: function (dogId) {
                return bbModal.open({
                    controller: 'NoteAddController as noteAdd',
                    templateUrl: 'dogs/notes/noteadd.html',
                    resolve: {
                        dogId: function () {
                            return dogId;
                        }
                    }
                });
            }
        };
    }

    barkNoteAdd.$inject = ['bbModal'];

    angular.module('barkbaud')
        .factory('barkNoteAdd', barkNoteAdd);
}());

/*global angular */

(function () {
    'use strict';

    function DogNotesTileController($scope, bbData, bbMoment, barkNoteAdd, dogId) {
        var self = this;

        self.load = function () {
            $scope.$emit('bbBeginWait', { nonblocking: true });
            bbData.load({
                data: 'api/dogs/' + encodeURIComponent(dogId) + '/notes'
            }).then(function (result) {
                self.notes = result.data.value;
                $scope.$emit('bbEndWait', { nonblocking: true });
            }).catch(function (result) {
                self.error = result.data.error;
                $scope.$emit('bbEndWait', { nonblocking: true });
            });
        };

        self.getNoteDate = function (date) {
            if (date && date.iso) {
                return bbMoment(date.iso).calendar();
            }
        };

        self.addNote = function () {
            barkNoteAdd.open(dogId).result.then(self.load);
        };

        self.load();
    }

    DogNotesTileController.$inject = [
        '$scope',
        'bbData',
        'bbMoment',
        'barkNoteAdd',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('DogNotesTileController', DogNotesTileController);
}());

/*global angular */

(function () {
    'use strict';

    function DogPreviousHomesTileController($scope, bbData, bbMoment, dogId) {
        var self = this;

        self.load = function () {
            $scope.$emit('bbBeginWait', { nonblocking: true });
            bbData.load({
                data: 'api/dogs/' + encodeURIComponent(dogId) + '/previoushomes'
            }).then(function (result) {
                self.previousHomes = result.data.value;
                $scope.$emit('bbEndWait', { nonblocking: true });
            }).catch(function (result) {
                self.error = result.data.error;
                $scope.$emit('bbEndWait', { nonblocking: true });
            });
        };

        self.getSummaryDate = function (date) {
            if (date) {
                return bbMoment(date).format('MMM Do YY');
            }
        };

        $scope.$on('bbNewCurrentOwner', function () {
            self.load();
        });

        self.load();
    }

    DogPreviousHomesTileController.$inject = [
        '$scope',
        'bbData',
        'bbMoment',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('DogPreviousHomesTileController', DogPreviousHomesTileController);
}());


/*global angular */

(function () {
    'use strict';

    function DogSummaryTileController($timeout, bbData, bbMoment, dogId) {
        var self = this;

        bbData.load({
            data: 'api/dogs/' + encodeURIComponent(dogId) + '/summary'
        }).then(function (result) {
            self.summary = result.data;
        });

        self.getSummaryDate = function (date) {
            if (date && date.iso) {
                return bbMoment(date.iso).format('MMM Do YY');
            }
        };
    }

    DogSummaryTileController.$inject = ['$timeout', 'bbData', 'bbMoment', 'dogId'];

    angular.module('barkbaud')
        .controller('DogSummaryTileController', DogSummaryTileController);
}());

/*global angular */

(function () {
    'use strict';

    function LoginPageController($location, $window, bbWait, bbWindow, barkbaudAuthService, barkbaudRedirect) {
        var self = this;

        self.error = $location.search().error;
        self.logout = barkbaudAuthService.logout;

        self.login = function () {
            barkbaudAuthService.login(barkbaudRedirect);
        };

        bbWindow.setWindowTitle('Login');

        self.waitingForAuth = true;
        barkbaudAuthService.isAuthenticated().then(function (authenticated) {
            self.waitingForAuth = false;
            if (authenticated) {
                barkbaudAuthService.update(authenticated);
            }
        });

    }

    LoginPageController.$inject = [
        '$location',
        '$window',
        'bbWait',
        'bbWindow',
        'barkbaudAuthService',
        'barkbaudRedirect'
    ];

    angular.module('barkbaud')
        .controller('LoginPageController', LoginPageController);
}());

angular.module('barkbaud.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('components/photo.directive.html',
        '<div class="bark-photo img-circle center-block">\n' +
        '</div>\n' +
        '');
    $templateCache.put('dashboard/dashboardpage.html',
        '<div class="container-fluid">\n' +
        '  <h1>Dashboard</h1>\n' +
        '  <section class="panel" ng-repeat="dog in dashboardPage.dogs">\n' +
        '    <div class="panel-body">\n' +
        '      <div class="row">\n' +
        '          <div class="col-md-3 col-lg-2">\n' +
        '            <a ui-sref="dog.views({ dogId: dog._id })">\n' +
        '              <bark-photo bark-photo-base64="dog.image.data"></bark-photo>\n' +
        '            </a>\n' +
        '          </div>\n' +
        '          <div class="col-md-9 col-lg-10">\n' +
        '              <h1>\n' +
        '                <a ui-sref="dog.views({ dogId: dog._id })">{{ dog.name }}</a>\n' +
        '              </h1>\n' +
        '              <h4>{{ dog.breed }} &middot; {{ dog.gender }}</h4>\n' +
        '              <p class="bb-text-block bark-dog-bio">{{ dog.bio }}</p>\n' +
        '          </div>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </section>\n' +
        '  <div bb-tile-section class="text-danger" ng-show="dashboardPage.error">\n' +
        '    Error loading dogs.\n' +
        '  </div>\n' +
        '</div>\n' +
        '');
    $templateCache.put('dogs/behaviortraining/behavioradd.html',
        '<bb-modal id="RatingsAdd" data-bbauto-view="ConstituentRatingAdd" class="bb-ratingform">\n' +
        '    <div ng-if="!addController.locals.loadErrorOccurred">\n' +
        '        <bb-modal-header bb-modal-help-key="\'bb-custom-ratings.html\'" data-bbauto-field="Header">\n' +
        '            <span ng-if="addController.locals.data.constituent_name" bb-template="::addController.locals.resources.ratings_form_add_title">\n' +
        '                <span bb-template-item>{{addController.locals.data.constituent_name}}</span>\n' +
        '            </span>\n' +
        '            <span ng-if="!addController.locals.data.constituent_name">{{::addController.locals.resources.ratings_form_add_default_header}}</span>\n' +
        '        </bb-modal-header>\n' +
        '        <form name="addController.locals.ratingsaddform" novalidate ng-submit="addController.locals.save()">\n' +
        '            <div bb-modal-body>\n' +
        '                <div class="row">\n' +
        '                    <div class="form-group col-sm-4">\n' +
        '                        <label for="ratingSource" class="control-label">{{::addController.locals.resources.ratings_form_addedit_source}}</label>\n' +
        '                        <select id="ratingSource"\n' +
        '                                name="ratingSource"\n' +
        '                                class="form-control"\n' +
        '                                ng-model="addController.locals.data.selected_rating_source"\n' +
        '                                ng-class="{\'submitted\': addController.locals.ratingsaddform.$submitted}"\n' +
        '                                ng-options="rating_source as rating_source.description for rating_source in addController.locals.sourceOptions"\n' +
        '                                data-bbauto-field="RatingSource">\n' +
        '                            <option value=""></option>\n' +
        '                        </select>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-sm-4">\n' +
        '                        <label for="ratingType" class="control-label required">{{::addController.locals.resources.ratings_form_addedit_category}}</label>\n' +
        '                        <select id="ratingType"\n' +
        '                                name="ratingType"\n' +
        '                                class="form-control"\n' +
        '                                required ng-model="addController.locals.data.selected_rating_type"\n' +
        '                                ng-class="{\'submitted\': addController.locals.ratingsaddform.$submitted}"\n' +
        '                                ng-options="rating_type as rating_type.description for rating_type in addController.locals.typeOptions"\n' +
        '                                data-bbauto-field="RatingType">\n' +
        '                            <option value=""></option>\n' +
        '                        </select>\n' +
        '                        <div ng-messages="addController.locals.ratingsaddform.ratingType.$error" ng-if="addController.locals.ratingsaddform.ratingType.$touched">\n' +
        '                            <label for="ratingType" class="error errormessage" ng-message="required">{{::addController.locals.resources.ratings_form_type_required}}</label>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-sm-4">\n' +
        '                        <label class="control-label required">{{::addController.locals.resources.ratings_form_addedit_date}}</label>\n' +
        '                        <bb-datepicker required\n' +
        '                                       bb-datepicker-name="ratingDate"\n' +
        '                                       ng-model="addController.locals.data.selected_rating_date"\n' +
        '                                       data-bbauto-field="RatingDate"\n' +
        '                                       bb-datepicker-min="addController.locals.minDate"\n' +
        '                                       bb-datepicker-max="addController.locals.maxDate"\n' +
        '                                       bb-datepicker-append-to-body="true">\n' +
        '                        </bb-datepicker>\n' +
        '                        <div ng-messages="addController.locals.ratingsaddform.ratingDate.$error" ng-if="addController.locals.ratingsaddform.ratingDate.$touched">\n' +
        '                            <label for="ratingDate" class="error errormessage" ng-message="required" data-bbauto-field="RatingDateError">{{::addController.locals.resources.ratings_form_date_required}}</label>\n' +
        '                            <label for="ratingDate" class="error errormessage" ng-message="dateFormat" data-bbauto-field="RatingDateError">{{::addController.locals.resources.ratings_form_date_invalid_format}}</label>\n' +
        '                            <label for="ratingDate" class="error errormessage" ng-message="minDate" data-bbauto-field="RatingDateError">{{::addController.locals.resources.prospect_invalid_date}}</label>\n' +
        '                            <label for="ratingDate" class="error errormessage" ng-message="maxDate" data-bbauto-field="RatingDateError">{{::addController.locals.resources.prospect_invalid_date}}</label>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '                <div class="form-group">\n' +
        '                    <label class="control-label">{{::addController.locals.resources.ratings_form_addedit_description}}</label>\n' +
        '                    <span ng-switch="addController.locals.data.selected_rating_type.data_type">\n' +
        '                        <!--None selected -->\n' +
        '                        <input type="text" class="form-control bb-prospectui-no-animate" ng-disabled="true" ng-if="!addController.locals.data.selected_rating_type" data-bbauto-field="NoneValue" />\n' +
        '                        <!--Unknown = 0,-->\n' +
        '                        <input type="text" name="unknownValue" class="form-control bb-prospectui-no-animate" ng-model="addController.locals.data.selected_value" ng-switch-when="0" ng-maxlength="255" data-bbauto-field="UnknownValue" />\n' +
        '                        <!--Text = 1,-->\n' +
        '                        <input type="text" name="textValue" class="form-control bb-prospectui-no-animate" ng-model="addController.locals.data.selected_value" ng-switch-when="1" ng-maxlength="255" data-bbauto-field="TextValue" />\n' +
        '                        <!--Number = 2, -->\n' +
        '                        <input type="text" name="numberValue" class="form-control bb-prospectui-no-animate" ng-model="addController.locals.data.selected_value" ng-switch-when="2" bb-autonumeric="number" bb-autonumeric-settings="addController.locals.numberValueSettings" data-bbauto-field="NumberValue">\n' +
        '                        <!--Date = 3, -->\n' +
        '                        <bb-datepicker bb-datepicker-name="dateValue"\n' +
        '                                       ng-model="addController.locals.data.selected_value"\n' +
        '                                       ng-switch-when="3"\n' +
        '                                       data-bbauto-field="DateValue"\n' +
        '                                       bb-datepicker-min="addController.locals.minDate"\n' +
        '                                       bb-datepicker-max="addController.locals.maxDate"\n' +
        '                                       bb-datepicker-append-to-body="true">\n' +
        '                        </bb-datepicker>\n' +
        '                        <!--Currency = 4, -->\n' +
        '                        <input type="text" class="form-control bb-prospectui-no-animate" ng-model="addController.locals.data.selected_value" ng-switch-when="4" bb-autonumeric="money" data-bbauto-field="CurrencyValue">\n' +
        '                        <!--Boolean = 5, -->\n' +
        '                        <select class="form-control bb-prospectui-no-animate"\n' +
        '                                ng-model="addController.locals.data.selected_value"\n' +
        '                                ng-options="yes_or_no.value as yes_or_no.label for yes_or_no in addController.locals.yesno"\n' +
        '                                data-bbauto-field="BooleanValue"\n' +
        '                                ng-switch-when="5"></select>\n' +
        '                        <!--CodeTableEntry = 6, -->\n' +
        '                        <select class="form-control bb-prospectui-no-animate"\n' +
        '                                ng-model="addController.locals.data.selected_value"\n' +
        '                                ng-options="code_table_entry.id as code_table_entry.description for code_table_entry in addController.locals.codeTableOptions"\n' +
        '                                data-bbauto-field="CodeTableValue"\n' +
        '                                ng-switch-when="6">\n' +
        '                        </select>\n' +
        '                    </span>\n' +
        '                    <div ng-messages="addController.locals.ratingsaddform.textValue.$error">\n' +
        '                        <label class="error errormessage" ng-message="maxlength" data-bbauto-field="TextValueError">{{::addController.locals.resources.proposal_custom_field_add_text_value_max_length}}</label>\n' +
        '                    </div>\n' +
        '                    <div ng-messages="addController.locals.ratingsaddform.dateValue.$error">\n' +
        '                        <label class="error errormessage" ng-message="dateFormat" data-bbauto-field="DateValueError">{{addController.locals.ratingsaddform.dateValue.invalidFormatMessage}}</label>\n' +
        '                        <label class="error errormessage" ng-message="minDate" data-bbauto-field="DateValueError">{{::addController.locals.resources.prospect_invalid_date}}</label>\n' +
        '                        <label class="error errormessage" ng-message="maxDate" data-bbauto-field="DateValueError">{{::addController.locals.resources.prospect_invalid_date}}</label>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '                <div class="form-group">\n' +
        '                    <label for="ratingComments" class="control-label">{{::addController.locals.resources.ratings_form_addedit_comments}}</label>\n' +
        '                    <div class="textarea-container bb-prospectui-summarynote-textarea">\n' +
        '                        <textarea class="form-control" form="ratingComments" data-bbauto-field="Comments" ng-model="addController.locals.data.selected_rating_comments" rows="2" maxlength="255" placeholder="{{::addController.locals.resources.ratings_form_addedit_comments_placeholder}}"></textarea>\n' +
        '                    </div>\n' +
        '                    <div ng-messages="addController.locals.ratingsaddform.ratingComments.$error">\n' +
        '                        <label class="error errormessage" ng-message="maxlength" data-bbauto-field="CommentError">{{::addController.locals.resources.proposal_custom_field_add_text_value_max_length}}</label>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <bb-modal-footer>\n' +
        '                <div ng-if="addController.locals.errorMessage" class="text-danger">{{addController.locals.errorMessage}}</div>\n' +
        '                <bb-modal-footer-button-primary data-bbauto-field="SaveButton" ng-disabled="!addController.locals.ratingsaddform.$valid || addController.locals.isSaving" ng-click="locals.select()">{{::addController.locals.resources.form_button_save}}</bb-modal-footer-button-primary>\n' +
        '                <bb-modal-footer-button-cancel data-bbauto-field="CancelButton"></bb-modal-footer-button-cancel>\n' +
        '            </bb-modal-footer>\n' +
        '        </form>\n' +
        '    </div>\n' +
        '    <div ng-if="addController.locals.loadErrorOccurred">\n' +
        '        <bb-modal-header data-bbauto-field="Header">\n' +
        '            {{::addController.locals.resources.ratings_form_addedit_errorHeader}}\n' +
        '        </bb-modal-header>\n' +
        '        <bb-error>\n' +
        '            <bb-error-image>\n' +
        '                <img src=\'data:image/png;base64,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\' />\n' +
        '            </bb-error-image>\n' +
        '            <bb-error-title>\n' +
        '                {{::addController.locals.resources.ratings_form_addedit_errorTitle}}\n' +
        '            </bb-error-title>\n' +
        '            <bb-error-description>\n' +
        '                {{::addController.locals.resources.ratings_form_addedit_errorDescription}}\n' +
        '            </bb-error-description>\n' +
        '        </bb-error>\n' +
        '        <bb-modal-footer>\n' +
        '            <bb-modal-footer-button-cancel data-bbauto-field="CancelButton"></bb-modal-footer-button-cancel>\n' +
        '        </bb-modal-footer>\n' +
        '    </div>\n' +
        '</bb-modal>');
    $templateCache.put('dogs/behaviortraining/behavioredit.html',
        '<bb-modal id="RatingsEdit" data-bbauto-view="ConstituentRatingEdit" class="bb-ratingform">\n' +
        '    <div ng-if="!editController.locals.loadErrorOccurred">\n' +
        '        <bb-modal-header bb-modal-help-key="\'bb-custom-ratings.html\'" data-bbauto-field="Header">\n' +
        '            <span ng-if="editController.locals.data.constituent_name" bb-template="::editController.locals.resources.ratings_form_edit_title">\n' +
        '                <span bb-template-item>{{editController.locals.data.constituent_name}}</span>\n' +
        '            </span>\n' +
        '            <span ng-if="!editController.locals.data.constituent_name">{{::editController.locals.resources.ratings_form_edit_default_header}}</span>\n' +
        '        </bb-modal-header>\n' +
        '        <form name="editController.locals.ratingseditform" novalidate ng-submit="editController.locals.save()">\n' +
        '            <div bb-modal-body>\n' +
        '                <div class="row">\n' +
        '                    <div class="form-group col-sm-4">\n' +
        '                        <label for="ratingSource" class="control-label">{{::editController.locals.resources.ratings_form_addedit_source}}</label>\n' +
        '                        <input id="ratingSource"\n' +
        '                             class="form-control" readonly\n' +
        '                             name="ratingSource"\n' +
        '                             ng-model="editController.locals.data.source"\n' +
        '                             data-bbauto-field="RatingSource"/>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-sm-4">\n' +
        '                        <label for="ratingType" class="control-label">{{::editController.locals.resources.ratings_form_addedit_category}}</label>\n' +
        '                        <input id="ratingType"\n' +
        '                                name="ratingType"\n' +
        '                                class="form-control" readonly\n' +
        '                                ng-model="editController.locals.data.rating_type"\n' +
        '                                data-bbauto-field="RatingType"/>\n' +
        '                    </div>\n' +
        '                    <div class="form-group col-sm-4">\n' +
        '                        <label class="control-label required">{{::editController.locals.resources.ratings_form_addedit_date}}</label>\n' +
        '                        <bb-datepicker required\n' +
        '                                       bb-datepicker-name="ratingDate"\n' +
        '                                       ng-model="editController.locals.data.date"\n' +
        '                                       data-bbauto-field="RatingDate"\n' +
        '                                       bb-datepicker-min="editController.locals.minDate"\n' +
        '                                       bb-datepicker-max="editController.locals.maxDate"\n' +
        '                                       bb-date-format="editController.locals.dateFormat"\n' +
        '                                       bb-datepicker-append-to-body="true">\n' +
        '                        </bb-datepicker>\n' +
        '                        <div ng-messages="editController.locals.ratingseditform.ratingDate.$error" ng-if="editController.locals.ratingseditform.ratingDate.$touched">\n' +
        '                            <label for="ratingDate" class="error errormessage" ng-message="required" data-bbauto-field="RatingDateError">{{::editController.locals.resources.ratings_form_date_required}}</label>\n' +
        '                            <label for="ratingDate" class="error errormessage" ng-message="dateFormat" data-bbauto-field="RatingDateError">{{::editController.locals.resources.ratings_form_date_invalid_format}}</label>\n' +
        '                            <label for="ratingDate" class="error errormessage" ng-message="minDate" data-bbauto-field="RatingDateError">{{::editController.locals.resources.prospect_invalid_date}}</label>\n' +
        '                            <label for="ratingDate" class="error errormessage" ng-message="maxDate" data-bbauto-field="RatingDateError">{{::editController.locals.resources.prospect_invalid_date}}</label>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '                <div class="form-group">\n' +
        '                    <label class="control-label">{{::editController.locals.resources.ratings_form_addedit_description}}</label>\n' +
        '                    <span ng-switch="editController.locals.data.data_type">\n' +
        '                        <!--Unknown = 0,-->\n' +
        '                        <input type="text" name="unknownValue" class="form-control bb-prospectui-no-animate" ng-model="editController.locals.data.selected_value" ng-switch-when="0" ng-maxlength="255" data-bbauto-field="UnknownValue" />\n' +
        '                        <!--Text = 1,-->\n' +
        '                        <input type="text" name="textValue" class="form-control bb-prospectui-no-animate" ng-model="editController.locals.data.selected_value" ng-switch-when="1" ng-maxlength="255" data-bbauto-field="TextValue" />\n' +
        '                        <!--Number = 2, -->\n' +
        '                        <input type="text" name="numberValue" class="form-control bb-prospectui-no-animate" ng-model="editController.locals.data.selected_value" ng-switch-when="2" bb-autonumeric="number" bb-autonumeric-settings="editController.locals.numberValueSettings" data-bbauto-field="NumberValue">\n' +
        '                        <!--Date = 3, -->\n' +
        '                        <bb-datepicker bb-datepicker-name="dateValue"\n' +
        '                                       ng-model="editController.locals.data.selected_value"\n' +
        '                                       ng-switch-when="3"\n' +
        '                                       data-bbauto-field="DateValue"\n' +
        '                                       bb-datepicker-min="editController.locals.minDate"\n' +
        '                                       bb-datepicker-max="editController.locals.maxDate"\n' +
        '                                       bb-date-format="editController.locals.dateFormat"\n' +
        '                                       bb-datepicker-append-to-body="true">\n' +
        '                        </bb-datepicker>\n' +
        '                        <!--Currency = 4, -->\n' +
        '                        <input type="text" class="form-control bb-prospectui-no-animate" ng-model="editController.locals.data.selected_value" ng-switch-when="4" bb-autonumeric="money" data-bbauto-field="CurrencyValue">\n' +
        '                        <!--Boolean = 5, -->\n' +
        '                        <select class="form-control bb-prospectui-no-animate"\n' +
        '                                ng-model="editController.locals.data.selected_value"\n' +
        '                                ng-options="yes_or_no.value as yes_or_no.label for yes_or_no in editController.locals.yesno"\n' +
        '                                data-bbauto-field="BooleanValue"\n' +
        '                                ng-switch-when="5"></select>\n' +
        '                        <!--CodeTableEntry = 6, -->\n' +
        '                        <select class="form-control bb-prospectui-no-animate"\n' +
        '                                ng-model="editController.locals.data.selected_value"\n' +
        '                                ng-options="code_table_entry.id as code_table_entry.description for code_table_entry in editController.locals.data.table_entries"\n' +
        '                                data-bbauto-field="CodeTableValue"\n' +
        '                                ng-switch-when="6">\n' +
        '                            <option/>\n' +
        '                        </select>\n' +
        '                    </span>\n' +
        '                    <div ng-messages="editController.locals.ratingseditform.textValue.$error">\n' +
        '                        <label class="error errormessage" ng-message="maxlength" data-bbauto-field="TextValueError">{{::editController.locals.resources.proposal_custom_field_edit_text_value_max_length}}</label>\n' +
        '                    </div>\n' +
        '                    <div ng-messages="editController.locals.ratingseditform.dateValue.$error">\n' +
        '                        <label class="error errormessage" ng-message="dateFormat" data-bbauto-field="DateValueError">{{editController.locals.ratingseditform.dateValue.invalidFormatMessage}}</label>\n' +
        '                        <label class="error errormessage" ng-message="minDate" data-bbauto-field="DateValueError">{{::editController.locals.resources.prospect_invalid_date}}</label>\n' +
        '                        <label class="error errormessage" ng-message="maxDate" data-bbauto-field="DateValueError">{{::editController.locals.resources.prospect_invalid_date}}</label>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '                <div class="form-group">\n' +
        '                    <label for="ratingComments" class="control-label">{{::editController.locals.resources.ratings_form_addedit_comments}}</label>\n' +
        '                    <div class="textarea-container bb-prospectui-summarynote-textarea">\n' +
        '                        <textarea class="form-control" form="ratingComments" data-bbauto-field="Comments" ng-model="editController.locals.data.comments" rows="2" maxlength="255" placeholder="{{::editController.locals.resources.ratings_form_addedit_comments_placeholder}}"></textarea>\n' +
        '                    </div>\n' +
        '                    <div ng-messages="editController.locals.ratingseditform.ratingComments.$error">\n' +
        '                        <label class="error errormessage" ng-message="maxlength" data-bbauto-field="CommentError">{{::editController.locals.resources.proposal_custom_field_edit_text_value_max_length}}</label>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <bb-modal-footer>\n' +
        '                <div ng-if="editController.locals.errorMessage" class="text-danger">{{editController.locals.errorMessage}}</div>\n' +
        '                <bb-modal-footer-button-primary data-bbauto-field="SaveButton" ng-disabled="!editController.locals.ratingseditform.$valid || editController.locals.isSaving" ng-click="locals.select()">{{::editController.locals.resources.form_button_save}}</bb-modal-footer-button-primary>\n' +
        '                <bb-modal-footer-button-cancel data-bbauto-field="CancelButton"></bb-modal-footer-button-cancel>\n' +
        '            </bb-modal-footer>\n' +
        '        </form>\n' +
        '    </div>\n' +
        '    <div ng-if="editController.locals.loadErrorOccurred">\n' +
        '        <bb-modal-header data-bbauto-field="Header">\n' +
        '            {{::editController.locals.resources.ratings_form_addedit_errorHeader}}\n' +
        '        </bb-modal-header>\n' +
        '        <bb-error>\n' +
        '            <bb-error-image>\n' +
        '                <img src=\'data:image/png;base64,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\' />\n' +
        '            </bb-error-image>\n' +
        '            <bb-error-title>\n' +
        '                {{::editController.locals.resources.ratings_form_addedit_errorTitle}}\n' +
        '            </bb-error-title>\n' +
        '            <bb-error-description>\n' +
        '                {{::editController.locals.resources.ratings_form_addedit_errorDescription}}\n' +
        '            </bb-error-description>\n' +
        '        </bb-error>\n' +
        '        <bb-modal-footer>\n' +
        '            <bb-modal-footer-button-cancel data-bbauto-field="CancelButton"></bb-modal-footer-button-cancel>\n' +
        '        </bb-modal-footer>\n' +
        '    </div>\n' +
        '</bb-modal>');
    $templateCache.put('dogs/behaviortraining/behaviortrainingtile.html',
        '<bb-tile ng-if="::locals.tileIsVisible" bb-tile-header="\'Behavior/Training\'">\n' +
        '    <bb-tile-header-content class="header-content" ng-show="locals.tileCount > 0">\n' +
        '        <div ng-model="locals.tileCount"></div>\n' +
        '    </bb-tile-header-content>\n' +
        '    <div class="ratings-tile-content">\n' +
        '        <div ng-if="data.custom_ratings.length >= 0" class="custom-ratings-section" >\n' +
        '            <div class="custom-ratings-count-container">\n' +
        '                <span class="custom-ratings-count" >{{data.value.length}}</span>\n' +
        '                <span>{{data.value.length === 1 ? \'Custom Rating\' : \'Custom Ratings\'}}</span>\n' +
        '            </div>\n' +
        '            <div class="toolbar bb-tile-toolbar bb-prospectui-tile-actions-bar ng-scope" ng-if="data.can_add_ratings">\n' +
        '                <button type="button" class="btn bb-btn-secondary" ng-click="locals.showRatingsAddForm()">\n' +
        '                    <span class="bb-toolbar-btn-label ng-binding">Add Rating</span>\n' +
        '                </button>\n' +
        '            </div>\n' +
        '            <div bb-tile-section ng-if="data.custom_ratings.length > 0">\n' +
        '                <div bb-pagination-content="locals.paged_ratings">\n' +
        '                    <ratings-list ratings="locals.paged_ratings.items" reload_data="locals.reloadData"></ratings-list>\n' +
        '                </div>\n' +
        '                <div bb-pagination="locals.paged_ratings" ></div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="bb-no-records" ng-if="data.value.length === 0" >No Ratings found.</div>\n' +
        '    </div>\n' +
        '</bb-tile>');
    $templateCache.put('dogs/currenthome/currenthometile.html',
        '<bb-tile bb-tile-header="\'Current home\'">\n' +
        '  <bb-tile-header-content ng-show="dogCurrentHomeTile.currentHome.constituentId">\n' +
        '      <bb-tile-header-check></bb-tile-header-check>\n' +
        '  </bb-tile-header-content>\n' +
        '  <div class="toolbar bb-tile-toolbar">\n' +
        '    <button type="button" class="btn bb-btn-secondary" ng-click="dogCurrentHomeTile.findHome()"><i class="fa fa-plus-circle"></i> Find Home</button>\n' +
        '  </div>\n' +
        '  <div ng-show="dogCurrentHomeTile.currentHome">\n' +
        '    <div ng-switch="dogCurrentHomeTile.currentHome.constituentId || 0">\n' +
        '      <div bb-tile-section ng-switch-when="0" class="bb-no-records">\n' +
        '        This dog has no current home.\n' +
        '      </div>\n' +
        '      <div ng-switch-default>\n' +
        '        <div ng-switch="dogCurrentHomeTile.currentHome.constituent.error || \'\'">\n' +
        '          <div bb-tile-section ng-switch-when="\'\'" class="bb-no-records">\n' +
        '            Error reading current home.\n' +
        '          </div>\n' +
        '          <div bb-tile-section ng-switch-default>\n' +
        '            <div class="row">\n' +
        '              <div class="col-sm-3 col-xs-4">\n' +
        '                <bark-photo class="bark-photo-small" ng-if="::dogCurrentHomeTile.currentHome.constituent.profile_picture" bark-photo-url="dogCurrentHomeTile.currentHome.constituent.profile_picture.thumbnail_url"></bark-photo>\n' +
        '                <bark-photo class="bark-photo-small" ng-if="::!dogCurrentHomeTile.currentHome.constituent.profile_picture" bark-photo-gravatar-email="dogCurrentHomeTile.currentHome.constituent.email.address"></bark-photo>\n' +
        '              </div>\n' +
        '              <div class="col-sm-9 col-xs-8">\n' +
        '                <h4>\n' +
        '                  <a ng-href="{{dogCurrentHomeTile.currentHome.constituentId | barkConstituentUrl}}" target="_blank">\n' +
        '                    {{:: dogCurrentHomeTile.currentHome.constituent.first }}\n' +
        '                    {{:: dogCurrentHomeTile.currentHome.constituent.last }}\n' +
        '                  </a>\n' +
        '                </h4>\n' +
        '                <h5>{{:: dogCurrentHomeTile.getTimeInHome(dogCurrentHomeTile.currentHome.fromDate) }}</h5>\n' +
        '                <p class="bark-home-address" ng-show="dogCurrentHomeTile.currentHome.constituent.address.address">{{:: dogCurrentHomeTile.currentHome.constituent.address.address }}</p>\n' +
        '                <p ng-show="dogCurrentHomeTile.currentHome.constituent.phone.number">\n' +
        '                  {{:: dogCurrentHomeTile.currentHome.constituent.phone.number }}\n' +
        '                </p>\n' +
        '                <p ng-show="dogCurrentHomeTile.currentHome.constituent.email.address">\n' +
        '                  <a ng-href="mailto:{{:: dogCurrentHomeTile.currentHome.constituent.email.address }}">{{:: dogCurrentHomeTile.currentHome.constituent.email.address }}</a>\n' +
        '                </p>\n' +
        '              </div>\n' +
        '            </div>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div bb-tile-section class="text-danger" ng-show="dogCurrentHomeTile.error">\n' +
        '    Error loading current home.\n' +
        '  </div>\n' +
        '</bb-tile>\n' +
        '');
    $templateCache.put('dogs/currenthome/findhome.html',
        '<bb-modal>\n' +
        '  <form name="findHome.formFind" ng-submit="findHome.saveData()">\n' +
        '    <div class="modal-form">\n' +
        '      <bb-modal-header>Find a home</bb-modal-header>\n' +
        '      <div bb-modal-body>\n' +
        '        <div class="form-group">\n' +
        '          <label class="control-label">Search By Name</label>\n' +
        '          <ui-select ng-model="findHome.constituent" append-to-body="true" bb-autofocus>\n' +
        '            <ui-select-match allow-clear placeholder="Search by Name">{{$select.selected.name}}</ui-select-match>\n' +
        '            <ui-select-choices repeat="constituent in findHome.results" refresh="findHome.search($select.search, \'single\')" refresh-delay="250">\n' +
        '              <span>{{ constituent.name }} ({{ constituent.id }})</span><br />\n' +
        '              <small><strong>{{ constituent.address }}</strong></small>\n' +
        '            </ui-select-choices>\n' +
        '          </ui-select>\n' +
        '        </div>\n' +
        '      </div>\n' +
        '      <bb-modal-footer>\n' +
        '        <bb-modal-footer-button-primary></bb-modal-footer-button-primary>\n' +
        '        <bb-modal-footer-button-cancel></bb-modal-footer-button-cancel>\n' +
        '        <span ng-show="noteAdd.error" class="text-danger">\n' +
        '          Error saving home\n' +
        '        </span>\n' +
        '      </bb-modal-footer>\n' +
        '    </div>\n' +
        '  </form>\n' +
        '</bb-modal>\n' +
        '');
    $templateCache.put('dogs/dogpage.html',
        '<div class="bb-page-header">\n' +
        '    <div class="container-fluid">\n' +
        '        <div class="row">\n' +
        '            <div class="col-md-3 col-lg-2">\n' +
        '                <bark-photo bark-photo-base64="dogPage.dog.image.data"></bark-photo>\n' +
        '            </div>\n' +
        '            <div class="col-md-9 col-lg-10">\n' +
        '                <h1>\n' +
        '                  {{ dogPage.dog.name }}\n' +
        '                </h1>\n' +
        '                <h4>{{ dogPage.dog.breed }} &middot; {{ dogPage.dog.gender }}</h4>\n' +
        '                <p></p>\n' +
        '                <p class="bb-text-block bark-dog-bio">{{ dogPage.dog.bio }}</p>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '<div class="container-fluid">\n' +
        '    <bb-tile-dashboard bb-layout="dogPage.layout" bb-tiles="dogPage.tiles"></bb-tile-dashboard>\n' +
        '</div>\n' +
        '');
    $templateCache.put('dogs/notes/noteadd.html',
        '<bb-modal>\n' +
        '  <form name="noteAdd.formAdd" ng-submit="noteAdd.saveData()">\n' +
        '    <div class="modal-form">\n' +
        '      <bb-modal-header>Add medical history</bb-modal-header>\n' +
        '      <div bb-modal-body>\n' +
        '        <div class="row">\n' +
        '          <div class="col-sm-6">\n' +
        '            <div class="form-group">\n' +
        '              <label class="control-label">Title</label>\n' +
        '              <input type="text" class="form-control" ng-model="noteAdd.note.title" />\n' +
        '            </div>\n' +
        '          </div>\n' +
        '          <div class="col-sm-6">\n' +
        '            <div class="form-group">\n' +
        '              <label class="control-label">Note Type</label>\n' +
        '              <select class="form-control" ng-model="noteAdd.note.type">\n' +
        '                <option ng-repeat="option in ::noteAdd.noteTypes" ng-bind="option" value="{{::option}}"></option>\n' +
        '              </select>\n' +
        '            </div>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '        <div class="row">\n' +
        '          <div class="col-sm-12">\n' +
        '            <div class="form-group">\n' +
        '              <label class="control-label">Description</label>\n' +
        '              <textarea class="form-control" ng-model="noteAdd.note.description"></textarea>\n' +
        '            </div>\n' +
        '            <div class="form-group">\n' +
        '              <label class="control-label">\n' +
        '                <input type="checkbox" bb-check ng-model="noteAdd.note.addConstituentNote" />\n' +
        '                Add as note on current owner\'s Raisers Edge NXT record.\n' +
        '              </label>\n' +
        '            </div>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '      </div>\n' +
        '      <bb-modal-footer>\n' +
        '        <bb-modal-footer-button-primary></bb-modal-footer-button-primary>\n' +
        '        <bb-modal-footer-button-cancel></bb-modal-footer-button-cancel>\n' +
        '        <span ng-show="noteAdd.error" class="text-danger">\n' +
        '          <span ng-show="noteAdd.error.message">{{ noteAdd.error.message }}</span>\n' +
        '          <span ng-hide="noteAdd.error.message">Unknown error occured.</span>\n' +
        '        </span>\n' +
        '      </bb-modal-footer>\n' +
        '    </div>\n' +
        '  </form>\n' +
        '</bb-modal>\n' +
        '');
    $templateCache.put('dogs/notes/notestile.html',
        '<bb-tile bb-tile-header="\'Medical history\'">\n' +
        '  <bb-tile-header-content ng-show="dogNotesTile.notes.length">\n' +
        '      {{ dogNotesTile.notes.length }}\n' +
        '  </bb-tile-header-content>\n' +
        '  <div>\n' +
        '    <div class="toolbar bb-tile-toolbar">\n' +
        '      <button type="button" class="btn bb-btn-secondary" ng-click="dogNotesTile.addNote()"><i class="fa fa-plus-circle"></i> Add History</button>\n' +
        '    </div>\n' +
        '    <div ng-show="dogNotesTile.notes">\n' +
        '      <div ng-switch="dogNotesTile.notes.length || 0">\n' +
        '        <div bb-tile-section ng-switch-when="0" class="bb-no-records">\n' +
        '          This dog has no medical history.\n' +
        '        </div>\n' +
        '        <div ng-switch-default class="bb-repeater">\n' +
        '          <div ng-repeat="note in ::dogNotesTile.notes.slice().reverse() track by $index" class="bb-repeater-item">\n' +
        '            <h4 class="bb-repeater-item-title">{{:: note.title }}</h4>\n' +
        '            <h5>{{:: dogNotesTile.getNoteDate(note.date) }}</h5>\n' +
        '            <p>{{:: note.description }}</p>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div bb-tile-section class="text-danger" ng-show="dogNotesTile.error">\n' +
        '    Error loading notes\n' +
        '  </div>\n' +
        '</bb-tile>\n' +
        '');
    $templateCache.put('dogs/previoushomes/previoushomestile.html',
        '<bb-tile bb-tile-header="\'Previous homes\'">\n' +
        '  <bb-tile-header-content ng-show="dogPreviousHomesTile.previousHomes.length">\n' +
        '      {{ dogPreviousHomesTile.previousHomes.length }}\n' +
        '  </bb-tile-header-content>\n' +
        '  <div>\n' +
        '    <div ng-show="dogPreviousHomesTile.previousHomes">\n' +
        '      <div ng-switch="dogPreviousHomesTile.previousHomes.length || 0">\n' +
        '        <div bb-tile-section ng-switch-when="0" class="bb-no-records">\n' +
        '          This dog has no previous homes.\n' +
        '        </div>\n' +
        '        <div ng-switch-default class="bb-repeater">\n' +
        '          <div ng-repeat="previousHome in dogPreviousHomesTile.previousHomes" class="clearfix bb-repeater-item">\n' +
        '            <h4 class="pull-left">\n' +
        '              <a ng-href="{{ previousHome.constituentId | barkConstituentUrl }}" target="_blank">\n' +
        '                {{ previousHome.constituent.name }}\n' +
        '              </a>\n' +
        '            </h4>\n' +
        '            <h5 class="pull-right">\n' +
        '              {{ dogPreviousHomesTile.getSummaryDate(previousHome.fromDate) }}\n' +
        '              <span ng-show="previousHome.toDate">\n' +
        '                to {{ dogPreviousHomesTile.getSummaryDate(previousHome.toDate) }}\n' +
        '              </span>\n' +
        '            </h5>\n' +
        '          </div>\n' +
        '        </div>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '  <div bb-tile-section class="text-danger" ng-show="dogPreviousHomesTile.error">\n' +
        '    Error loading previous homes.\n' +
        '  </div>\n' +
        '</bb-tile>\n' +
        '');
    $templateCache.put('index.html',
        '<!DOCTYPE html>\n' +
        '<html xmlns="http://www.w3.org/1999/xhtml" ng-app="barkbaud">\n' +
        '\n' +
        '<head>\n' +
        '  <title>Barkbaud</title>\n' +
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">\n' +
        '  <link rel="icon" type="image/png" href="images/favicon.ico">\n' +
        '  <link rel="stylesheet" type="text/css" href="https://sky.blackbaudcdn.net/skyux/1.5.22/css/sky-bundle.css">\n' +
        '  <link rel="stylesheet" type="text/css" href="css/app.css">\n' +
        '</head>\n' +
        '\n' +
        '<body ng-controller="MainController as mainController">\n' +
        '  <bb-navbar>\n' +
        '    <div class="container-fluid">\n' +
        '      <ul class="nav navbar-nav navbar-left">\n' +
        '        <li ui-sref-active="bb-navbar-active">\n' +
        '          <a ui-sref="dashboard">Dashboard</a>\n' +
        '        </li>\n' +
        '      </ul>\n' +
        '      <ul class="nav navbar-nav navbar-right">\n' +
        '        <li>\n' +
        '          <a ng-click="mainController.logout()">Logout</a>\n' +
        '        </li>\n' +
        '      </ul>\n' +
        '    </div>\n' +
        '  </bb-navbar>\n' +
        '  <div ui-view></div>\n' +
        '  <script src="https://sky.blackbaudcdn.net/skyux/1.5.22/js/sky-bundle.min.js"></script>\n' +
        '  <script src="js/app.min.js"></script>\n' +
        '</body>\n' +
        '</html>\n' +
        '');
    $templateCache.put('login/loginpage.html',
        '<bb-modal>\n' +
        '  <div class="modal-form modal-authorize">\n' +
        '    <bb-modal-header>Barkbaud</bb-modal-header>\n' +
        '    <div bb-modal-body>\n' +
        '      <p class="alert alert-danger" ng-if="loginPage.error" ng-switch="loginPage.error">\n' +
        '        <span ng-switch-when="access_denied">\n' +
        '          Barkbaud requires access to RENXT.\n' +
        '        </span>\n' +
        '        <span ng-switch-default>\n' +
        '          An unknown error has occurred.\n' +
        '        </span>\n' +
        '      </p>\n' +
        '      <p>Welcome to the Barkbaud Sample App.  This demo was built to showcase the Blackbaud NXT API and Blackbaud Sky UX.</p>\n' +
        '      <p>Click the Login button below to view the demo, or click the Learn More button below to visit the GitHub repo.</p>\n' +
        '    </div>\n' +
        '    <bb-modal-footer>\n' +
        '      <div ng-show="loginPage.waitingForAuth">\n' +
        '        <i class="fa fa-2x fa-spin fa-spinner" ></i> Checking authentication...\n' +
        '      </div>\n' +
        '      <div ng-hide="loginPage.waitingForAuth">\n' +
        '        <bb-modal-footer-button-primary  ng-click="loginPage.login()">\n' +
        '          Login with Blackbaud\n' +
        '        </bb-modal-footer-button-primary>\n' +
        '        <a href="https://github.com/blackbaud/barkbaud" target="_blank" class="btn bb-btn-secondary">\n' +
        '          Learn More\n' +
        '        </a>\n' +
        '      </div>\n' +
        '    </bb-modal-footer>\n' +
        '  </div>\n' +
        '</bb-modal>\n' +
        '');
}]);

//# sourceMappingURL=app.js.map