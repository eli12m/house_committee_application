app.controller( "tenantsCtrl", function( $scope, $location, tenantsService, loginService ){
    
    if( !loginService.isLoginMethod() )
    {
        $location.path("/login");
        return;
    }
    
    var tenantToDel                              = null;
    var tenantToUpd                              = null;
    $scope.filterTenantsFunc = function( tenant ){
        var res = false;
        var str = $scope.filterTenantInput;

        res = tenant.isNameIncludeStr( str ) || tenant.isAptNumIncludeStr( str );

        return res;
    };
    $scope.setTenantForRmvFunc = function( tenant ){
        tenantToDel = tenant;
    };
    $scope.removeTenantFunc = function(){
        if( tenantToDel != null )
        {
            tenantsService.rmvTenantMethod( tenantToDel );

            tenantToDel = "";
        }
    }
    $scope.cancelTenantFunc = function(){
        initInputsTenant();
    };
    $scope.createTenantFunc = function(){
        tenantsService.createNewTenantMethod( $scope.tenantFnameInput, $scope.tenantLnameInput, $scope.tenantEmailInput, $scope.tenantAptNumInput, $scope.tenantImageInput );
        initInputsTenant();
    };
    $scope.fillInputsForUpdFunc = function( tenant ){
        $scope.tenantFnameInput        = tenant.getFname();
        $scope.tenantLnameInput        = tenant.getLname();
        $scope.tenantEmailInput        = tenant.getEmail();
        $scope.tenantAptNumInput       = tenant.getAptNum();
        $scope.tenantImageInput        = tenant.getImg();
        tenantToUpd                    = tenant;
    };
    $scope.updateTenantFunc = function(){
        tenantsService.updateTenantMethod( tenantToUpd, $scope.tenantFnameInput, $scope.tenantLnameInput, $scope.tenantEmailInput, $scope.tenantAptNumInput, $scope.tenantImageInput );
        initInputsTenant();

        tenantToUpd = "";
    };

    $scope.filterTenantInput  = "";
    $scope.orderTenantByInput = "lname";

    tenantsService.loadTenantsMethod().then( function( tenants ){
        $scope.tenants = tenants;
    }, function( tenants ){
        alert( "Error:" ); 
    });

    function initInputsTenant(){
        $scope.tenantFnameInput          = "";
        $scope.tenantLnameInput          = "";
        $scope.tenantEmailInput          = "";
        $scope.tenantAptNumInput         = "";
        $scope.tenantImageInput          = "/assets/images/tenants/placeholder.jpg";

        /* we did this to clear the file name in the file input box */
        if( angular.element( document.querySelector( '#tenantImage' )).length > 0 ) {
            angular.element( document.querySelector('#tenantImage' ))[0].value='';
        }
    }

    initInputsTenant();
});