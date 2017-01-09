/*global angular */

(function () {
    'use strict';

    function BehaviorTrainingAddController($uibModalInstance, bbData, dogId) {
        var self = this;

        bbData.load({
            data: {
                sources: 'api/dogs/ratings/sources',
                categories: 'api/dogs/ratings/categories?sourceName='
            }
        }).then(function (result) {
            self.sources = result.data.sources.value;
            self.categories = result.data.categories.value;
            debugger;
        });

        self.loadCategories = function(source) {
            bbData.load({
                data: 'api/dogs/ratings/categories?sourceName=' + encodeURIComponent(source || '')
            }).then(function (result) {
                self.categories = result.data.value;
            });
        };

        self.checkLoadValues = function(categoryName) {
            self.behaviortraining.category = self.findCategoryByName(categoryName);
            console.log(self.findCategoryByName(categoryName));
            console.log(self.behaviortraining.category);
            if (self.behaviortraining.category.type === 'codetable') {
                bbData.load({
                    data: 'api/dogs/ratings/categories/values?categoryName=' + encodeURIComponent(self.behaviortraining.category.name)
                }).then(function (result) {
                    self.categoryValues = result.data.value;
                });
            }
        };

        self.findCategoryByName = function(categoryName) {
            var categoryToReturn;
            self.categories.forEach( function (category) {
                if (category.name === categoryName) {
                    categoryToReturn = category;
                }
            });
            return categoryToReturn;
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
