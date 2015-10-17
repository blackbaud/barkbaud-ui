/*global angular */

(function () {
    'use strict';

    function barkbaudAuthService(barkbaudConfig, bbData, $q, $window) {
        var service = {};

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

        service.isAuthenticated();
        return service;
    }

    barkbaudAuthService.$inject = [
        'barkbaudConfig',
        'bbData',
        '$q',
        '$window'
    ];

    angular.module('barkbaud')
        .factory('barkbaudAuthService', barkbaudAuthService);
}());
