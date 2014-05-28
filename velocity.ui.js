/*!
 Animate.css - http://daneden.me/animate
 Licensed under the MIT license

 Copyright (c) 2013 Daniel Eden

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
jQuery.velocity.Sequences.bounce =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {translateY:[0,0]},
            options:{duration: duration * 0.20}
        },
        {
            properties: {translateY:'-30px'},
            options:{duration: duration * 0.20}
        },
        {
            properties: {translateY:0},
            options:{duration: duration * 0.10}
        },
        {
            properties: {translateY:'-15px'},
            options:{duration: duration * 0.10}
        },
        {
            properties: {translateY:0},
            options:{duration: duration * 0.20}
        },
        {
            properties: {translateY:0},
            options:{
                duration: duration * 0.20,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.flash =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {opacity:[0,1]},
            options:{duration: duration * 0.25}
        },
        {
            properties: {opacity:1},
            options:{duration: duration * 0.25}
        },
        {
            properties: {opacity:0},
            options:{duration: duration * 0.25}
        },
        {
            properties: {opacity:1},
            options:{
                duration: duration * 0.25,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.pulse =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {
                scaleX:[1.1,1],
                scaleY:[1.1,1]
            },
            options:{duration: duration * 0.50}
        },
        {
            properties: {
                scaleX:1,
                scaleY:1
            },
            options:{
                duration: duration * 0.50,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.rubberBand =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {
                scaleX:[1.25,1],
                scaleY:[0.75,1]
            },
            options:{duration: duration * 0.30}
        },
        {
            properties: {
                scaleX:0.75,
                scaleY:1.25
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                scaleX:1.15,
                scaleY:0.85
            },
            options:{duration: duration * 0.20}
        },
        {
            properties: {
                scaleX:1,
                scaleY:1
            },
            options:{
                duration: duration * 0.40,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.shake =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {translateX:['-10px',0]},
            options:{duration: duration * 0.10}
        },
        {
            properties: {translateX:'10px'},
            options:{duration: duration * 0.10}
        },
        {
            properties: {translateX:'-10px'},
            options:{duration: duration * 0.10}
        },
        {
            properties: {translateX:'10px'},
            options:{duration: duration * 0.10}
        },
        {
            properties: {translateX:'-10px'},
            options:{duration: duration * 0.10}
        },
        {
            properties: {translateX:'10px'},
            options:{duration: duration * 0.10}
        },
        {
            properties: {translateX:'-10px'},
            options:{duration: duration * 0.10}
        },
        {
            properties: {translateX:'10px'},
            options:{duration: duration * 0.10}
        },
        {
            properties: {translateX:'-10px'},
            options:{duration: duration * 0.10}
        },
        {
            properties: {translateX:0},
            options:{
                duration: duration * 0.10,
                complete:options.complete || null
            }
        }
    ];
    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.swing =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {rotateZ:['15deg',0]},
            options:{duration: duration * 0.20}
        },
        {
            properties: {rotateZ:'-10deg'},
            options:{duration: duration * 0.20}
        },
        {
            properties: {rotateZ:'5deg'},
            options:{duration: duration * 0.20}
        },
        {
            properties: {rotateZ:'-5deg'},
            options:{duration: duration * 0.20}
        },
        {
            properties: {rotateZ:0},
            options:{
                duration: duration * 0.20,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.tada =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {scaleX:[0.9,1],scaleY:[0.9,1],rotateZ:['-3deg',0]},
            options:{duration: duration * 0.10}
        },
        {
            properties: {scaleX:0.9,scaleY:0.9,rotateZ:'-3deg'},
            options:{duration: duration * 0.10}
        },
        {
            properties: {scaleX:1.1,scaleY:1.1,rotateZ:'3deg'},
            options:{duration: duration * 0.10}
        },
        {
            properties: {scaleX:1.1,scaleY:1.1,rotateZ:'-3deg'},
            options:{duration: duration * 0.10}
        },
        {
            properties: {scaleX:1.1,scaleY:1.1,rotateZ:'3deg'},
            options:{duration: duration * 0.10}
        },
        {
            properties: {scaleX:1.1,scaleY:1.1,rotateZ:'-3deg'},
            options:{duration: duration * 0.10}
        },
        {
            properties: {scaleX:1.1,scaleY:1.1,rotateZ:'3deg'},
            options:{duration: duration * 0.10}
        },{
            properties: {scaleX:1.1,scaleY:1.1,rotateZ:'-3deg'},
            options:{duration: duration * 0.10}
        },
        {
            properties: {scaleX:1.1,scaleY:1.1,rotateZ:'3deg'},
            options:{duration: duration * 0.10}
        },
        {
            properties: {scaleX:1,scaleY:1,rotateZ:0},
            options:{
                duration: duration * 0.20,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.wobble =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {translateX:['-25%',0],rotateZ:'-5deg'},
            options:{duration: duration * 0.15}
        },
        {
            properties: {translateX:'20%',rotateZ:'3deg'},
            options:{duration: duration * 0.15}
        },
        {
            properties: {translateX:'-15%',rotateZ:'-3deg'},
            options:{duration: duration * 0.15}
        },
        {
            properties: {translateX:'10%',rotateZ:'2deg'},
            options:{duration: duration * 0.15}
        },
        {
            properties: {translateX:'-5%',rotateZ:'-1deg'},
            options:{duration: duration * 0.15}
        },
        {
            properties: {translateX:'0%',rotateZ:0},
            options:{
                duration: duration * 0.20,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.bounceIn =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {opacity:[1,0],scaleX:[1.05,0.3],scaleY:[1.05,0.3]},
            options:{duration: duration * 0.5}
        },
        {
            properties: {scaleX:0.9,scaleY:0.9},
            options:{duration: duration * 0.20}
        },
        {
            properties: {scaleX:1,scaleY:1},
            options:{
                duration: duration * 0.30,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.bounceInDown =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {opacity:[1,0],translateY:['30px',"-2000px"]},
            options:{duration: duration * 0.6}
        },
        {
            properties: {translateY:'-10px'},
            options:{duration: duration * 0.20}
        },
        {
            properties: {translateY:0},
            options:{
                duration: duration * 0.20,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.bounceInLeft =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {opacity:[1,0],translateX:['30px',"-2000px"]},
            options:{duration: duration * 0.6}
        },
        {
            properties: {translateX:'-10px'},
            options:{duration: duration * 0.20}
        },
        {
            properties: {translateX:0},
            options:{
                duration: duration * 0.20,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.bounceInRight =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {opacity:[1,0],translateX:['-30px',"2000px"]},
            options:{duration: duration * 0.6}
        },
        {
            properties: {translateX:'10px'},
            options:{duration: duration * 0.20}
        },
        {
            properties: {translateX:0},
            options:{
                duration: duration * 0.20,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.bounceInRight =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {opacity:[1,0],translateY:['-30px',"2000px"]},
            options:{duration: duration * 0.6}
        },
        {
            properties: {translateY:'10px'},
            options:{duration: duration * 0.20}
        },
        {
            properties: {translateY:0},
            options:{
                duration: duration * 0.20,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.bounceOut =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {opacity:[1,1],scaleX:[0.95,1],scaleY:[0.95,1]},
            options:{duration: duration * 0.25}
        },
        {
            properties: {scaleX:1.1,scaleY:1.1},
            options:{duration: duration * 0.25}
        },
        {
            properties: {opacity:0,scaleX:0.3,scaleY:0.3},
            options:{
                duration: duration * 0.20,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.bounceOutDown =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {opacity:[1,1],translateY:["-20px",0]},
            options:{duration: duration * 0.20}
        },
        {
            properties: {opacity:0,translateY:"2000px"},
            options:{
                duration: duration * 0.80,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.bounceOutLeft =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {opacity:[1,1],translateX:["20px",0]},
            options:{duration: duration * 0.20}
        },
        {
            properties: {opacity:0,translateX:"-2000px"},
            options:{
                duration: duration * 0.80,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.bounceOutRight =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {opacity:[1,1],translateX:["-20px",0]},
            options:{duration: duration * 0.20}
        },
        {
            properties: {opacity:0,translateX:"2000px"},
            options:{
                duration: duration * 0.80,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.bounceOutUp =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {opacity:[1,1],translateY:["20px",0]},
            options:{duration: duration * 0.20}
        },
        {
            properties: {opacity:0,translateY:"-2000px"},
            options:{
                duration: duration * 0.80,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.fadeIn =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[1,0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.fadeInDown =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[1,0],
            translateY:[0,"-20px"]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.fadeInDownBig =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[1,0],
            translateY:[0,"-2000px"]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.fadeInLeft =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[1,0],
            translateX:[0,"-20px"]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.fadeInLeftBig =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[1,0],
            translateX:[0,"-2000px"]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.fadeInRight =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[1,0],
            translateX:[0,"20px"]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.fadeInRightBig =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[1,0],
            translateX:[0,"2000px"]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.fadeInUp =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[1,0],
            translateY:[0,"20px"]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.fadeInUpBig =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[1,0],
            translateY:[0,"2000px"]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.fadeOut =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[0,1]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.fadeOutDown =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[0,1],
            translateY:["20px",0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.fadeOutDownBig =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[0,1],
            translateY:["2000px",0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.fadeOutLeft =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[0,1],
            translateX:["-20px",0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.fadeOutLeftBig =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[0,1],
            translateX:["-2000px",0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.fadeOutRight =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[0,1],
            translateX:["20px",0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.fadeOutRightBig =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[0,1],
            translateX:["2000px",0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.fadeOutUp =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[0,1],
            translateY:["-20px",0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.fadeOutUpBig =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[0,1],
            translateY:["-2000px",0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.flip =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {transformPerspective:[400,400],translateZ:['150px',0],rotateY:['170deg',0],scaleY:[1,1],scaleX:[1,1]},
            options:{duration: duration * 0.40}
        },
        {
            properties: {transformPerspective:400,rotateY:'190deg'},
            options:{duration: duration * 0.10}
        },
        {
            properties: {transformPerspective:400,translateZ:0,rotateY:'360deg',scaleY:0.95,scaleX:0.95},
            options:{duration: duration * 0.30}
        },
        {
            properties: {transformPerspective:400,scaleY:1,scaleX:1},
            options:{
                duration: duration * 0.20,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.flipInX =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {transformPerspective:[400,400],rotateX:['-10deg','90deg'],opacity:[0.4,0]},
            options:{duration: duration * 0.40}
        },
        {
            properties: {transformPerspective:400,rotateX:'10deg',opacity:0.7},
            options:{duration: duration * 0.10}
        },
        {
            properties: {transformPerspective:400,rotateX:0,opacity:1},
            options:{
                duration: duration * 0.20,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.flipInY =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {transformPerspective:[400,400],rotateY:['-10deg','90deg'],opacity:[0.4,0]},
            options:{duration: duration * 0.40}
        },
        {
            properties: {transformPerspective:400,rotateY:'10deg',opacity:0.7},
            options:{duration: duration * 0.10}
        },
        {
            properties: {transformPerspective:400,rotateY:0,opacity:1},
            options:{
                duration: duration * 0.20,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.flipOutX =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformPerspective:[400,400],
            rotateX:['90deg',0],
            opacity:[0,1]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.flipOutY =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformPerspective:[400,400],
            rotateY:['90deg',0],
            opacity:[0,1]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.lightSpeedIn =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {
                opacity:[1,0],
                translateX:['-20%','100%'],
                skewX:['30deg','-30deg']
            },
            options:{duration: duration * 0.40}
        },
        {
            properties: {
                translateX:'0%',
                skewX:'-15deg'
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                skewX:'0deg'
            },
            options:{
                duration: duration * 0.20,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.lightSpeedOut =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[0,1],
            translateX:['100%','0%'],
            skewX:['-30deg','0deg']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.rotateIn =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['50%','50%'],
            transformOriginY:['50%','50%'],
            transformOriginZ:['0','0'],
            rotateZ:[0,'-200deg'],
            opacity:[1,0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.rotateInDownLeft =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['0','0'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:[0,'-90deg'],
            opacity:[1,0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.rotateInDownRight =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['100%','100%'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:[0,'90deg'],
            opacity:[1,0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.rotateInUpLeft =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['0','0'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:[0,'90deg'],
            opacity:[1,0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.rotateInUpRight =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['100%','100%'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:[0,'-90deg'],
            opacity:[1,0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.rotateOut =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['50%','50%'],
            transformOriginY:['50%','50%'],
            transformOriginZ:['0','0'],
            rotateZ:['200deg',0],
            opacity:[0,1]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.rotateOutDownLeft =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['0','0'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:['90deg',0],
            opacity:[0,1]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.rotateOutDownRight =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['100%','100%'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:['-90deg',0],
            opacity:[0,1]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.rotateOutUpLeft =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['0','0'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:['-90deg',0],
            opacity:[0,1]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.rotateOutUpRight =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['100%','100%'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:['90deg',0],
            opacity:[0,1]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.slideInDown =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            translateY: [ 0, "-2000px" ]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.slideInLeft =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            translateX: [ 0, "-2000px" ]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.slideInRight =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            translateX: [ 0, "2000px" ]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.slideInUp =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            translateY: [ 0, "2000px" ]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.slideOutDown =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            translateY: [ "2000px", 0 ]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.slideOutLeft =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            translateX: [ "-2000px", 0 ]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.slideOutRight =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            translateX: [ "2000px", 0 ]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.slideOutUp =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            translateY: [ "-2000px", 0 ]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.hinge =  function(el, options){
    var duration = options.duration || 2000;

    var calls = [
        {
            properties: {transformOriginX:['0','0'],transformOriginY:['0','0'],transformOriginZ:['0','0'], rotateZ:['80deg','easeInOut',0],opacity:[1,1]},
            options:{duration: duration * 0.20}
        },
        {
            properties: {rotateZ:['60deg','easeInOut']},
            options:{duration: duration * 0.20}
        },
        {
            properties: {rotateZ:['80deg','easeInOut']},
            options:{duration: duration * 0.20}
        },
        {
            properties: {rotateZ:['60deg','easeInOut'],translateY:0},
            options:{duration: duration * 0.10}
        },
        {
            properties: {translateY:'700px',opacity:[0,1]},
            options:{
                duration: duration * 0.20,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.rollIn =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            translateX:[0,'-100%'],
            opacity:[1,0],
            rotateZ:['0deg','-120deg']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.rollOut =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[0,1],
            translateX:['100%',0],
            rotateZ:['120deg','0deg']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
/*!
 Magic - http://minimamente.com
 Licensed under the MIT license

 Copyright (c) 2014 Christian Pucci

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
jQuery.velocity.Sequences.puffIn =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[1,0],
            transformOriginX:['50%','50%'],
            transformOriginY:['50%','50%'],
            transformOriginZ:['0','0'],
            scaleX:[1,2],
            scaleY:[1,2],
            blur:[0,'2px'] // not working yet
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.puffOut =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[0,1],
            transformOriginX:['50%','50%'],
            transformOriginY:['50%','50%'],
            transformOriginZ:['0','0'],
            scaleX:[2,1],
            scaleY:[2,1],
            blur:['2px',0] // not working yet
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.vanishIn =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[1,0],
            transformOriginX:['50%','50%'],
            transformOriginY:['50%','50%'],
            transformOriginZ:['0','0'],
            scaleX:[1,2],
            scaleY:[1,2],
            blur:[0,'90px'] // not working yet
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.vanishOut =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            opacity:[0,1],
            transformOriginX:['50%','50%'],
            transformOriginY:['50%','50%'],
            transformOriginZ:['0','0'],
            scaleX:[2,1],
            scaleY:[2,1],
            blur:['20px',0] // not working yet
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.magic =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['200%','100%'],
            transformOriginY:['500%','200%'],
            transformOriginZ:['0','0'],
            rotateZ:['270deg',0],
            scaleX:[0,1],
            scaleY:[0,1],
            opacity:[0,1]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.swap =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['100%','0'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            scaleX:[1,0],
            scaleY:[1,0],
            translateX:['0','-700px'],
            translateY:['0','0'],
            opacity:[1,0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.twisterInDown =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {
                transformOriginX:['0%','0%'],
                transformOriginY:['100%','100%'],
                transformOriginZ:['0','0'],
                rotateZ:['360deg','360deg'],
                scaleX:[0,0],
                scaleY:[0,0],
                translateY:['-100%','-100%'],
                opacity:[1,1]
            },
            options:{duration: duration * 0.30}
        },
        {
            properties: {
                transformOriginX:'100%',
                transformOriginY:'100%',
                transformOriginZ:'0',
                rotateZ:'0deg',
                scaleX:1,
                scaleY:1,
                translateY:'0%',
                opacity:1
            },
            options:{
                duration: duration * 0.70,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.twisterInUp =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {
                transformOriginX:['100%','100%'],
                transformOriginY:['0%','0%'],
                transformOriginZ:['0','0'],
                rotateZ:['360deg','360deg'],
                scaleX:[0,0],
                scaleY:[0,0],
                translateY:['100%','100%'],
                opacity:[1,0]
            },
            options:{duration: duration * 0.30}
        },
        {
            properties: {
                transformOriginX:'0',
                transformOriginY:'0',
                transformOriginZ:'0',
                rotateZ:'0deg',
                scaleX:1,
                scaleY:1,
                translateY:'0',
                opacity:1
            },
            options:{
                duration: duration * 0.70,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.foolishIn =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {
                transformOriginX:['0%','50%'],
                transformOriginY:['100%','50%'],
                transformOriginZ:['0','0'],
                scaleX:[0.5,0],
                scaleY:[0.5,0],
                opacity:[1,0],
                rotateZ:[0,'360deg']
            },
            options:{duration: duration * 0.20}
        },
        {
            properties: {
                transformOriginX:'100%',
                transformOriginY:'100%',
                transformOriginZ:'0',
                scaleX:0.5,
                scaleY:0.5,
                opacity:1,
                rotateZ:0
            },
            options:{duration: duration * 0.20}
        },
        {
            properties: {
                transformOriginX:'0%',
                transformOriginY:'0%',
                transformOriginZ:'0',
                scaleX:0.5,
                scaleY:0.5,
                opacity:1,
                rotateZ:0
            },
            options:{duration: duration * 0.20}
        },
        {
            properties: {
                transformOriginX:'0%',
                transformOriginY:'0%',
                transformOriginZ:'0',
                scaleX:0.5,
                scaleY:0.5,
                opacity:1,
                rotateZ:0
            },
            options:{duration: duration * 0.20}
        },
        {
            properties: {
                transformOriginX:'50%',
                transformOriginY:'50%',
                transformOriginZ:'0',
                scaleX:1,
                scaleY:1,
                opacity:1,
                rotateZ:0
            },
            options:{
                duration: duration * 0.20,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.foolishOut =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {
                transformOriginX:['0%','50%'],
                transformOriginY:['0%','50%'],
                transformOriginZ:['0','0'],
                scaleX:[0.5,1],
                scaleY:[0.5,1],
                opacity:[1,1],
                rotateZ:[0,'360deg']
            },
            options:{duration: duration * 0.20}
        },
        {
            properties: {
                transformOriginX:'100%',
                transformOriginY:'0%',
                transformOriginZ:'0',
                scaleX:0.5,
                scaleY:0.5,
                opacity:1,
                rotateZ:0
            },
            options:{duration: duration * 0.20}
        },
        {
            properties: {
                transformOriginX:'0%',
                transformOriginY:'0%',
                transformOriginZ:'0',
                scaleX:0.5,
                scaleY:0.5,
                opacity:1,
                rotateZ:0
            },
            options:{duration: duration * 0.20}
        },
        {
            properties: {
                transformOriginX:'0%',
                transformOriginY:'100%',
                transformOriginZ:'0',
                scaleX:0.5,
                scaleY:0.5,
                opacity:1,
                rotateZ:0
            },
            options:{duration: duration * 0.20}
        },
        {
            properties: {
                transformOriginX:'50%',
                transformOriginY:'50%',
                transformOriginZ:'0',
                scaleX:0,
                scaleY:0,
                opacity:0,
                rotateZ:0
            },
            options:{
                duration: duration * 0.20,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.holeIn =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['50%','50%'],
            transformOriginY:['50%','50%'],
            transformOriginZ:['0','0'],
            opacity:[1,0],
            scaleX:[1,0],
            scaleY:[1,0],
            rotateY:[0,'180deg']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.holeOut =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['50%','50%'],
            transformOriginY:['50%','50%'],
            transformOriginZ:['0','0'],
            opacity:[0,1],
            scaleX:[0,1],
            scaleY:[0,1],
            rotateY:['180deg',0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.swashIn =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {
                transformOriginX:['50%','50%'],
                transformOriginY:['50%','50%'],
                transformOriginZ:['0','0'],
                scaleX:[0.9,0],
                scaleY:[0.9,0],
                opacity:[1,0]
            },
            options:{duration: duration * 0.90}
        },
        {
            properties: {
                transformOriginX:'50%',
                transformOriginY:'50%',
                transformOriginZ:'0',
                scaleX:1,
                scaleY:1,
                opacity:1
            },
            options:{
                duration: duration * 0.10,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.swashOut =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {
                transformOriginX:['50%','50%'],
                transformOriginY:['50%','50%'],
                transformOriginZ:['0','0'],
                scaleX:[0.9,1],
                scaleY:[0.9,1],
                opacity:[1,1]
            },
            options:{duration: duration * 0.90}
        },
        {
            properties: {
                transformOriginX:'50%',
                transformOriginY:'50%',
                transformOriginZ:'0',
                scaleX:1,
                scaleY:1,
                opacity:1
            },
            options:{
                duration: duration * 0.10,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.perspectiveDown =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformPerspective:[800,800],
            transformOriginX:['0%','0%'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateX:['-180deg',0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.perspectiveDownRetourn =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformPerspective:[800,800],
            transformOriginX:['0%','0%'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateX:[0,'-180deg']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.perspectiveLeft =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformPerspective:[800,800],
            transformOriginX:['0%','0%'],
            transformOriginY:['0%','0%'],
            transformOriginZ:['0','0'],
            rotateY:['-180deg',0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.perspectiveLeftRetourn =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformPerspective:[800,800],
            transformOriginX:['0%','0%'],
            transformOriginY:['0%','0%'],
            transformOriginZ:['0','0'],
            rotateY:[0,'-180deg']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.perspectiveRight =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformPerspective:[800,800],
            transformOriginX:['100%','100%'],
            transformOriginY:['0%','0%'],
            transformOriginZ:['0','0'],
            rotateY:['180deg',0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.perspectiveRightRetourn =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformPerspective:[800,800],
            transformOriginX:['100%','100%'],
            transformOriginY:['0%','0%'],
            transformOriginZ:['0','0'],
            rotateY:[0,'180deg']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.perspectiveUp =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformPerspective:[800,800],
            transformOriginX:['0%','0%'],
            transformOriginY:['0%','0%'],
            transformOriginZ:['0','0'],
            rotateX:['180deg',0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.perspectiveUpRetourn =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformPerspective:[800,800],
            transformOriginX:['0%','0%'],
            transformOriginY:['0%','0%'],
            transformOriginZ:['0','0'],
            rotateX:[0,'180deg']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.rotateDown =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['50%','0%'],
            transformOriginY:['100%','0%'],
            transformOriginZ:['0','0'],
            rotateX:['-180deg',0],
            translateZ:['300px',0],
            opacity:[0,1],
            perspective:['800','800']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.rotateLeft =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['50%','0%'],
            transformOriginY:['0%','0%'],
            transformOriginZ:['0','0'],
            rotateY:['180deg',0],
            translateZ:['300px',0],
            opacity:[0,1],
            perspective:['800','800']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.rotateRight =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['50%','0%'],
            transformOriginY:['0%','0%'],
            transformOriginZ:['0','0'],
            rotateY:['-180deg',0],
            translateZ:['150px',0],
            opacity:[0,1],
            perspective:['800','800']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.rotateUp =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['50%','0%'],
            transformOriginY:['0%','0%'],
            transformOriginZ:['0','0'],
            rotateX:['180deg',0],
            translateZ:['100px',0],
            opacity:[0,1],
            perspective:['800','800']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.slideDown =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['0%','0%'],
            transformOriginY:['0%','0%'],
            transformOriginZ:['0','0'],
            translateY:['100%',0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.slideDownRetourn =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['0%','0%'],
            transformOriginY:['0%','0%'],
            transformOriginZ:['0','0'],
            translateY:[0,'100%']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.slideLeft =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['0%','0%'],
            transformOriginY:['0%','0%'],
            transformOriginZ:['0','0'],
            translateX:['-100%',0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.slideLeftRetourn =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['0%','0%'],
            transformOriginY:['0%','0%'],
            transformOriginZ:['0','0'],
            translateX:[0,'-100%']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.slideRight =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['0%','0%'],
            transformOriginY:['0%','0%'],
            transformOriginZ:['0','0'],
            translateX:['100%',0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.slideRightRetourn =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['0%','0%'],
            transformOriginY:['0%','0%'],
            transformOriginZ:['0','0'],
            translateX:[0,'100%']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.slideUp =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['0%','0%'],
            transformOriginY:['0%','0%'],
            transformOriginZ:['0','0'],
            translateY:['-100%',0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.slideUpRetourn =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['0%','0%'],
            transformOriginY:['0%','0%'],
            transformOriginZ:['0','0'],
            translateY:[0,'-100%']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.openDownLeft =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['0%','0%'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:['-110deg','easeInOut',0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.openDownLeftRetourn =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['0%','0%'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:[0,'easeInOut','-110deg']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.openDownRight =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['100%','100%'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:['110deg','easeInOut',0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.openDownRightRetourn =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['100%','100%'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:[0,'easeInOut','110deg']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.openUpLeft =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['0%','0%'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:['110deg','easeInOut',0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.openUpLeftRetourn =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['0%','0%'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:[0,'easeInOut','110deg']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.openUpRight =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['100%','100%'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:['-110deg','easeInOut',0]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.openUpRightRetourn =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['100%','100%'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:[0,'easeInOut','-110deg']
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.openDownLeftOut =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['0%','0%'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:['-110deg','easeInOut',0],
            opacity:[0,1]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.openDownRightOut =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['100%','100%'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:['110deg','easeInOut',0],
            opacity:[0,1]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.openUpLeftOut =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['0%','0%'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:['110deg','easeInOut',0],
            opacity:[0,1]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.openUpRightOut =  function(el, options){
    var duration = options.duration || 1000;

    jQuery.velocity.animate(
        el,
        {
            transformOriginX:['100%','100%'],
            transformOriginY:['100%','100%'],
            transformOriginZ:['0','0'],
            rotateZ:['-110deg','easeInOut',0],
            opacity:[0,1]
        },
        {
            duration: duration,
            complete:options.complete || null
        }
    );
};
jQuery.velocity.Sequences.tinDownIn =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {
                opacity:[1,0],
                scaleX:[1.1,1],
                scaleY:[1.1,1],
                translateY:[0,'900%']
            },
            options:{duration: duration * 0.50}
        },
        {
            properties: {
                scaleX:1,
                scaleY:1
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                scaleX:1.1,
                scaleY:1.1
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                scaleX:1,
                scaleY:1
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                scaleX:1.1,
                scaleY:1.1
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                scaleX:1,
                scaleY:1
            },
            options:{
                duration: duration * 0.10,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.tinDownOut =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {
                opacity:[1,1],
                scaleX:[1.1,1],
                scaleY:[1.1,1],
                translateY:[0,0]
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:1,
                scaleX:1,
                scaleY:1,
                translateY:0
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:1,
                scaleX:1.1,
                scaleY:1.1,
                translateY:0
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:1,
                scaleX:1,
                scaleY:1,
                translateY:0
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:1,
                scaleX:1,
                scaleY:1,
                translateY:0
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:0,
                scaleX:1,
                scaleY:1,
                translateY:'900%'
            },
            options:{
                duration: duration * 0.50,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.tinLeftIn =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {
                opacity:[1,0],
                scaleX:[1.1,1],
                scaleY:[1.1,1],
                translateX:[0,'-900%']
            },
            options:{duration: duration * 0.50}
        },
        {
            properties: {
                scaleX:1,
                scaleY:1
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                scaleX:1.1,
                scaleY:1.1
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                scaleX:1,
                scaleY:1
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                scaleX:1.1,
                scaleY:1.1
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                scaleX:1,
                scaleY:1
            },
            options:{
                duration: duration * 0.10,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.tinLeftOut =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {
                opacity:[1,1],
                scaleX:[1.1,1],
                scaleY:[1.1,1],
                translateX:[0,0]
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:1,
                scaleX:1,
                scaleY:1,
                translateX:0
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:1,
                scaleX:1.1,
                scaleY:1.1,
                translateX:0
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:1,
                scaleX:1,
                scaleY:1,
                translateX:0
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:1,
                scaleX:1,
                scaleY:1,
                translateX:0
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:0,
                scaleX:1,
                scaleY:1,
                translateX:'-900%'
            },
            options:{
                duration: duration * 0.50,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.tinRightIn =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {
                opacity:[1,0],
                scaleX:[1.1,1],
                scaleY:[1.1,1],
                translateX:[0,'900%']
            },
            options:{duration: duration * 0.50}
        },
        {
            properties: {
                scaleX:1,
                scaleY:1
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                scaleX:1.1,
                scaleY:1.1
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                scaleX:1,
                scaleY:1
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                scaleX:1.1,
                scaleY:1.1
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                scaleX:1,
                scaleY:1
            },
            options:{
                duration: duration * 0.10,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.tinRightOut =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {
                opacity:[1,1],
                scaleX:[1.1,1],
                scaleY:[1.1,1],
                translateX:[0,0]
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:1,
                scaleX:1,
                scaleY:1,
                translateX:0
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:1,
                scaleX:1.1,
                scaleY:1.1,
                translateX:0
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:1,
                scaleX:1,
                scaleY:1,
                translateX:0
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:1,
                scaleX:1,
                scaleY:1,
                translateX:0
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:0,
                scaleX:1,
                scaleY:1,
                translateX:'900%'
            },
            options:{
                duration: duration * 0.50,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.tinUpIn =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {
                opacity:[1,0],
                scaleX:[1.1,1],
                scaleY:[1.1,1],
                translateY:[0,'-900%']
            },
            options:{duration: duration * 0.50}
        },
        {
            properties: {
                scaleX:1,
                scaleY:1
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                scaleX:1.1,
                scaleY:1.1
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                scaleX:1,
                scaleY:1
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                scaleX:1.1,
                scaleY:1.1
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                scaleX:1,
                scaleY:1
            },
            options:{
                duration: duration * 0.10,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
jQuery.velocity.Sequences.tinUpOut =  function(el, options){
    var duration = options.duration || 1000;

    var calls = [
        {
            properties: {
                opacity:[1,1],
                scaleX:[1.1,1],
                scaleY:[1.1,1],
                translateY:[0,0]
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:1,
                scaleX:1,
                scaleY:1,
                translateY:0
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:1,
                scaleX:1.1,
                scaleY:1.1,
                translateY:0
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:1,
                scaleX:1,
                scaleY:1,
                translateY:0
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:1,
                scaleX:1,
                scaleY:1,
                translateY:0
            },
            options:{duration: duration * 0.10}
        },
        {
            properties: {
                opacity:0,
                scaleX:1,
                scaleY:1,
                translateY:'-900%'
            },
            options:{
                duration: duration * 0.50,
                complete:options.complete || null
            }
        }
    ];

    jQuery.each(calls, function(i, call) {
        jQuery.velocity.animate(
            el,
            call.properties,
            call.options
        );
    });
};
