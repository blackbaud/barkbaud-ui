/*jslint browser: false */
/*global angular */

(function () {
    'use strict';

    function BehaviorTrainingDeleteController(formOptions, loadResult, $uibModalInstance, bbData, bbEventTracker, bbDatepickerConfig, bbWait, bbToast) {

        function save() {
            if (self.confirmDelete) {
                bbData.save({
                    url: 'api/dogs/' + encodeURIComponent(formOptions.dogId) + '/ratings' + encodeURIComponent(formOptions.behaviorTrainingId),
                    type: 'DELETE'
                }).then(function (result) {
                    $uibModalInstance.close(result.data);
                }).catch(function (result) {
                    self.error = result.data.error;
                });
            }
        }

        bbData.load({
            data: "api/dogs/" + encodeURIComponent(formOptions.dogId) + '/ratings' + encodeURIComponent(formOptions.behaviorTrainingId)
        }).then(function (result) {
            self.rating = result.data;
        }).catch(function (result) {
            self.error = result.data.error;
        })

        self.confirmDelete;
    }

    BehaviorTrainingDeleteController.$inject = ['formOptions', '$uibModalInstance', 'bbData', 'bbEventTracker', 'bbDatepickerConfig', 'bbWait', 'bbToast'];

    angular.module('barkbaud')
        .controller('BehaviorTrainingDeleteController', BehaviorTrainingDeleteController)
}());