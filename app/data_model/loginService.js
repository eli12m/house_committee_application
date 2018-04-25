app.factory( "loginService", function( $http, $q, tenantsService ){

    var activeTenant = null;

    function setActiveTenantFunc( tenantObj )
    {
        activeTenant = tenantObj;
    }

    function getActiveTenantFunc()
    {
        return activeTenant;
    }

    function isLoginFunc()
    {
        return activeTenant != null ? true : false;
    }

    function isLoginTenantCommitteeMemberFunc(){
        var res = false;

        if( isLoginFunc() )
        {
            res = activeTenant.isCommitteeMember();
        }

        return res;
    }
    
    return{
        setActiveTenantMethod: setActiveTenantFunc,
        getActiveTenantMethod: getActiveTenantFunc,
        isLoginMethod: isLoginFunc,
        isLoginTenantCommitteeMemberMethod: isLoginTenantCommitteeMemberFunc
    };
});