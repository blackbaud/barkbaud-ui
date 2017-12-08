/*global angular */

(function () {
    'use strict';

    function BehaviorTrainingEditController($uibModalInstance, bbData, behaviortraining, dogId) {
        var self = this;

        self.saveData = function () {
            bbData.save({
                url: 'api/dogs/' + encodeURIComponent(dogId) + '/ratings/' + encodeURIComponent(behaviortraining._id),
                data: self.behaviortraining,
                type: 'PATCH'
            }).then(function (result) {
                $uibModalInstance.close(result.data);
            }).catch(function (result) {
                self.error = result.data.error;
            });
        };

        self.behaviortraining = behaviortraining;
        self.yesno = [{
                    value: true,
                    label: "Yes"
                }, {
                    value: false,
                    label: "No"
                }];
        self.minDate = 1700;
        self.maxDate = 3000;

        if (self.behaviortraining.category.type === 'CodeTable') {
            bbData.load({
                data: 'api/dogs/ratings/categories/values?categoryName=' + encodeURIComponent(self.behaviortraining.category.name)
            }).then(function (result) {
                self.categoryValues = result.data.value;
            });
        }
    }

    BehaviorTrainingEditController.$inject = [
        '$uibModalInstance',
        'bbData',
        'behaviortraining',
        'dogId'
    ];

    angular.module('barkbaud')
        .controller('BehaviorTrainingEditController', BehaviorTrainingEditController);
}());
