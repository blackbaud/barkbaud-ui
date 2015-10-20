/*global angular */

(function () {
    'use strict';

    function barkbaudAuthService(barkbaudConfig, bbData, bbModal, $q, $window) {
        var modal,
            service = {};

        service.authenticated = false;

        service.isAuthenticated = function () {
            var deferred = $q.defer();
            bbData.load({
                data: 'auth/authenticated'
            }).then(function (result) {
                service.authenticated = result.data.authenticated;
                deferred.resolve(result.data.authenticated);
            });
            return deferred.promise;
        };

        service.login = function () {
            $window.location.href = barkbaudConfig.apiUrl + 'auth/login';
        };

        service.logout = function () {
            $window.location.href = barkbaudConfig.apiUrl + 'auth/logout';
        };

        service.update = function () {
            modal.close(service.authenticated);
        };

        service.modal = function () {
            if (!modal) {
                modal = bbModal.open({
                    controller: 'LoginPageController as loginPage',
                    templateUrl: 'pages/login/loginpage.html'
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
