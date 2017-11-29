(function () {
  'use strict';

  angular
    .module('profiles')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Configuration',
      state: 'configuration',
      type: 'dropdown',
      roles: ['admin', 'user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'configuration', {
      title: 'List Profiles',
      state: 'profiles.list',
      roles: ['admin', 'user']
    });

    // // Add the dropdown create item
    // menuService.addSubMenuItem('topbar', 'configuration', {
    //   title: 'Create Profile',
    //   state: 'profiles.create',
    //   roles: ['admin', 'user']
    // });
  }
}());
