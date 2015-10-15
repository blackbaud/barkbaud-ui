/*global angular */

(function () {
    'use strict';

    function DashboardPageController($stateParams, bbData, bbWindow) {
        var self = this;

        bbWindow.setWindowTitle('Dashboard');

        bbData.load({
            data: 'api/dogs'
        }).then(function (result) {
            self.dogs = result.data.data;
        });
    }

    DashboardPageController.$inject = ['$stateParams', 'bbData', 'bbWindow'];

    angular.module('barkbaud')
        .controller('DashboardPageController', DashboardPageController);
}());
