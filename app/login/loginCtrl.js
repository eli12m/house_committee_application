app.controller( "loginCtrl", function( $scope, $location, loginService, tenantsService ){
    $scope.loginEmailInput    = "";
    $scope.loginPasswordInput = "";
    $scope.invalidCredentails = false;
    $scope.loginFunc = function(){
        tenantsService.checkTenantExistInTenantsMethod( $scope.loginEmailInput, $scope.loginPasswordInput ).then( 
            function( tenantObj )
            {
                if( tenantObj != null )
                {
                    $scope.invalidCredentails = false;
                    
                    loginService.setActiveTenantMethod( tenantObj );
                    $location.path("/tenants_dashboard");
                }
                else
                {
                    $scope.invalidCredentails = true;
                }
            }, 
            function( tenantObj )
            {
                alert( "Error:" ); /*todo: to change this*/
            });
    };
});