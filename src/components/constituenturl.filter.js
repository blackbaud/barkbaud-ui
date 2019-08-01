/*global angular */

(function () {
    'use strict';

    function constituentUrlFilter(barkbaudAuthService) {
        return function (constituentId) {
            return [
                'https://renxt.blackbaud.com/constituents/',
                encodeURIComponent(constituentId),
                '?envid=',
                barkbaudAuthService.environmentId
            ].join('');
        };
    }

    constituentUrlFilter.$inject = ['barkbaudAuthService'];

    angular.module('barkbaud')
        .filter('barkConstituentUrl', constituentUrlFilter);

}());
