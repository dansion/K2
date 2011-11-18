/*
 * @author:
 * @version:1-1-0
 */


YUI().add('k2-switch-tabs', function(Y) {

    /**
     * Tabs Class
     * @constructor
     */

   
    function Tabs(container, config) {
        var self = this;

        // factory or constructor
        if (!(self instanceof Tabs)) {
            return new Tabs(container, config);
        }

        Tabs.superclass.constructor.call(self, container, config);
    }



    Y.extend(Tabs, Y.Switch);

    Y.Tabs = Tabs;

},'1-1-0',{requires:['k2-switch']});
