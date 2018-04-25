app.factory( "votingsService", function( $http, $q, votesService, dateService ){
    var votings               = [];
    var endedVotings          = [];
    var counter               = 6; /*todo: to change this that it will be read from json and not hard coded*/
    var loadEndedVotingsFlag  = false;
    var loadVotingsFlag       = false;
    
    function Voting( id, title, details, endDateStr, votes, optVotes )
    {
        this.id                = id;
        this.title             = title;
        this.details           = details;
        this.endDate           = new Date( endDateStr );
        this.votes             = votes;
        this.draftVote         = "";
        this.optVotes          = optVotes;
        this.getId             = function(){ return this.id; }
        this.getTitle          = function(){ return this.title; }
        this.setTitle          = function( title ){ this.title = title; }
        this.getDetails        = function(){ return this.details; }
        this.setDetails        = function( details ){ this.details = details; }
        this.getEndDate        = function(){ return this.endDate; }
        this.setEndDate        = function( endDate ){ this.endDate = endDate; }
        this.getVotes          = function(){ return this.votes; }
        this.setVotes          = function( votes ){ this.votes = votes; }
        this.getDraftVote      = function(){ return this.draftVote; }
        this.getOptVotes       = function(){ return this.optVotes;}
        this.setOptVotes       = function( optVotes ){ this.optVotes = optVotes; }
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
        this.addVoteToVoting   = function( vote )
        {
            this.votes.push( vote );
        }
        this.copyVotesArr = function( votes )
        {
            this.votes = votesService.cloneVotesArrMethod( votes );  
        }
        this.addOptVoteToVoting = function( optVoteStr )
        {
            this.optVotes.push( optVoteStr );
        }
        this.copyOptVotesArr = function( optVotes )
        {
            this.optVotes = optVotes.slice();
        }
        this.isTenantVotedOnVoting = function( voterStr )
        {
            var i   = 0;
            var res = false;

            for( i = 0; i < this.votes.length; i++ )
            {
                if( voterStr === this.votes[i].getVotedBy() )
                {
                    res = true;
                    break;
                }
            }

            return res;
        }
        this.getVotedOptByTenant = function( voterStr )
        {
            var i           = 0;
            var votedOptStr = "";

            for( i = 0; i < this.votes.length; i++ )
            {
                if( voterStr === this.votes[i].getVotedBy() )
                {
                    votedOptStr = this.votes[i].getVoteVal();
                    break;
                } 
            }

            return votedOptStr;
        }
        this.getVotesNum = function()
        {
            var votes = this.getVotes();

            return votes.length;
        }
        this.getVotesOpt = function( optStr )
        {
            var i   = 0;
            var num = 0;

            for( i = 0; i < this.votes.length; i++ )
            {
                if( optStr === this.votes[i].getVoteVal() )
                {
                    num++;
                }
            }

            return num;
        }
    }

    function loadVotingsFunc()
    {
        var asyncLoad = $q.defer();

        if( loadVotingsFlag )
        {
            asyncLoad.resolve( votings );
        }
        else
        {
            loadVotingsFlag = true;

            $http.get( "app/votings/votings.json" ).then( function( response ){
                //on success
                var i = 0;

                //We cannot do here votings = [] because the outside already hold actors and if we do that we change the pointer. For example two collectors that use this service. The first collector call to this function and get an array of actors. Then the second collector call to this function and do messages = [] and by this give a new pointer to messages so the first collector still looked on the old pointer of messages.
                //so to empty the array instead of doing votings = [] do actors.splice( 0, messages.length )

                votings.splice( 0, votings.length );

                for( i = 0; i < response.data.length; i++ ){
                    votings.push( new Voting( parseInt( response.data[i].votingId ), response.data[i].title, response.data[i].details, response.data[i].endDate, votesService.cloneVotesArrMethod( response.data[i].votes ), response.data[i].optVotes.slice() ) );
                }
        
                asyncLoad.resolve( votings );
            }, function( response ){
                //on failure
                loadVotingsFlag = false;

                alert( "Error:" + response );/*todo: to change that*/
                asyncLoad.reject( votings ); 
            }); 
        }

        return asyncLoad.promise;
    }

    function addVoteToVotingFunc( voting, voteBy, voteOpt )
    {
        var votes = voting.getVotes();

        votesService.addVoteToVotesArrMethod( votes, voteBy, voteOpt );
    }

    function loadEndedVotingsFunc()
    {
        var asyncLoad = $q.defer();

        if( loadEndedVotingsFlag )
        {
            asyncLoad.resolve( endedVotings );
        }
        else
        {
            loadEndedVotingsFlag = true;

            $http.get( "app/votings/endedVotings.json" ).then( function( response ){
                //on success
                var i = 0;

                //We cannot do here votings = [] because the outside already hold actors and if we do that we change the pointer. For example two collectors that use this service. The first collector call to this function and get an array of actors. Then the second collector call to this function and do messages = [] and by this give a new pointer to messages so the first collector still looked on the old pointer of messages.
                //so to empty the array instead of doing votings = [] do actors.splice( 0, messages.length )

                endedVotings.splice( 0, endedVotings.length );

                for( i = 0; i < response.data.length; i++ ){
                    endedVotings.push( new Voting( parseInt( response.data[i].votingId ), response.data[i].title, response.data[i].details, response.data[i].endDate, votesService.cloneVotesArrMethod( response.data[i].votes ), response.data[i].optVotes.slice() ) );
                }
        
                asyncLoad.resolve( endedVotings );
            }, function( response ){
                //on failure
                loadEndedVotingsFlag = false;

                alert( "Error:" + response );/*todo: to change that*/
                asyncLoad.reject( endedVotings ); 
            }); 
        }

        return asyncLoad.promise;
    }

    function rmvVotingFunc( l_votings, voting )
    {
        var id         = voting.getId();
        var i          = 0;
        var idx_to_rmv = -1;

        for( i = 0; i < l_votings.length; i++ )
        {
            if( id === l_votings[i].getId() )
            {
                idx_to_rmv = i;
                break;
            }
        }

        if( idx_to_rmv > -1 )
        {
            l_votings.splice( idx_to_rmv, 1 );  
        }
    }

    function mvVotingToEndedVotingsFromVotingsFunc( voting )
    {
        if( voting != null )
        {
            endedVotings.push( voting );
            rmvVotingFunc( votings, voting );
        }
    }

    function createNewVotingFunc( votingTitleStr, votingDetailsStr, endDateObj, optVotes )
    {
        var newVoting            = null;
                        
        counter++;
        
        newVoting = new Voting( counter, votingTitleStr, votingDetailsStr, "2018-04-15", [], optVotes );

        newVoting.setEndDate( endDateObj );
        votings.push( newVoting );   
    }

    return{
        loadVotingsMethod: loadVotingsFunc,
        addVoteToVotingMethod: addVoteToVotingFunc,
        loadEndedVotingsMethod: loadEndedVotingsFunc,
        mvVotingToEndedVotingsFromVotingsMethod: mvVotingToEndedVotingsFromVotingsFunc,
        createNewVotingMethod: createNewVotingFunc
    };
});