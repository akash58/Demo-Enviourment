(function () {
  'use strict';

  angular
    .module('profiles')
    .controller('ProfilesListController', ProfilesListController);

  ProfilesListController.$inject = ['ProfilesService', 'Notification', '$state', '$window', '$mdDialog', '$q'];

  function ProfilesListController(ProfilesService, Notification, $state, $window, $mdDialog, $q) {
    var vm = this;
    // vm.profiles = ProfilesService.query();
    vm.editer = true;
    vm.limit = 10;
    vm.curPage = { page: 1 };
    vm.searchTextProfile = '';
    vm.maxSize = 5;
    // vm.othercosts = ProfilesService.query();
    vm.pagination = function (searchText) {
      vm.getProfileCount = ProfilesService.get({ profileId: 'count', name: searchText }, function () {
        vm.totalItems = vm.getProfileCount;
        vm.profiles = ProfilesService.query({ page: vm.curPage.page, limit: vm.limit, name: searchText }, function () {
          vm.indexStart = (vm.curPage.page - 1) * vm.limit;
          vm.indexEnd = Math.min((vm.curPage.page) * vm.limit, vm.totalItems.count);
        });
      });
    };
    vm.pagination(vm.searchTextProfile);
    // pagination(vm.searchText);
    vm.goToCreateProfile = function () {
      $state.go('profiles.create');
    };
    vm.clickProfile = function (profile) {
      if (profile._id === vm.active) {
        vm.active = '';
        vm.editer = true;
      } else {
        vm.active = profile._id;
      }
    };

    vm.editProfile = function (profile) {
      vm.editer = false;
    };
    vm.cancelEdit = function (profile) {
      vm.editer = true;
    };

    vm.updateProfile = function (profile) {
      profile.$update(function (updateRes) {
        Notification.success('update is successfull');
        vm.editer = true;
      }, function (errorOnUpdate) {
        Notification.error(errorOnUpdate);
      });
    };

    vm.removeProfile = function (profile, ev, callback) {
      var confirm = $mdDialog.confirm({ onComplete: function afterShowAnimation() {
        var $dialog = angular.element(document.querySelector('md-dialog'));
        var $actionsSection = $dialog.find('md-dialog-actions');
        var $cancelButton = $actionsSection.children()[0];
        var $confirmButton = $actionsSection.children()[1];
        angular.element($confirmButton).removeClass('md-focused');
        angular.element($cancelButton).addClass('md-focused');
        $cancelButton.focus();
      } })
        .title('Please Confirm!')
        .textContent('Are you sure you want to delete ' + profile.name + ' profile ?')
        .ariaLabel('Are you sure you want to delete ' + profile.name + ' profile ?')
        .targetEvent(ev)
        .ok('Yes! Delete')
        .cancel('No! Don\'t Delete');

      $mdDialog.show(confirm).then(function () {
        profile.active = false;
        profile.$update(function (res) {
          Notification.success('Delete!');
          if (callback && typeof callback === 'function') callback();
          vm.pagination(vm.searchTextProfile);
        }, function (err) {
          Notification.error(err);
        });
      }, function () {
        Notification.warning('You have cancelled the Delete!');
      });
    };
  }
}());
