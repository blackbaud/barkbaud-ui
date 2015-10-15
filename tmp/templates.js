angular.module('barkbaud.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('pages/dashboard/dashboardpage.html',
        '<div class="container-fluid">\n' +
        '  <h1>Dashboard</h1>\n' +
        '  <div class="panel" ng-repeat="dog in dashboardPage.dogs">\n' +
        '    <div class="panel-body">\n' +
        '      <h2>\n' +
        '        <a ui-sref="dog.views({dogId: dog.objectId})">{{dog.name}}</a>\n' +
        '      </h2>\n' +
        '      <p>\n' +
        '        {{dog.bio}}\n' +
        '      </p>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>\n' +
        '');
    $templateCache.put('pages/dogs/dogpage.html',
        '<div class="bb-page-header">\n' +
        '    <div class="container-fluid">\n' +
        '        <div class="row">\n' +
        '            <div class="col-md-3 col-lg-2">\n' +
        '                <img ng-src="{{ dogPage.dog.image.url }}" class="bark-dog-photo img-circle center-block" />\n' +
        '            </div>\n' +
        '            <div class="col-md-9 col-lg-10">\n' +
        '                <h1>{{dogPage.dog.name}}</h1>\n' +
        '                <p></p>\n' +
        '                <p class="bark-dog-bio">{{dogPage.dog.bio}}</p>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '<div class="container-fluid">\n' +
        '    <bb-tile-dashboard bb-layout="dogPage.layout" bb-tiles="dogPage.tiles"></bb-tile-dashboard>\n' +
        '</div>\n' +
        '');
    $templateCache.put('pages/dogs/notes/notestile.html',
        '<bb-tile bb-tile-header="\'Notes\'">\n' +
        '    <div bb-tile-section>\n' +
        '\n' +
        '    </div>\n' +
        '</bb-tile>\n' +
        '');
    $templateCache.put('pages/dogs/summary/summarytile.html',
        '<bb-tile bb-tile-header="\'Summary\'">\n' +
        '    <div bb-tile-section>\n' +
        '        \n' +
        '    </div>\n' +
        '</bb-tile>\n' +
        '');
}]);
