var app = angular.module('acmlan', []);

app.controller('AdminCtrl',  function($scope){
  $scope.foo = 'This is from the controller';
  $scope.counter = 0;
  $scope.tyler = 'Good man';
});


app.directive('contentBox' , function(){
  // Runs during compile
  return {
    scope: {}, 
    replace: true,
    templateUrl: 'dist/tmpl/solid-box.html',
    restrict: 'E',
    transclude: true,
    link: function($scope, iElm, iAttrs, controller) {
        $scope.title = iAttrs.title;
    }
  };
});

app.directive('statusBlock', function(){
  // Runs during compile
  return {
    scope: {}, 
    restrict: 'E',
    templateUrl: 'dist/tmpl/status-block.html',
    replace: true,
    link: function($scope, iElm, iAttrs, controller) {
      $scope.name =  iAttrs.name;
      $scope.number =  iAttrs.number;
      $scope.percent =  iAttrs.percent;
      $scope.description =  iAttrs.description;
    }
  };
});

app.directive('acmCounter', function(){
  // Runs during compile
  return {
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    replace: true,
    templateUrl: 'dist/tmpl/number-block.html',
    scope: {},
    transclude: true,

    controller: function($scope, $element, $attrs, $transclude) {
        console.log($transclude);
    },
    link: function($scope, iElm, iAttrs, controller) {

        $scope.inc = Number(iAttrs.inc) || 0;
        $scope.counter = $scope.$parent.counter;
        $scope.name = iAttrs.name;

        $scope.$parent.$watch('counter',function(newVal, oldVal){
            $scope.counter = $scope.counter + $scope.inc;
        });
    }
  };
});

// Directive for a sidebars
app.directive('acmSidebar', function(){
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
    templateUrl: 'dist/tmpl/sidebar.html',
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
});


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

  //Activate box widget
  if (o.enableBoxWidget) {
    $.AdminLTE.boxWidget.activate();
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