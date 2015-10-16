angular.module('barkbaud.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('components/photo.html',
        '<div class="bark-dog-photo img-circle center-block">\n' +
        '</div>\n' +
        '');
    $templateCache.put('pages/dashboard/dashboardpage.html',
        '<div class="container-fluid">\n' +
        '  <h1>Dashboard</h1>\n' +
        '  <section class="panel" ng-repeat="dog in dashboardPage.dogs">\n' +
        '    <div class="panel-body">\n' +
        '      <div class="row">\n' +
        '          <div class="col-md-3 col-lg-2">\n' +
        '              <bark-photo bark-photo-url="dog.image.url"></bark-photo>\n' +
        '          </div>\n' +
        '          <div class="col-md-9 col-lg-10">\n' +
        '              <h1>\n' +
        '                <a ui-sref="dog.views({dogId: dog.objectId})">{{dog.name}}</a>\n' +
        '              </h1>\n' +
        '              <h4>{{dog.breed}} &middot; {{dog.gender}}</h4>\n' +
        '              <p class="bb-text-block bark-dog-bio">{{dog.bio}}</p>\n' +
        '          </div>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </section>\n' +
        '</div>\n' +
        '');
    $templateCache.put('pages/dogs/dogpage.html',
        '<div class="bb-page-header">\n' +
        '    <div class="container-fluid">\n' +
        '        <div class="row">\n' +
        '            <div class="col-md-3 col-lg-2">\n' +
        '                <bark-photo bark-photo-url="dogPage.dog.image.url"></bark-photo>\n' +
        '            </div>\n' +
        '            <div class="col-md-9 col-lg-10">\n' +
        '                <h1>\n' +
        '                  {{dogPage.dog.name}}\n' +
        '                </h1>\n' +
        '                <h4>{{dogPage.dog.breed}} &middot; {{dogPage.dog.gender}}</h4>\n' +
        '                <p></p>\n' +
        '                <p class="bb-text-block bark-dog-bio">{{dogPage.dog.bio}}</p>\n' +
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
        '  <div bb-tile-section>\n' +
        '    <div ng-show="dogNotesTile.notes">\n' +
        '      <div ng-switch="dogNotesTile.length || 0">\n' +
        '        <div ng-switch-when="0" class="bb-no-records">\n' +
        '          This dog has no notes.\n' +
        '        </div>\n' +
        '        <div ng-switch-default ng-repeat="note in dogNotesTile.notes">\n' +
        '          <h4>{{ note.title }}</h4>\n' +
        '          <p>{{ note.description }}</p>\n' +
        '        </div>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</bb-tile>\n' +
        '');
    $templateCache.put('pages/dogs/summary/summarytile.html',
        '<bb-tile bb-tile-header="\'Summary\'">\n' +
        '    <div bb-tile-section>\n' +
        '        \n' +
        '    </div>\n' +
        '</bb-tile>\n' +
        '');
    $templateCache.put('pages/login/loginpage.html',
        '<div class="container-fluid">\n' +
        '  <h1>Login</h1>\n' +
        '  <div class="panel">\n' +
        '    <div class="panel-body">\n' +
        '      <div ng-switch="loginPage.isAuthenticated">\n' +
        '        <div ng-switch-when="\'true\'">\n' +
        '          Welcome\n' +
        '        </div>\n' +
        '        <div ng-switch-default>\n' +
        '          <button type="button" class="btn btn-primary" ng-click="loginPage.login()">\n' +
        '            Login with Blackbaud\n' +
        '          </button>\n' +
        '        <div>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>\n' +
        '');
}]);
