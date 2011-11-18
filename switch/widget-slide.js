/*
 * @author:
 * @version:1-1-0
 */


YUI().add('k2-switch-slide', function(Y) {

    /**
     * 默认配置，和 Switchable 相同的部分此处未列出
     */
    var defaultConfig = {
        autoplay: true,
        circular: true
    };

    /**
     * Slide Class
     * @constructor
     */
    function Slide(container, config) {
        var self = this;

        // factory or constructor
        if (!(self instanceof Slide)) {
            return new Slide(container, config);
        }

        Slide.superclass.constructor.call(self, container, Y.merge(defaultConfig, config));
    }

    Y.extend(Slide, Y.Switch);
    Y.Slide = Slide;

},'1-1-0',{requires:['k2-switch']});

