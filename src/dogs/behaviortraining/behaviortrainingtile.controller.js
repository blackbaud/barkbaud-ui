/*jshint es5: true */
/*jslint browser: false */
/*global angular */

(function () {
    'use strict';

    function DogBehaviorTraningTileController($scope, bbData, dogRatingAddForm, dogId) {

        $scope.range = function (size) {
            return new Array(size);
        };

        function calculateTileCount(data) {
            if (!data.custom_ratings) {
                return;
            }

            var tileCount = data.custom_ratings.length;

            if (data.minimum_asset_rating || data.maximum_asset_rating) {
                tileCount += 1;
            }

            if (data.minimum_ask_rating || data.maximum_ask_rating) {
                tileCount += 1;
            }

            if (data.overall_wealth_rating) {
                tileCount += 1;
            }

            if (data.donor_type_rating) {
                tileCount += 1;
            }

            return tileCount;
        }

        function loadData() {

            var data,
                locals;

            locals = $scope.locals;

            return bbData.load({
                data: '/api/dogs' + dogId + '/ratings'
            }).then(function (result) {
                $scope.data = data = result.data;

                var ratingPageToDisplay = 1,
                    i = 0,
                    itemsPerPage,
                    totalItems;

                $scope.locals.tileCount = calculateTileCount(data);
            }).catch(function () {
                $scope.locals.tileIsVisible = false;
            });
        }

        $scope.locals = {
            max_star_rating: 5,
            reloadData: loadData,
            numericFieldOptions: {
                mDec: 0 // No decimal places
            }
        };

        loadData();
    }

    DogBehaviorTraningTileController.$inject = ['$scope', 'bbData', 'dogId'];

    function ratingsList(bbModal, bbWait, bbData) {

        return {
            templateUrl: 'dogs/behaviortraining/behaviortrainingtile.html'
        };
    }

    ratingsList.$inject = ['$scope', 'bbData', 'dogId'];

    angular.module('barkbaud')
        .controller('DogBehaviorTraningTileController', DogBehaviorTraningTileController)
        .directive('ratingsList', ratingsList);
}());