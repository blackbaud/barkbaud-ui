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
                data: 'api/dogs/ratings/categories?sourceName=' + encodeURIComponent(source)
            }).then(function (result) {
                self.categories = result.data.value;
            });
        };

        self.checkLoadValues = function(categoryName) {
            var optional,
                category;

            optional = '';
            category = self.findCategoryByName(categoryName);
            self.behaviortraining.category = category;

            if (category.source) {
                optional = 'sourceName=' + encodeURIComponent(category.source);
            }
            
            if (category.type === 'codetable') {
                bbData.load({
                    data: 'api/dogs/ratings/categories/values?categoryName=' + encodeURIComponent(category.name) + optional
                }).then(function (result) {
                    self.categoryValues = result.data.value;
                })
            }
        }

        self.findCategoryByName = function(categoryName) {
            for (var category in self.categories) {
                if (category.name === categoryName) {
                    return category;
                }
            }
        }

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
