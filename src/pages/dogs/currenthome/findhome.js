/*global angular */

(function () {
    'use strict';

    function FindHomeController($modalInstance, bbData, dogId) {
        var self = this;

        self.search = function (searchText) {

            if (searchText && searchText.length > 0) {
                return bbData.load({
                    data: 'api/dogs/' + dogId + '/findhome?searchText=' + searchText
                }).then(function (results) {
                    console.log(results);
                    self.results = results.data.results;
                }).catch(function () {
                    self.error = true;
                });
            }
        };

        self.saveData = function () {
            if (self.constituent) {
                bbData.save({
                    url: 'api/dogs/' + dogId + '/currenthome',
                    data: self.constituent,
                    type: 'POST'
                }).then(function (result) {
                    $modalInstance.close(result.data);
                });
            }
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
