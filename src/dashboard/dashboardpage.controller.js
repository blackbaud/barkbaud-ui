/*global angular */

(function () {
    'use strict';

    function DashboardPageController($scope, $stateParams, bbData, bbWindow) {
        var self = this;

        $scope.$emit('bbBeginWait');
        bbWindow.setWindowTitle('Dashboard');
        bbData.load({
            data: 'api/dogs'
        }).then(function (result) {
            self.dogs = result.data.value;
            $scope.$emit('bbEndWait');
        }).catch(function (result) {
            self.error = result.data.error;
        });
    }

    DashboardPageController.$inject = [
        '$scope',
        '$stateParams',
        'bbData',
        'bbWindow'
    ];

    angular.module('barkbaud')
        .controller('DashboardPageController', DashboardPageController);
}());
