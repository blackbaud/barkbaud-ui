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
