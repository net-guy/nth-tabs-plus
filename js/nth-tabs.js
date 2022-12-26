/**
  *nth-tabs
  * author:nethuige
  * version:2.0
  */
(function ($) {

     $.fn.nthTabs = function (options) {

         // 40 in the plugin is the default left margin
         var nthTabs = this;

         var defaults = {
             allowClose: true, // New tab, whether to allow closing, enabled by default
             active: true, // Create a new tab, whether it is active or not, enabled by default
             location: true, //Create a new tab, whether to automatically locate it, enabled by default
             fadeIn: true, // New tab, fade-in effect, enabled by default
             rollWidth: nthTabs.width() - 120 // Scrollable area width, 120 is the width of 3 operation buttons
         };

         var settings = $.extend({}, defaults, options);

         var frameName = 0;

         var template =
             '<div class="page-tabs">' +
             '<a href="#" class="roll-nav roll-nav-left"><span class="fa fa-backward"></span></a>' +
             '<div class="content-tabs">' +
             '<div class="content-tabs-container">' +
             '<ul class="nav nav-tabs"></ul>' +
             '</div>' +
             '</div>' +
             '<a href="#" class="roll-nav roll-nav-right"><span class="fa fa-forward"></span></a>' +
             '<div class="dropdown roll-nav right-nav-list">' +
             '<a href="#" class="dropdown-toggle" data-toggle="dropdown">' +
             '<span class="fa fa-caret-down" style="font-size:18px;"></span></a>' +
             '<ul class="dropdown-menu dropdown-menu-right">' +
             '<li><a href="#" class="tab-location">Locate the current tab</a></li>' +
             '<li><a href="#" class="tab-close-current">Close the current tab</a></li>' +
             '<li role="separator" class="divider"></li>' +
             '<li><a href="#" class="tab-close-other">Close other tabs</a></li>' +
             '<li><a href="#" class="tab-close-all">Close all tabs</a></li>' +
             '<li style="display:none;" class="divider"></li>' +
             '<li style="display:none;" class="scrollbar-outer tab-list-scrollbar">' +
             '<div style="display:none;" class="tab-list-container"><ul class="tab-list"></ul></div>' +
             '</li>' +
             '</ul>' +
             '</div>' +
             '</div>' +
             '<div class="tab-content"></div>';

         // enable plugin
         var run = function(){
             nthTabs.html(template);
             event.onWindowsResize().onTabClose().onTabRollLeft().onTabRollRight() //.onTabList()
                 .onTabCloseOpt().onTabCloseAll().onTabCloseOther().onLocationTab();
             return methods;
         };

         // method list
         var methods = {

             // Get all tab widths
             getAllTabWidth: function () {
                 var sum_width = 0;
                 nthTabs.find('.nav-tabs li').each(function () {
                     sum_width += parseFloat($(this). width());
                 });
                 return sum_width;
             },

             // Get left and right sliding step value
             getMarginStep: function () {
                 return settings. rollWidth / 2;
             },

             // Get the current active state tab ID
             getActiveId: function () {
                 return nthTabs.find('li[class="active"]').find("a").attr("href").replace('#', '');
             },

             // get all tabs
             getTabList: function () {
                 var tabList = [];
                 nthTabs.find('.nav-tabs li a').each(function () {
                     tabList.push({id: $(this).attr('href'), title: $(this).children('span').html()});
                 });
                 return tabList;
             },

             // Create a new tab
             addTab: function (options) {
                 //nav-tab
                 var tab = [];
                 var active = options.active == undefined ? settings.active : options.active;
                 var allowClose = options.allowClose == undefined ? settings.allowClose : options.allowClose;
                 var location = options. location == undefined ? settings. location : options. location;
                 var fadeIn = options. fadeIn == undefined ? settings. fadeIn : options. fadeIn;
                 var url = options.url == undefined ? "" : options.url;

 
                 tab. push('<li title="' + options. title + '">');
                 allowClose ? tab.push('<a href="#' + options.id + '" data-toggle="tab">') : tab.push('<a href="#' + options.id + ' " data-toggle="tab" style="padding-right:10px;">');
               
                 tab.push('<span>' + options.title + '</span>');
                 tab. push('</a>');
                 allowClose ? tab.push('<i class="fa fa-close tab-close"></i>') : '';
                 tab. push('</li>');
                 nthTabs.find(".nav-tabs").append(tab.join(''));
                 //tab-content
                 var tabContent = [];
                 tabContent.push('<div class="tab-pane '+(fadeIn ? 'animation-fade' : '')+'" id="' + options.id + '">');
                 if(url. length>0){
                     tabContent.push('<iframe src="'+options.url+'" frameborder="0" name="iframe-'+frameName+'" class="nth-tabs-frame"></iframe>');
                     frameName++;
                 }else{
                     tabContent.push('<div class="nth-tabs-content">'+options.content+"</div>");
                 }tabContent. push('</div>');
                 nthTabs.find(".tab-content").append(tabContent.join(''));
                 active && this.setActTab(options.id);
                 location && this. locationTab(options. id);
                 return this;
             },

             // Create multiple tabs
             addTabs: function (tabsOptions) {
                 for(var index in tabsOptions){
                     this.addTab(tabsOptions[index]);
                 }
                 return this;
             },

             // positioning tab
             locationTab: function (tabId) {
                 tabId = tabId == undefined ? methods. getActiveId() : tabId;
                 tabId = tabId. indexOf('#') > -1 ? tabId : '#' + tabId;
                 var navTabOpt = nthTabs.find("[href='" + tabId + "']"); // currently operated tab object
                 // Calculate the sum of the widths of all sibling tabs that exist before the current active tab
                 var beforeTabsWidth = 0;
                 navTabOpt. parent(). prevAll(). each(function () {
                     beforeTabsWidth += $(this). width();
                 });
                 // Get the tab container object
                 var contentTab = navTabOpt. parent(). parent(). parent();
                 // Case 1: If the sum of the width of the previous tabs at the same level is smaller than the visible area of the tab, the default is 40
                 if (beforeTabsWidth <= settings. rollWidth) {
                     margin_left_total = 40;
                 }
                 // Situation 2: If the sum of the widths of the previous tabs at the same level is greater than the visible area of the tabs, the margin is an integer multiple of the distance to the left
                 else {
                     margin_left_total = 40 - Math.floor(beforeTabsWidth / settings.rollWidth) * settings.rollWidth;
                 }
                 contentTab.css("margin-left", margin_left_total);
                 return this;
             },

             // delete a single tab
             delTab: function (tabId) {
                 tabId = tabId == undefined ? methods. getActiveId() : tabId;
                 tabId = tabId. indexOf('#') > -1 ? tabId : '#' + tabId;
                 if(tabId == 0)
                 {
                     return this;
                 }

                 var navTabA = nthTabs. find("[href='" + tabId + "']");
                 // If the closed tab is active
                 if (navTabA. parent(). attr('class') == 'active') {
                     // Activate the tab, if there is an activation behind, otherwise activate the front
                     var activeNavTab = navTabA. parent(). next();
                     var activeTabContent = $(tabId). next();
                     if (activeNavTab. length < 1) {
                         activeNavTab = navTabA. parent().prev();
                         activeTabContent = $(tabId).prev();
                     }
                     activeNavTab. addClass('active');
                     activeTabContent. addClass('active');
                 }
                 // remove old tab
                 navTabA. parent(). remove();
                 $(tabId).remove();

                 return this;
             },

             // remove other tabs
             delOtherTab: function () {
                 //nthTabs.find(".nav-tabs li").not('[class="active"]').remove();
                 //nthTabs.find(".tab-content div.tab-pane").not('[class$="active"]').remove();
                 //nthTabs.find('.content-tabs-container').css("margin-left", 40); //reset position
                
                 var mmc = $('.nav-tabs').children();
                 mmc. each (function (i) {
                     if (i && this. className. indexOf("active") == -1) {
                         $(this.hash).remove();
                         $(this).remove();
                     }
                 }).end().css('left', 0);
                
                 return this;
             },

             // delete all tabs
             delAllTab: function () {
                 //nthTabs.find(".nav-tabs li").remove();
                 //nthTabs.find(".tab-content div").remove();

                 var mmc = $('.nav-tabs').children();
                 if (mmc. length) {
                     mmc. each (function (i) {
                         if (i) {
                             $(this.hash).remove();
                             $(this).remove();
                         }
                     }).first().addClass('active');
                     $(mmc.first()[0].hash).addClass('active');
                     mmc.end().css('left', 0);
                 }

                 return this;
             },

             // set the active tab
             setActTab: function (tabId) {
                 tabId = tabId == undefined ? methods. getActiveId() : tabId;
                 tabId = tabId. indexOf('#') > -1 ? tabId : '#' + tabId;
                 nthTabs.find('.active').removeClass('active');
                 nthTabs.find("[href='" + tabId + "']").parent().addClass('active');
                 nthTabs.find(tabId).addClass('active');
                 return this;
             },

             // switch tab
             toggleTab: function (tabId) {
                 this.setActTab(tabId).locationTab(tabId);
                 return this;
             },

             // Specifies whether the tab exists
             isExistsTab: function (tabId) {
                 tabId = tabId. indexOf('#') > -1 ? tabId : '#' + tabId;
                 return nthTabs.find(tabId).length>0;
             }
         };

         // event handling
         var event = {

             // window change
             onWindowsResize: function () {
                 $(window).resize(function () {
                     settings.rollWidth = nthTabs.width() - 120;
                 });
                 return this;
             },
            
             // positioning tab
             onLocationTab: function () {
                 nthTabs.on("click", '.tab-location', function () {
                     methods. locationTab();
                 });
                 return this;
             },

             // close tab button
             onTabClose: function () {
                 nthTabs.on("click", '.tab-close', function () {
                     var tabId = $(this).parent().find("a").attr('href');
                     //The label width of the current operation
                     var navTabOpt = nthTabs.find("[href='" + tabId + "']"); // current operation tab object
                     // If there is a tab behind the current tab, it will not be processed. If there is no tab, the overall shift will be one tab to the left
                     if(navTabOpt. parent().next().length == 0){
                         // Calculate the sum of the widths of all sibling tabs that exist before the current action tab
                         var beforeTabsWidth = 0;
                         navTabOpt. parent(). prevAll(). each(function () {
                             beforeTabsWidth += $(this). width();
                         });
                         //The width of the current operation tab
                         var optTabWidth = navTabOpt. parent(). width();
                         var margin_left_total = 40; // default offset (total width does not exceed the scroll area)
                         // Get the tab container object
                         var contentTab = navTabOpt. parent(). parent(). parent();
                         // If this condition is met, the overall left offset processing is required
                         if (beforeTabsWidth > settings. rollWidth) {
                             var margin_left_origin = contentTab.css('marginLeft').replace('px', '');
                             margin_left_total = parseFloat(margin_left_origin) + optTabWidth + 40;
                         }
                         contentTab.css("margin-left", margin_left_total);
                     }
                     methods.delTab(tabId);
                 });
                 return this;
             },

             // Close the current tab operation
             onTabCloseOpt: function () {
                 nthTabs.on("click", '.tab-close-current', function () {
                     methods. delTab();
                 });
                 return this;
             },

             // close other tabs
             onTabCloseOther: function () {
                 nthTabs.on("click", '.tab-close-other', function () {
                     methods. delOtherTab();
                     methods. locationTab();
                 });
                 return this;
             },

             // close all tabs
             onTabCloseAll: function () {
                 nthTabs.on("click", '.tab-close-all', function () {
                     methods. delAllTab();
                     methods.toggleTab("home");
                 });
                 return this;
             },

             // swipe left tab
             onTabRollLeft: function () {
                 nthTabs.on("click", '.roll-nav-left', function () {
                     var contentTab = $(this).parent().find('.content-tabs-container');
                     var margin_left_total;
                     if (methods. getAllTabWidth() <= settings. rollWidth) {
                         //Does not exceed the width of the visible area, cannot slide
                         margin_left_total = 40;
                     }else{
                         var margin_left_origin = contentTab.css('marginLeft').replace('px', '');
                         margin_left_total = parseFloat(margin_left_origin) + methods.getMarginStep() + 40;
                     }
                     contentTab.css("margin-left", margin_left_total > 40 ? 40 : margin_left_total);
                 });
                 return this;
             },

             // Swipe right tab
             onTabRollRight: function () {
                 nthTabs.on("click", '.roll-nav-right', function () {
                     if (methods.getAllTabWidth() <= settings.rollWidth) return false; //does not exceed the width of the visible area, cannot slide
                     var contentTab = $(this).parent().find('.content-tabs-container');
                     var margin_left_origin = contentTab.css('marginLeft').replace('px', '');
                     var margin_left_total = parseFloat(margin_left_origin) - methods. getMarginStep();
                     if (methods.getAllTabWidth() - Math.abs(margin_left_origin) <= settings.rollWidth) return false; // no hidden and no need to scroll
                     contentTab.css("margin-left", margin_left_total);
                 });
                 return this;
             },

             // list of tabs
             onTabList: function () {
                 nthTabs.on("click", '.right-nav-list', function () {
                     var tabList = methods. getTabList();
                     var html = [];
                     $.each(tabList, function (key, val) {
                         html.push('<li class="toggle-tab" data-id="' + val.id + '">' + val.title + '</li>');
                     });
                     nthTabs.find(".tab-list").html(html.join(''));
                 });
                 nthTabs.find(".tab-list-scrollbar").scrollbar();
                 this.onTabListToggle();
                 return this;
             },

             // Switch tabs under the list
             onTabListToggle: function () {
                 nthTabs.on("click", '.toggle-tab', function () {
                     var tabId = $(this).data("id");
                     methods.setActTab(tabId).locationTab(tabId);
                 });
                 return this;
             }
         };
         return run();
     }
})(jQuery);
