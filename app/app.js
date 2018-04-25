var app = angular.module( "homeSystemApp", ["ngRoute", 'googlechart'] );

app.config(function($routeProvider) {
    $routeProvider
    .when("/", { templateUrl : "landingPage.html" })
    .when("/messages", { templateUrl : "app/messages/messages.html", controller : "messagesCtrl" })
    .when("/tenants", { templateUrl : "app/tenants/tenants.html", controller : "tenantsCtrl" })
    .when("/login", { templateUrl : "app/login/login.html", controller : "loginCtrl" })
    .when("/votings", { templateUrl : "app/votings/votings.html", controller : "votingsCtrl" })
    .when("/tenants_dashboard", { templateUrl : "app/tenants_dashboard/tenantsDashboard.html" })
    .otherwise({redirectTo : "/"});
});