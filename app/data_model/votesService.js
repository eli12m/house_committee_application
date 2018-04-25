app.factory( "votesService", function(){

    function Vote( voteByStr, voteValStr )
    {
        this.voteBy     = voteByStr;
        this.voteVal    = voteValStr;
        this.getVotedBy = function(){ return this.voteBy; }
        this.setVotedBy = function( voteByStr ){ this.voteBy = voteByStr; }
        this.getVoteVal = function(){ return this.voteVal; }
        this.setVoteVal = function( voteValStr ){ this.voteVal = voteValStr; }
    }

    function addVoteToVotesArrFunc( votes, voteBy, voteVal )
    {
        var vote = null;

        vote = new Vote( voteBy, voteVal );

        votes.push( vote );
    }

    function cloneVotesArrFunc( votes )
    {
        var i       = 0;
        var vote    = null;
        var cpVotes = [];

        for( i = 0; i < votes.length; i++ )
        {
            vote = new Vote( votes[i].voteBy, votes[i].voteVal );

            cpVotes.push( vote );
        }

        return cpVotes;
    }

    return{
        addVoteToVotesArrMethod: addVoteToVotesArrFunc,
        cloneVotesArrMethod: cloneVotesArrFunc
    };
});