app.factory( "dateService", function(){
    function getCurDateyyyymmddFunc( incMonth )
    {
        var today  = null;
        var todayStr = "";
        var day    = -1;
        var dayStr = "";
        var month  = -1;
        var monthStr = "";
        var year   = 2018;

        today  = new Date();

        today.setMonth( today.getMonth() + incMonth );

        day    = today.getDate();
        month  = today.getMonth()+1; //January is 0!
        year   = today.getFullYear();

        if( day < 10) 
        {
            dayStr = '-0' + day;
        }
        else
        {
            dayStr = '-' + day;
        } 
        
        if( month < 10 ) 
        {
            monthStr = '-0' + month;
        }
        else
        {
            monthStr = '-' + month;
        }
        
        todayStr = year + monthStr + dayStr;

        return todayStr;
    }

    function isDatePassFunc( endDate )
    {
        var today = new Date();
        var res   = false;

        if( today >= endDate )
        {
            res = true;
        }

        return res;
    }

    return{
        getCurDateyyyymmddMethod: getCurDateyyyymmddFunc,
        isDatePassMethod: isDatePassFunc
    }
});