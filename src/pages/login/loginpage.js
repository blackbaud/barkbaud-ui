/*global angular */

(function () {
    'use strict';

    function loginPageConfig($stateProvider) {
        $stateProvider
            .state('login', {
                controller: 'LoginPageController as loginPage',
                templateUrl: 'pages/login/loginpage.html',
                url: '/login'
            });
    }

    loginPageConfig.$inject = ['$stateProvider'];

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
        .config(loginPageConfig)
        .controller('LoginPageController', LoginPageController);
}());
