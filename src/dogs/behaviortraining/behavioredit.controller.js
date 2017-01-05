/*jslint browser: false */
/*global angular */

(function () {
    'use strict';

    function BehaviorEditController(formOptions, loadResult, $uibModalInstance, bbData, bbEventTracker, bbDatepickerConfig, bbWait, bbToast) {

        var FORM_NAME = 'Ratings Edit Form',
            initialTime = new Date().getTime(),
            initialData = angular.copy(loadResult.data),
            self = this,
            dataUrl = 'prospectui/ratings/' + formOptions.ratingId;

        bbEventTracker.trackFormLoaded({ form_name: FORM_NAME });

        // we will eventually call this when there is support in Sky for invoking custom modal close event handler
        function closeForm() {
            bbEventTracker.trackFormClosed({ form_name: FORM_NAME, final_data: self.locals.data, initial_data: initialData, start_time: initialTime });
        }

        function save() {

            if (self.locals.ratingseditform.$valid) {

                self.locals.errorMessage = '';
                self.locals.isSaving = true;

                bbEventTracker.trackFormSaved({ form_name: FORM_NAME, final_data: self.locals.data, initial_data: initialData, start_time: initialTime });

                var dataToSave = {};

                dataToSave = {
                    date: self.locals.data.date,
                    comments: self.locals.data.comments,
                    value: self.locals.data.selected_value
                };

                bbWait.beginPageWait();

                bbData.save({
                    url: dataUrl,
                    data: dataToSave
                }).then(function () {
                    $uibModalInstance.close();
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

        if (loadResult.httpResults.data.status === 200) {

            self.locals = {
                loadErrorOccurred: false,
                data: loadResult.data,
                resources: loadResult.resources,
                isSaving: false,
                save: save,
                dateFormat: bbDatepickerConfig.currentCultureDateFormatString,
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

            self.locals.data.selected_value = "";
            if (self.locals.data.data_type === 6) {
                self.locals.data.table_entries.forEach(function (item) {
                    if (item.description === self.locals.data.value) {
                        self.locals.data.selected_value = item.id;
                    }
                });
            } else {
                self.locals.data.selected_value = self.locals.data.value;
            }
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
    }

    BehaviorEditController.$inject = ['formOptions', 'loadResult', '$uibModalInstance', 'bbData', 'bbEventTracker', 'bbDatepickerConfig', 'bbWait', 'bbToast'];

    function RatingEditForm(bbData, bbModal, bbWait) {
        return {
            openForm: function (options) {
                return bbModal.open({
                    templateUrl: 'dogs/behaviortraining/behavioredit.html',
                    controller: 'BehaviorEditController as editController',
                    resolve: {
                        formOptions: function () {
                            return {
                                constituentId: options.constituentId,
                                ratingId: options.ratingId
                            };
                        },
                        loadResult: function () {
                            bbWait.beginPageWait();

                            var promise = bbData.load({
                                data: 'prospectui/ratings/' + options.ratingId,
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

    RatingEditForm.$inject = ['bbData', 'bbModal', 'bbWait'];

    angular.module('barkbaud')
        .controller('BehaviorEditController', BehaviorEditController)
        .service('RatingEditForm', RatingEditForm);
}());