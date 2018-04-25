app.controller('mainNavBarCtrl', function( $scope, $location, loginService ) {
    
    $scope.logoutFunc = function() {
        loginService.setActiveTenantMethod( null );
        $location.path('/');
    }
    $scope.isShowBtn = function(){
        return loginService.isLoginTenantCommitteeMemberMethod();
    }


})