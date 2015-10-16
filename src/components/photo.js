/*global angular */

(function () {
    'use strict';

    function barkPhoto() {
        return {
            scope: {
                barkPhotoUrl: '='
            },
            link: function (scope, el) {
                scope.$watch('barkPhotoUrl', function (newValue) {
                    if (newValue) {
                        el.css('background-image', 'url(\'' + newValue + '\')');
                    }
                });
            },
            replace: true,
            templateUrl: 'components/photo.html'
        };
    }

    angular.module('barkbaud')
        .directive('barkPhoto', barkPhoto);
}());
