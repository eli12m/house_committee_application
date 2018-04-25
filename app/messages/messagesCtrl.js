app.controller( "messagesCtrl", function( $scope, $location, messagesService, loginService ){
    
    // This is an authotization check. If the user is not logged going back to the home screen
    if( !loginService.isLoginMethod() )
    {
        $location.path("/login");
        return;
    }
    
    var msgToDel                              = null;
    var msgToUpd                              = null;
    $scope.filterInTitleDetailsInput          = "";
    $scope.orderByInput                       = "creationDate";
    $scope.filterMessagesByTitleAndDetailFunc = function( message ){
        var res = false;
        var str = $scope.filterInTitleDetailsInput;

        res = message.isTitleIncludeStr( str ) || message.isDetailsIncludeStr( str );

        return res;
    };
    $scope.setMessageForRmvFunc = function( message ){
        msgToDel = message;
    };
    $scope.removeMessageFunc = function(){
        if( msgToDel != null )
        {
            messagesService.rmvMessageMethod( msgToDel );

            msgToDel = "";
        }
    }
    $scope.cancelMsgFunc = function(){
        initInputsMessage();
    };
    $scope.createMessageFunc = function(){
        messagesService.createNewMessageMethod( $scope.messageTitleInput, $scope.messageDetailsInput, $scope.messagePriorityInput, $scope.messageImageInput );
        initInputsMessage();
    };
    $scope.fillInputsForUpdFunc = function( message ){
        $scope.messageTitleInput    = message.getTitle();
        $scope.messageDetailsInput  = message.getDetails();
        $scope.messagePriorityInput = message.getPriority();
        $scope.messageImageInput    = message.getImg();
        msgToUpd                    = message;
    };
    $scope.updateMessageFunc = function(){
        messagesService.updateMessageMethod( msgToUpd, $scope.messageTitleInput, $scope.messageDetailsInput, $scope.messagePriorityInput, $scope.messageImageInput );
        initInputsMessage();

        msgToUpd = "";
    };
    $scope.orderDirection = function() {
        return true;
    }
    $scope.isShowBtn = function(){
        return loginService.isLoginTenantCommitteeMemberMethod();
    }
    $scope.clickOnTitleMsgFunc = function( message ){
        var emailActiveTenant = loginService.getActiveTenantMethod().getEmail();

        message.addReaderToMsg( emailActiveTenant );
    }
    /*todo: the next func is called after we do logout and the active tenant is null so we get in the debugger error. To ask if it is ok that it is called in that time and to show the error and if it is ok to do null check.*/
    $scope.showBoldStyleMsgFunc = function( message ){
        var actvTenant        = loginService.getActiveTenantMethod();
        var emailActiveTenant = "";
        var res               = false;
        
        if( actvTenant != null )
        {
            emailActiveTenant = actvTenant.getEmail();
            res = message.isTenantReadMsg( emailActiveTenant );
        }

        return { "bold-style": !res };
    }
    
    messagesService.loadMessagesMethod().then( function( messages ){
        $scope.messages = messages;
    }, function( messages ){
        alert( "Error:" );/*todo: to cangethat*/ 
    });

    function initInputsMessage(){
        $scope.messageTitleInput          = "";
        $scope.messageDetailsInput        = "";
        $scope.messagePriorityInput       = "Important";
        $scope.messageImageInput          = "/assets/images/messages/placeholder.png";

        /* we did this to clear the file name in the file input box */
        if( angular.element( document.querySelector( '#messageImage' )).length > 0 ) {
            angular.element( document.querySelector('#messageImage' ))[0].value='';
       }
    }

    initInputsMessage();
});