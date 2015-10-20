/*global angular */

(function () {
    'use strict';

    function LoginPageController(bbWait, bbWindow, barkbaudAuthService) {
        var self = this;

        self.login = barkbaudAuthService.login;
        self.logout = barkbaudAuthService.logout;

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
        'bbWait',
        'bbWindow',
        'barkbaudAuthService'
    ];

    angular.module('barkbaud')
        .controller('LoginPageController', LoginPageController);
}());
