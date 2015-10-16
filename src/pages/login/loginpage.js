/*global angular */

(function () {
    'use strict';

    function LoginPageController(bbWindow, barkbaudAuthService) {
        var self = this;

        self.isAuthenticated = false;
        self.login = barkbaudAuthService.login;
        self.logout = barkbaudAuthService.logout;

        barkbaudAuthService.isAuthenticated().then(function (r) {
            self.isAuthenticated = r;
        });

        bbWindow.setWindowTitle('Login');
    }

    LoginPageController.$inject = [
        'bbWindow',
        'barkbaudAuthService'
    ];

    angular.module('barkbaud')
        .controller('LoginPageController', LoginPageController);
}());
