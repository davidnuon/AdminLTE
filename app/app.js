var app = angular.module('acmlan', ['ngRoute']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'app/partials/home.html',
        controller: 'AdminHomeController'
      }).
      when('/user', {
        templateUrl: 'app/partials/user.html',
        controller: 'AdminHomeController'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);  

app.service('globalCounterService', [function globalCounterService() {
  var value = 0;

  return {
    get: function get() {
      return value;
    },

    set: function set(n) {
      value = n;
    },

    inc: function inc() {
      value++;
    }
  }
}]);

app.controller('AdminHomeController', ['$scope','globalCounterService',function($scope, globalCounterService){
  $scope.counter = 0;
  $scope.globalCounter = globalCounterService.get();

  $scope.increment = function counterInc() {
      globalCounterService.inc();
      $scope.globalCounter = globalCounterService.get();
  };

}]);


app.directive('contentBox',[function(){
  // Runs during compile
  return {
    scope: {}, 
    replace: true,
    templateUrl: 'app/tmpl/solid-box.html',
    restrict: 'E',
    transclude: true,
    link: function($scope, iElm, iAttrs, controller) {
        $.AdminLTE.boxWidget.activateOnce(iElm);
        $scope.title = iAttrs.title;
    }
  };
}]);

app.directive('statusBlock', [function(){
  // Runs during compile
  return {
    scope: {}, 
    restrict: 'E',
    templateUrl: 'app/tmpl/status-block.html',
    replace: true,
    link: function($scope, iElm, iAttrs, controller) {
      $scope.name =  iAttrs.name;
      $scope.number =  iAttrs.number;
      $scope.percent =  iAttrs.percent;
      $scope.description =  iAttrs.description;
    }
  };
}]);

app.directive('acmCounter', [function(){
  // Runs during compile
  return {
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    replace: true,
    templateUrl: 'app/tmpl/number-block.html',
    scope: {},
    transclude: true,

    link: function($scope, iElm, iAttrs, controller) {

        $scope.inc = Number(iAttrs.inc) || 0;
        $scope.counter = $scope.$parent.counter;
        $scope.name = iAttrs.name;

        $scope.$parent.$watch('counter',function(newVal, oldVal){
            $scope.counter = $scope.counter + $scope.inc;
        });
    }
  };
}]);

// Directive for a sidebars
app.directive('acmSidebar', [function(){
  // Recurse through a menu list and render a sidebar   
  function render_menu(menu, root) {
    for(var idx in menu) {
      var item = menu[idx];
      var key = item.kind || 'item';

      // Collection of functions we're going to use to render each type of list item
      var render = {
        'header' : function header_template(item) {
          var label = item.title;
          return '<li class="header">' + label +'</li>';
        }, 

        'item' : function item_template (item) {
          var label = item.title;
          return '<li><a href="#">'+ label +'</a></li>';
        }
      }

      root.append(render[key](item));

      // If we have a property called 'children', recurse
      if('children' in item) {
          var sub_menu = $('<li class="treeview active"><ul class="treeview-menu menu-open"></ul></li>');
          var new_root = sub_menu.find('ul');
          root.append(sub_menu);
          render_menu(item.children, new_root);
      }
    }
  }

  return {
    restrict: 'E',
    templateUrl: 'app/tmpl/sidebar.html',
    replace: true,
    link: function($scope, iElm, iAttrs, controller) {
      var $menuRoot = jQuery(iElm).find('.sidebar-menu');
      var menu = [
        {
          title: "WARSOW",
          kind: "header",
          children: [
            {
              title: "Player status"
            },
            {
              title: $scope.foo
            }
          ]
        },        {
          title: "Minecraft",
          kind: "header",
          children: [
            {
              title: "Player status"
            },
            {
              title: "Change map"
            }
          ]
        },
        {
          title: "Teeworlds",
          kind: "header",
          children: [
            {
              title: "Player status"
            },
            {
              title: "Change map"
            }
          ]
        }
      ];

      var root = $menuRoot;
      $scope.foo += ' Modifying the value from scope.';
      render_menu(menu, root);
    },
  };
}]);


/* ------------------
 * - Implementation -
 * ------------------
 * The next block of code implements AdminLTE's
 * functions and plugins as specified by the
 * options above.
 */
$(function () {
  //Easy access to options
  var o = $.AdminLTE.options;

  //Activate the layout maker
  $.AdminLTE.layout.activate();

  //Enable sidebar tree view controls
  $.AdminLTE.tree('.sidebar');

  //Add slimscroll to navbar dropdown
  if (o.navbarMenuSlimscroll && typeof $.fn.slimscroll != 'undefined') {
    $(".navbar .menu").slimscroll({
      height: "200px",
      alwaysVisible: false,
      size: "3px"
    }).css("width", "100%");
  }

  //Activate sidebar push menu
  if (o.sidebarPushMenu) {
    $.AdminLTE.pushMenu(o.sidebarToggleSelector);
  }

  //Activate Bootstrap tooltip
  if (o.enableBSToppltip) {
    $(o.BSTooltipSelector).tooltip();
  }

  if(o.enableFastclick && typeof FastClick != 'undefined') {
    FastClick.attach(document.body);
  }

  /*
   * INITIALIZE BUTTON TOGGLE
   * ------------------------
   */
  $('.btn-group[data-toggle="btn-toggle"]').each(function () {
    var group = $(this);
    $(this).find(".btn").click(function (e) {
      group.find(".btn.active").removeClass("active");
      $(this).addClass("active");
      e.preventDefault();
    });

  });
});