/*global angular */

(function () {
    'use strict';

    function barkPhoto(gravatarService) {
        return {
            scope: {
                barkPhotoUrl: '=',
                barkPhotoGravatarEmail: '='
            },
            bindToController: true,
            controller: angular.noop,
            controllerAs: 'barkPhoto',
            link: function (scope, el, attr, barkPhoto) {
                function setImageUrl(url) {
                    el.css('background-image', 'url(\'' + url + '\')');
                }

                scope.$watch(function () {
                    return barkPhoto.barkPhotoUrl;
                }, function (newValue) {
                    if (newValue) {
                        setImageUrl(newValue.replace('http://', '//'));
                    }
                });

                scope.$watch(function () {
                    return barkPhoto.barkPhotoGravatarEmail;
                }, function (newValue) {
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
