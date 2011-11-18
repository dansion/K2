/*!
 * validate date value
 *
 * @revision:
 * @version:1-0-0
 */
 
YUI.add('k2-validator-date', function(Y) {

    Y.namespace('Validator');
    Y.Validator.validateDate = function(val, minYear, maxYear) {
    
        var year, month, day, maxDay,
            result = val.match(/^\s*(\d{4})([\-\/])(\d{1,2})\2(\d{1,2})\s*$/);
        
        if(result === null) return false;

        minYear = minYear || 1940;
        maxYear = maxYear || (new Date()).getFullYear();
        year  = parseInt(result[1], 10);
        
        if(year < minYear) return false;
        if(year > maxYear) return false;
        
        month = parseInt(result[3], 10);
        
        if(month < 1) return false;
        if(month > 12) return false;
        
        day = parseInt(result[4], 10);        
         
        if(day < 1) return false;
        if(day > 31) return false;

        switch(month) {
            case 1: case 3: case 5: case 7: case 8: case 10: case 12:
                return true;
            case 4: case 6: case 9: case 11:
                return day <= 30;
            case 2:
                maxDay = year % 4 === 0 && year % 100 !== 0 || year % 400 === 0 ? 29 : 28;
                return day <= maxDay;
        }
        
    }; // eof validateDate

    
}, '1.0.0', { requires : [] } );
