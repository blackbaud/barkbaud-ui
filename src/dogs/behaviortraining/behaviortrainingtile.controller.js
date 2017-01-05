/*jshint es5: true */
/*jslint browser: false */
/*global angular */

(function () {
    'use strict';

    function DogBehaviorTrainingTileController($scope, bbData, bbPaging, bbDatepickerConfig, RatingAddForm, dogId) {

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

        function loadData(ratingCategory) {

            var data,
                locals,
                pagingConfig = {};

            locals = $scope.locals;

            return bbData.load({
                data: 'api/dogs/' + encodeURIComponent(dogId) + '/ratings',
                loadManager: {
                    scope: $scope,
                    name: 'DogBehaviorTrainingTileController'
                }
            }).then(function (result) {
                $scope.data = data = result.data;
                $scope.resources = result.resources;

                var ratingPageToDisplay = 1,
                    i = 0,
                    itemsPerPage,
                    totalItems;

                if (ratingTypeId) {

                    //Set Initial Display Page
                    if ($scope.data.value) {
                        totalItems = $scope.data.value.length || 0;
                    }

                    if ($scope.locals.paged_ratings) {
                        itemsPerPage = $scope.locals.paged_ratings.itemsPerPage || 5;
                    }

                    for (i = 0; i < totalItems; i += 1) {
                        if ($scope.data.value[i].category.name === ratingCategory) {
                            ratingPageToDisplay = Math.ceil(((i + 1) / itemsPerPage));
                            break;
                        }
                    }
                }

                pagingConfig.currentPage = ratingPageToDisplay;

                $scope.locals.paged_ratings = bbPaging.init(result.data.custom_ratings, pagingConfig);
                $scope.locals.dateFormat = bbDatepickerConfig.currentCultureDateFormatString;
                $scope.locals.tileCount = calculateTileCount(data);
            }).catch(function () {
                $scope.locals.tileIsVisible = false;
            });
        }

        function showRatingsAddForm() {
            bbConstituentRatingAddForm.openForm({ constituentId: $stateParams.id }).then(function (ratingTypeId) {
                loadData(ratingTypeId);
            });
        }

        $scope.locals = {
            max_star_rating: 5,
            showRatingsAddForm: showRatingsAddForm,
            reloadData: loadData,
            numericFieldOptions: {
                mDec: 0 // No decimal places
            }
        };

        loadData();
    }

    DogBehaviorTrainingTileController.$inject = ['$scope', 'bbData', 'bbPaging', 'bbDatepickerConfig', 'RatingAddForm'];

    function ratingsList(bbModal, bbWait, bbData, bbDatepickerConfig, bbConstituentRatingEditForm) {

        function link(scope) {
            scope.locals = {
                dateFormat: bbDatepickerConfig.currentCultureDateFormatString
            };

            scope.showRatingsEditForm = function (ratingId) {
                bbConstituentRatingEditForm.openForm({ constituentId: scope.constituentId, ratingId: ratingId }).then(function (ratingTypeId) {
                    scope.reloadData(ratingTypeId);
                });
            };

            scope.deleteRating = function (ratingId) {
                return bbData.save({ url: 'prospectui/ratings/' + ratingId, type: 'delete' }).then(function () {
                    scope.reloadData();
                });
            };
        }

        return {
            restrict: 'E',
            link: link,
            scope: {
                ratings: '=',
                canEditRatings: '=',
                canDeleteRatings: '=',
                resources: '=',
                reloadData: '='
            },
            templateUrl: 'dogs/behaviortraining/behaviortrainingtile.html'
        };
    }

    ratingsList.$inject = ['bbModal', 'bbWait', 'bbData', 'bbDatepickerConfig', 'RatingEditForm'];

    angular.module('barkbaud')
        .controller('DogBehaviorTrainingTileController', DogBehaviorTrainingTileController)
        .directive('ratingsList', ratingsList);
}());