(function () {
  'use strict';

  // Profiles controller
  angular
    .module('profiles')
    .controller('ProfilesController', ProfilesController);

  ProfilesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'profileResolve', 'ProfilesService', 'Notification', '$q'];

  function ProfilesController($scope, $state, $window, Authentication, profile, ProfilesService, Notification, $q) {
    var vm = this;

    vm.authentication = Authentication;
    vm.profile = profile;
    vm.error = null;
    vm.form = {};
    // vm.remove = remove;
    vm.save = save;
    // vm.saveAndNew = saveAndNew;
    vm.goBackToLIst = goBackToLIst;
    vm.gender = 'Male';

    function goBackToLIst() {
      $state.go('profiles.list');
    }

    function save(valid) {
      if (!valid) {
        angular.forEach(vm.profileForm.$error, function (field) {
          angular.forEach(field, function (errorField) {
            errorField.$setTouched();
          });
        });
        return false;
      }
      vm.disabledSave = true;
      var profile = new ProfilesService({
        name: vm.name,
        lastName: vm.lastName,
        contactNumber: vm.contactNumber,
        gender: vm.gender,
        address: vm.address,
        note: vm.note
      });
      profile.$save(function (response) {
        vm.disabledSave = false;
        vm.profileForm.$setPristine();
        vm.profileForm.name.$touched = false;
        vm.profileForm.name.$valid = false;
        vm.profileForm.lastName.$touched = false;
        vm.profileForm.lastName.$valid = false;
        vm.profileForm.contactNumber.$touched = false;
        vm.profileForm.contactNumber.$valid = false;
        vm.profileForm.address.$touched = false;
        vm.profileForm.address.$valid = false;
        vm.name = '';
        vm.lastName = '';
        vm.contactNumber = '';
        vm.gender = '';
        vm.address = '';
        vm.note = '';
        Notification.success('Profile ' + response.name + 'is created');
      }, function (errorResponse) {
        vm.disabledSave = false;
        Notification.error(errorResponse.data.message);
      });
    }
  }
}());
