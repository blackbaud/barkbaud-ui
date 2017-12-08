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

    angular.module('barkbaud', ['sky', 'ui.router', 'ngAnimate', 'barkbaud.templates', 'ui.gravatar'])
        .constant('barkbaudConfig', barkbaudConfig)
        .config(config)
        .run(run)
        .controller('MainController', MainController);
}());
