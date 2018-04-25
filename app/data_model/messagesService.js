app.factory( "messagesService", function( $http, $q, dateService, loginService ){
    var messages         = [];
   /* var message1         = null;
    var message2         = null;
    var message3         = null;*/
    var counter          = 3; /*todo: to change this that it will be read from json and not hard coded*/
    var loadMessagesFlag = false;

    function Message( id, title, creationDate, img, details, priority, readBy )
    {
        this.id                = id;
        this.title             = title;
        this.creationDate      = new Date( creationDate );
        this.img               = img;
        this.details           = details;
        this.priority          = priority;
        this.readBy            = readBy;
        this.getId             = function(){ return this.id; }
        this.getCreationDate   = function(){ return this.creationDate; }
        this.getImg            = function(){ return this.img; }
        this.setImg            = function( img ){ this.img = img; }
        this.getPriority       = function(){ return this.priority; }
        this.setPriority       = function( priority ){ this.priority = priority;}
        this.getTitle          = function(){ return this.title; }
        this.setTitle          = function( title ){ this.title = title; }
        this.getDetails        = function(){ return this.details; }
        this.setDetails        = function( details ){ this.details = details; }
        this.getReadBy         = function(){ return this.readBy; }
        this.setReadBy         = function( readBy ){ this.readBy = readBy; }
        this.isTitleIncludeStr = function( str )
        {  
            var title = this.getTitle();

            return title.toUpperCase().includes( str.toUpperCase() );
        }
        this.isDetailsIncludeStr = function( str )
        {
            var details = this.getDetails();

            return details.toUpperCase().includes( str.toUpperCase() );
        }
        this.addReaderToMsg = function( readerStr )
        {
            this.readBy.push( readerStr );
        }
        this.copyReaderByArr = function( readBy )
        {
            this.readBy = readBy.slice();  
        }
        this.isTenantReadMsg = function( readerStr )
        {
            var i   = 0;
            var res = false;

            for( i = 0; i < this.readBy.length; i++ )
            {
                if( readerStr === readBy[i] )
                {
                    res = true;
                    break;
                }
            }

            return res;
        }
    }

    function loadMessagesFunc()
    {
        var asyncLoad = $q.defer();

        if( loadMessagesFlag )
        {
            asyncLoad.resolve( messages );
        }
        else
        {
            loadMessagesFlag = true;

            $http.get( "app/messages/messages.json" ).then( function( response ){
                //on success
                var i = 0;

                //We cannot do here messages = [] because the outside already hold actors and if we do that we change the pointer. For example two collectors that use this service. The first collector call to this function and get an array of actors. Then the second collector call to this function and do messages = [] and by this give a new pointer to messages so the first collector still looked on the old pointer of messages.
                //so to empty the array instead of doing messages = [] do actors.splice( 0, messages.length )

                messages.splice( 0, messages.length );

                for( i = 0; i < response.data.length; i++ ){
                    messages.push( new Message( parseInt( response.data[i].msgId ), response.data[i].title, response.data[i].creationDate, response.data[i].img, response.data[i].details, response.data[i].priority, response.data[i].readBy.slice() ) );
                }
        
                asyncLoad.resolve( messages );
            }, function( response ){
                //on failure
                loadMessagesFlag = false;

                alert( "Error:" + response );
                asyncLoad.reject( messages ); 
            }); 
        }

        return asyncLoad.promise;
    }

    function rmvMessageFunc( message )
    {
        var id         = message.getId();
        var i          = 0;
        var idx_to_rmv = -1;

        for( i = 0; i < messages.length; i++ )
        {
            if( id === messages[i].getId() )
            {
                idx_to_rmv = i;
                break;
            }
        }

        if( idx_to_rmv > -1 )
        {
            messages.splice( idx_to_rmv, 1 );  
        }
    }

    function crtNewMessageFunc( messageTitle, messageDetails, messagePriority, messageImage )
    {
        var newMsg            = null;
        var todayStr          = "";
        var actvTenant        = loginService.getActiveTenantMethod();
        var emailActiveTenant = "";
        
        if( actvTenant != null )
        {
            emailActiveTenant = actvTenant.getEmail();

            counter++;

            todayStr = dateService.getCurDateyyyymmddMethod( 0 );

            newMsg = new Message( counter, messageTitle, todayStr, messageImage, messageDetails, messagePriority, [] );

            newMsg.addReaderToMsg( emailActiveTenant );
            messages.push( newMsg );
        }
    }

    function updMessageFunc( message, messageTitle, messageDetails, messagePriority, messageImage )
    {
        if( message != null )
        {
            message.setTitle( messageTitle );
            message.setDetails( messageDetails );
            message.setPriority( messagePriority );
            message.setImg( messageImage );
        }
    }

   /* message1 = new Message( "New classes in the gym", "2018-03-14", "/assets/images/messages/gym.jpg", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "Information" );
    message2 = new Message( "Dont step on the grass!", "2018-02-01", "/assets/images/messages/grass.jpeg", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "Important" );
    message3 = new Message( "Closing the pool for maintanence", "2018-01-08", "/assets/images/messages/pool.jpg", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "Information" );

    messages.push( message1 );
    messages.push( message2 );
    messages.push( message3 );*/

    return{
        loadMessagesMethod: loadMessagesFunc,
        rmvMessageMethod: rmvMessageFunc,
        createNewMessageMethod: crtNewMessageFunc,
        updateMessageMethod: updMessageFunc
    };
});