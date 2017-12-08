/*global angular */

(function () {
    'use strict';

    function FindHomeController($http, $q, $uibModalInstance, barkbaudConfig, bbData, dogId) {
        var self = this;

        self.results = [];
        self.searchCancelers = [];
        self.selectedResult = [];

        self.onSearch = function (args) {
            if (args.searchText && args.searchText.length > 0) {
                self.error = null;
 
                // Resolve/cancel any previous previous searches
                self.searchCancelers.forEach(function(canceler) {
                    canceler.resolve();
                });

                var searchCanceler = $q.defer();
                self.searchCancelers.push(searchCanceler);

                $http({ 
                    url: barkbaudConfig.apiUrl + 'api/dogs/' + dogId + '/findhome?searchText=' + args.searchText,
                    timeout: searchCanceler.promise,
                    withCredentials: true
                }).then(function (response) {
                    removeFromSearchCancelers(searchCanceler);
                    self.results = [];

                    response.data.value.forEach(function(constituent) {
                        self.results.push({
                            constituent: constituent,
                            description: constituent.address,
                            title: constituent.name + ' (' + constituent.id + ')'
                        });
                    });
                }).catch(function (result) {
                    removeFromSearchCancelers(searchCanceler);
                    if (result && result.status !== -1) { // -1 for canceled requests
                        self.error = {
                            message: "Search error: " + (result.data.message || result.statusText)
                        }
                    }
                });
            }
        };

        self.saveData = function () {
            if (self.selectedResult.length > 0 && self.selectedResult[0].constituent) {
                bbData.save({
                    url: 'api/dogs/' + dogId + '/currenthome',
                    data: self.selectedResult[0].constituent,
                    type: 'POST'
                }).then(function (result) {
                    $uibModalInstance.close(result.data);
                }).catch(function (result) {
                    self.error = result.data.error;
                });
            }
        };

        function removeFromSearchCancelers(canceler) {
            var index = self.searchCancelers.indexOf(canceler);
            if (index >= 0) {
                self.searchCancelers.splice(index, 1);
            }
        }
    }

    FindHomeController.$inject = [
        '$http',
        '$q',
        '$uibModalInstance',
        'barkbaudConfig',
        'bbData',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('FindHomeController', FindHomeController);
}());
