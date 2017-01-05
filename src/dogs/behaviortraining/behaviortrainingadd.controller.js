/*global angular */

(function () {
    'use strict';

    function BehaviorTrainingAddController($uibModalInstance, bbData, dogId) {
        var self = this;

        bbData.load({
            data: 'api/dogs/ratings/categories'
        }).then(function (result) {
            self.ratingCategories = result.data.value;
        });

        self.note = {};
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
