/*global angular */

(function () {
    'use strict';

    function constituentUrlFilter() {
        return function (constituentId) {
            return 'https://renxt.blackbaud.com/constituents/' + encodeURIComponent(constituentId);
        };
    }

    angular.module('barkbaud')
        .filter('barkConstituentUrl', constituentUrlFilter);

}());
