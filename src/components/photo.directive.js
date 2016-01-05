/*global angular */

(function () {
    'use strict';

    function barkPhoto(gravatarService) {
        return {
            scope: {
                barkPhotoUrl: '=',
                barkPhotoGravatarEmail: '='
            },
            link: function (scope, el) {
                function setImageUrl(url) {
                    el.css('background-image', 'url(\'' + url + '\')');
                }

                scope.$watch('barkPhotoUrl', function (newValue) {
                    if (newValue) {
                        setImageUrl(newValue.replace('http://', '//'));
                    }
                });

                scope.$watch('barkPhotoGravatarEmail', function (newValue) {
                    if (newValue) {
                        setImageUrl(gravatarService.url(newValue, {default: 'mm'}));
                    }
                });
            },
            replace: true,
            templateUrl: 'components/photo.directive.html'
        };
    }

    barkPhoto.$inject = ['gravatarService'];

    angular.module('barkbaud')
        .directive('barkPhoto', barkPhoto);
}());
