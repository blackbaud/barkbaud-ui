/*global angular */

(function () {
    'use strict';

    function BehaviorTrainingAddController($uibModalInstance, bbData, dogId) {
        var self = this;

        bbData.load({
            data: 'api/dogs/ratings/sources'
        }).then(function (result) {
            self.sources = result.data.value;
        });

        self.loadCategories = function(source) {
            bbData.load({
                data: 'api/dogs/ratings/categories?sourceName=' + encodeURIComponent(source)
            }).then(function (result) {
                self.categories = result.data.value;
            });
        };

        self.behaviortraining = {}
        self.saveData = function () {
            bbData.save({
                url: 'api/dogs/' + dogId + '/notes',
                data: self.note,
                type: 'POST'
            }).then(function (result) {
                $uibModalInstance.close(result.data);
            }).catch(function (result) {
                self.error = result.data.error;
            });
        };
    }

    BehaviorTrainingAddController.$inject = [
        '$uibModalInstance',
        'bbData',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('BehaviorTrainingAddController', BehaviorTrainingAddController);
}());