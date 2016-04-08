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
                    self.results = results.data.value;
                }).catch(function (result) {
                    self.error = result.data.error;
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
                }).catch(function (result) {
                    self.error = result.data.error;
                });
            }
        };
    }

    FindHomeController.$inject = [
        '$modalInstance',
        'bbData',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('FindHomeController', FindHomeController);
}());
