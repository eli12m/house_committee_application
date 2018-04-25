app.factory( "tenantsService", function( $http, $q, $log ){
    var tenants          = [];
    var counter          = 3 /*todo: to change this that it will be read from json and not hard coded*/;
    var loadTenantsFlag  = false;

    function Tenant( internalId, fname, lname, email, password, aptNum, img, isCommitteeMember )
    {
        this.internalId        = internalId;
        this.fname             = fname;
        this.lname             = lname;
        this.email             = email;
        this.password          = password;
        this.aptNum            = parseInt( aptNum );
        this.img               = img;
        this.committeeMember   = isCommitteeMember,
        this.getId             = function(){ return this.internalId; }
        this.getFname          = function(){ return this.fname; }
        this.setFname          = function( fname ){ this.fname = fname; }
        this.getLname          = function(){ return this.lname; }
        this.getFullName       = function(){ return this.getFname() + " " + this.getLname(); }
        this.setLname          = function( lname ){ this.lname = lname; }
        this.getEmail          = function(){ return this.email; }
        this.setEmail          = function( email ){ this.email = email; }
        this.getImg            = function(){ return this.img; }
        this.setImg            = function( img ){ this.img = img; }
        this.getAptNum         = function(){ return this.aptNum; }
        this.setAptNum         = function( aptNum ){ this.aptNum = parseInt( aptNum ); }
        this.isCommitteeMember = function(){ return this.committeeMember; }
        this.setCommitteeMember = function( committeeMember ){ this.committeeMember = committeeMember; }
        this.isFnameIncludeStr = function( str )
        {  
            var fname = this.getFname();

            return fname.toUpperCase().includes( str.toUpperCase() );
        }
        this.isLnameIncludeStr = function( str )
        {
            var lname = this.getLname();

            return lname.toUpperCase().includes( str.toUpperCase() );
        }
        this.isNameIncludeStr  = function( str )
        {
            var res      = false;
            var fullName = this.getFname() + " " + this.getLname();

            res = ( this.isFnameIncludeStr( str ) || this.isLnameIncludeStr( str ) || 
                   fullName.toUpperCase().includes( str.toUpperCase() ) );
            
            return res;
        }
        this.isAptNumIncludeStr = function( str )
        {
            var aptNum    = this.getAptNum();
            var aptNumStr = aptNum.toString();

            return aptNumStr.toUpperCase().includes( str.toUpperCase() );
        }
    }

    function loadTenantsFunc()
    {
        var asyncLoad = $q.defer();

        if( loadTenantsFlag )
        {
            asyncLoad.resolve( tenants );
        }
        else
        {
            loadTenantsFlag = true;

            $http.get( "/app/tenants/tenants.json" ).then( function( response ){
                //on success
                var i = 0;

                //We cannot do here tenants = [] because the outside already hold actors and if we do that we change the pointer. For example two collectors that use this service. The first collector call to this function and get an array of actors. Then the second collector call to this function and do messages = [] and by this give a new pointer to messages so the first collector still looked on the old pointer of messages.
                //so to empty the array instead of doing messages = [] do actors.splice( 0, messages.length )

                tenants.splice( 0, tenants.length );

                for( i = 0; i < response.data.length; i++ ){
                    tenants.push( new Tenant( parseInt( response.data[i].internalId ), response.data[i].fname, response.data[i].lname, response.data[i].email, response.data[i].password, response.data[i].aptNum, response.data[i].img, response.data[i].isCommitteeMember ) );
                }
        
                asyncLoad.resolve( tenants );
            }, function( response ){
                //on failure
                loadTenantsFlag = false;

                alert( "Error:" + response );
                asyncLoad.reject( tenants ); 
            }); 
        }

        return asyncLoad.promise;
    }

    function rmvTenantFunc( tenant )
    {
        var id         = tenant.getId();
        var i          = 0;
        var idx_to_rmv = -1;

        for( i = 0; i < tenants.length; i++ )
        {
            if( id === tenants[i].getId() )
            {
                idx_to_rmv = i;
                break;
            }
        }

        if( idx_to_rmv > -1 )
        {
            tenants.splice( idx_to_rmv, 1 );  
        }
    }

    function crtNewTenantFunc( tenantFaname, tenantLname, tenantEmail, tenantAptNum, tenantImage )
    {
        var newTenant   = null;
        var password    = "";

        counter++;

        password = counter.toString();

        newTenant = new Tenant( counter, tenantFaname, tenantLname, tenantEmail, password, tenantAptNum, tenantImage, false );

        tenants.push( newTenant );
    }

    function updTenantFunc( tenant, tenantFname, tenantLname, tenantEmail, tenantAptNum, tenantImage )
    {
        if( tenant != null )
        {
            tenant.setFname( tenantFname );
            tenant.setLname( tenantLname );
            tenant.setEmail( tenantEmail );
            tenant.setAptNum( tenantAptNum );
            tenant.setImg( tenantImage );
        }
    }

    function checkTenantExistInTenantsFunc( tenantEmail, tenantPassword )
    {
        var async     = $q.defer();
        var tenantObj = null;

        $http.get("app/tenants/tenants.json").then(
            function( response ) 
            {
                for (var i = 0; i < response.data.length; i++) {
                    if ( response.data[i].email === tenantEmail && response.data[i].password === tenantPassword )
                    {
                        tenantObj = new Tenant( parseInt( response.data[i].internalId ), response.data[i].fname, response.data[i].lname, response.data[i].email, response.data[i].password, response.data[i].aptNum, response.data[i].img, response.data[i].isCommitteeMember );
                        break;
                    }                
                }

                async.resolve( tenantObj );
            }, 
            function( response ) 
            {
                $log.error( "error in getting user json: " + JSON.stringify( response ) );
                async.reject( tenantObj );
            });

            return async.promise;
    }

    function getNumOfTenantsFunc()
    {
        return tenants.length;
    }

   /* message1 = new Message( "New classes in the gym", "2018-03-14", "/assets/images/messages/gym.jpg", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "Information" );
    message2 = new Message( "Dont step on the grass!", "2018-02-01", "/assets/images/messages/grass.jpeg", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "Important" );
    message3 = new Message( "Closing the pool for maintanence", "2018-01-08", "/assets/images/messages/pool.jpg", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "Information" );

    messages.push( message1 );
    messages.push( message2 );
    messages.push( message3 );*/

    return{
        loadTenantsMethod: loadTenantsFunc,
        rmvTenantMethod: rmvTenantFunc,
        createNewTenantMethod: crtNewTenantFunc,
        updateTenantMethod: updTenantFunc,
        checkTenantExistInTenantsMethod: checkTenantExistInTenantsFunc,
        getNumOfTenantsMethod: getNumOfTenantsFunc
    };
});