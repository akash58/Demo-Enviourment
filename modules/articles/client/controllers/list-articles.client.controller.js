(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesListController', ArticlesListController);

  ArticlesListController.$inject = ['ArticlesService', '$scope'];

  function ArticlesListController(ArticlesService, $scope) {
    var vm = this;

    vm.articles = ArticlesService.query();

    $scope.items = ['Amazon', 'Archies Online', 'Armamni Jeans','Armani Jeans', 'Baskin Robbins', 'Bata', 'Big Bazar',8,9,10];
    $scope.selected = [];
    $scope.readonly = true;

      $scope.toggle = function (item, list) {
        var index = list.indexOf(item);
        if (index > -1) {
          list.splice(index, 1);
        }
        else {
          list.push(item);
        }
      };

      $scope.toggle1 = function (item, list) {
        var indexRemove = list.indexOf(item);
        if (indexRemove > -1) {
          list.splice(indexRemove, 0);
        }
      };

      $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
      };
  }
}());
