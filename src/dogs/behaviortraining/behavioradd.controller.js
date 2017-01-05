/*jslint browser: false */
/*global angular */

(function () {
    'use strict';

    function BehaviorAddController($scope, formOptions, loadResult, $uibModalInstance, bbData, bbEventTracker, bbFuzzyDateFormatter, bbWait, bbToast) {

        var FORM_NAME = 'Ratings Add Form',
            initialTime = new Date().getTime(),
            initialData = angular.copy(loadResult.data),
            self = this,
            dataUrl = 'prospectui/constituents/' + formOptions.constituentId + '/ratings',
            codeTableEntriesCache = {};

        bbEventTracker.trackFormLoaded({ form_name: FORM_NAME });

        // we will eventually call this when there is support in Sky for invoking custom modal close event handler
        function closeForm() {
            bbEventTracker.trackFormClosed({ form_name: FORM_NAME, final_data: self.locals.data, initial_data: initialData, start_time: initialTime });
        }

        function save() {

            if (self.locals.ratingsaddform.$valid) {

                self.locals.errorMessage = '';
                self.locals.isSaving = true;

                bbEventTracker.trackFormSaved({ form_name: FORM_NAME, final_data: self.locals.data, initial_data: initialData, start_time: initialTime });

                var selected_source_id,
                    dataToSave = {};

                if (self.locals.data.selected_rating_source) {
                    selected_source_id = self.locals.data.selected_rating_source.id;
                }

                dataToSave = {
                    source_id: selected_source_id,
                    rating_type_id: self.locals.data.selected_rating_type.id,
                    date: self.locals.data.selected_rating_date,
                    comments: self.locals.data.selected_rating_comments,
                    value: self.locals.data.selected_value
                };

                bbWait.beginPageWait();

                bbData.save({
                    url: dataUrl,
                    data: dataToSave
                }).then(function () {
                    $uibModalInstance.close(self.locals.data.selected_rating_type.id);
                    bbWait.endPageWait();
                    bbToast.open({
                        message: self.locals.resources.ratings_form_save_success,
                        toastType: "success"
                    });
                }).catch(function (response) {
                    if (response && response.data && response.data[0] && response.data[0].Message) {
                        self.locals.errorMessage = response.data[0].Message;
                    } else {
                        self.locals.errorMessage = self.locals.resources.ratings_form_save_error;
                    }
                    self.locals.isSaving = false;
                    bbWait.endPageWait();
                });
            } else {
                self.locals.errorMessage = self.locals.resources.ratings_form_save_error;
            }
        }

        function isTypeSystem(item) {
            if (item && item.id && (item.id.substring(0, 3) === "PR_")) {
                return true;
            }
            return false;
        }

        function setTypeOptionsNonSystem() {
            if (self.locals && self.locals.data && self.locals.data.rating_type) {
                self.locals.typeOptions = [];
                self.locals.data.rating_type.forEach(function (item) {
                    if (!isTypeSystem(item)) {
                        self.locals.typeOptions.push(item);
                    }
                });
            }
        }

        if (loadResult.httpResults.data.status === 200) {

            self.locals = {
                loadErrorOccurred: false,
                data: loadResult.data,
                resources: loadResult.resources,
                customFormat: bbFuzzyDateFormatter,
                isSaving: false,
                save: save,
                dateFormatString: bbFuzzyDateFormatter,
                closeForm: closeForm,
                yesno: [{
                    value: true,
                    label: loadResult.resources.proposal_custom_field_yes
                }, {
                    value: false,
                    label: loadResult.resources.proposal_custom_field_no
                }],
                minDate: new Date(1753, 1, 1),
                maxDate: new Date(9999, 1, 1),
                numberValueSettings: {
                    mDec: 0,
                    vMin: -0,
                    vMax: 2147483647.1
                },
                errorMessage: ""
            };
            self.locals.sourceOptions = self.locals.data.sources;
            setTypeOptionsNonSystem();
            self.locals.data.selected_rating_date = new Date();
        } else {
            self.locals = { loadErrorOccurred: true };

            //Load failed so just getting resources for form to display failure
            bbWait.beginPageWait();
            bbData.load({
                resources: 'prospectui/resources'
            }).then(function (result) {
                self.locals.resources = result.resources;
                bbWait.endPageWait();
            }).catch(function () {
                bbWait.endPageWait();
            });
        }

        $scope.$watch(
            function () {
                if (self.locals && self.locals.data && self.locals.data.selected_rating_source) {
                    return self.locals.data.selected_rating_source;
                }
                return undefined;
            },
            function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (self.locals && self.locals.ratingsaddform && self.locals.ratingsaddform.ratingType) {
                        self.locals.ratingsaddform.ratingType.$touched = false;
                    }
                    if (newValue) {
                        self.locals.typeOptions = [];
                        self.locals.data.rating_type.forEach(function (item) {
                            if ((item.source_id === self.locals.data.selected_rating_source.id) || ((self.locals.data.selected_rating_source.is_system === false) && (!(item.source_id)))) {
                                self.locals.typeOptions.push(item);
                            }
                        });
                    } else {
                        setTypeOptionsNonSystem();
                    }
                }
            }
        );

        $scope.$watch(
            function () {
                if (self.locals && self.locals.data && self.locals.data.selected_rating_type) {
                    return self.locals.data.selected_rating_type;
                }
                return undefined;
            },
            function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (newValue) {
                        self.locals.data.selected_value = "";
                        if ((self.locals.data.selected_rating_type.id) && (self.locals.data.selected_rating_type.data_type === 3)) {
                            self.locals.data.selected_value = new Date();
                        } else if ((self.locals.data.selected_rating_type.id) && (self.locals.data.selected_rating_type.data_type === 5)) {
                            self.locals.data.selected_value = self.locals.yesno[1].value;
                        } else if ((self.locals.data.selected_rating_type.id) && (self.locals.data.selected_rating_type.data_type === 6)) {
                            var ratingTypeId = self.locals.data.selected_rating_type.id;

                            if (!(codeTableEntriesCache[ratingTypeId])) {
                                bbWait.beginPageWait();
                                bbData.load({
                                    data: 'prospectui/ratings/codetableentries/' + ratingTypeId
                                }).then(function (result) {
                                    codeTableEntriesCache[ratingTypeId] = result.data;
                                    self.locals.codeTableOptions = codeTableEntriesCache[ratingTypeId];
                                    bbWait.endPageWait();
                                }).catch(function () {
                                    bbWait.endPageWait();
                                });
                            } else {
                                self.locals.codeTableOptions = codeTableEntriesCache[ratingTypeId];
                            }
                        }
                    }
                }
            }
        );
    }

    BehaviorAddController.$inject = ['$scope', 'formOptions', 'loadResult', '$uibModalInstance', 'bbData', 'bbEventTracker', 'bbFuzzyDateFormatter', 'bbWait', 'bbToast'];

    function RatingAddForm(bbData, bbModal, bbWait) {
        return {
            openForm: function (options) {
                return bbModal.open({
                    templateUrl: 'prospectviews/constituentratingslist/constituentratingadd.html',
                    controller: 'ConstituentRatingAddController as addController',
                    resolve: {
                        formOptions: function () {
                            return {
                                constituentId: options.constituentId
                            };
                        },
                        loadResult: function () {
                            bbWait.beginPageWait();

                            var promise = bbData.load({
                                data: 'prospectui/constituents/' + options.constituentId + '/ratings/add',
                                resources: 'prospectui/resources'
                            });

                            promise
                                .then(function () {
                                    bbWait.endPageWait();
                                }).catch(function () {
                                    bbWait.endPageWait();
                                    return null;
                                });

                            return promise;
                        }
                    }
                }).result;
            }
        };
    }

    RatingAddForm.$inject = ['bbData', 'bbModal', 'bbWait'];

    angular.module('barkbaud')
        .controller('BehaviorAddController', BehaviorAddController)
        .service('RatingAddForm', RatingAddForm);

}());