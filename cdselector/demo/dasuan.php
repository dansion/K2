<?php require_once("../../_assets/demo.php"); ?>
<html>
<head>
<?php echo_html_charset() ?>
<title>Custom data cdselector</title>
<?php echo_default_css() ?>

</head>
<body>

<div>
<span id="container"></span>
</div>

<!-- <script charset="utf-8" src="/k2/seed/seed.js"></script> -->

<script>
var K2_config = {
    noCombine : true,
    noCache : true,
    console : true,
    noVersion : true,
    syntaxHighlight : false,
    local : true 
}
</script>

<?php echo_default_js(''); ?>


<script>
YUI().use("k2-cdselector",function(Y){

    var cardType = {
        data : {1:"内部",2:"线上申请",3:"主动派发",4:"口碑",5:"非口碑",6:"口碑线上申请",7:"淘宝店店铺兑换",8:"淘宝VIP申请",9:"广发发卡",10:"活动派发",11:"驻店发卡",12:"淘宝VIP",13:"商户拓展",14:"驻店换卡",15:"邮寄换卡",16:"内部员工",17:"商务用途",18:"内部活动",19:"预算内领卡",20:"员工卡",21:"商务用途",22:"日常线上申请",23:"活动线上申请",24:"市场",25:"运营",26:"市场",27:"运营"},
        level : [
            {0:[1,2,3]},
            {1:[4,5],2:[6,7,8,9],3:[10,11,12,13,14,15]},
            {4:[16,17,18,19],5:[20,21],6:[22,23],10:[24,25],11:[26,27],12:[]}
        ]
    };

    new Y.Cdselector({
        containerId : "container",
        config:{
                renderType : 1,
                levelNum : 3,
                jsonName : "cdselectorJson",
                limitArray:[false,false,false],
                afterChange : function(lv,s){
                    Y.log('当前值：' + s);
                },
                dataSource : cardType


        }
    });
    
    // cdselector_a.select("3300000000-3301000000-3301020000-3301020006");
}); 
</script>

</body>
</html>
