/*global angular */

(function () {
    'use strict';

    function FindHomeController($modalInstance, bbData, uiSelect, dogId) {
        var self = this;

        self.results = [
            {
                name: 'Bobby'
            },
            {
                name: 'Ashley'
            }
        ];

        self.search = function () {
            console.log('searching');
        };

        self.saveData = function () {
            bbData.save({
                url: 'api/dogs/' + dogId + '/notes',
                data: self.note,
                type: 'POST'
            }).then(function (result) {
                $modalInstance.close(result.data);
            });
        };
    }

    FindHomeController.$inject = [
        '$modalInstance',
        'bbData',
        'dogId'
    ];

    function barkFindHome(bbModal) {
        return {
            open: function (dogId) {
                return bbModal.open({
                    controller: 'FindHomeController as findHome',
                    templateUrl: 'pages/dogs/currenthome/findhome.html',
                    resolve: {
                        dogId: function () {
                            return dogId;
                        }
                    }
                });
            }
        };
    }

    barkFindHome.$inject = ['bbModal'];

    angular.module('barkbaud')
        .controller('FindHomeController', FindHomeController)
        .factory('barkFindHome', barkFindHome);
}());
