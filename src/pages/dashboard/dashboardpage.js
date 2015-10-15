/*global angular */

(function () {
    'use strict';

    function DashboardPageController($stateParams, bbData, bbWindow) {
        var self = this;

        bbWindow.setWindowTitle('Dashboard');

        bbData.load({
            resources: 'api/dogs'
        }).then(function (result) {
            self.dogs = result.resources.data;
        });
    }

    DashboardPageController.$inject = ['$stateParams', 'bbData', 'bbWindow'];

    angular.module('barkbaud')
        .controller('DashboardPageController', DashboardPageController);
}());
