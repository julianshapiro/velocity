var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
function nn(C) {
    return new Proxy(C, {
        apply: function (t, _, a) {
            var _a;
            return new ((_a = t).bind.apply(_a, __spreadArrays([void 0], a)))();
        }
    });
}
var $A = /** @class */ (function () {
    function $A() {
        this.x = 10;
        // console.log('XXX', (this.constructor as any as $c).$c == $A.$c)
        // console.log('YYY', this.constructor == $A);
        // this.constructor = (this.constructor as any as $c).$c || this.constructor;
        // Object.defineProperty(this, 'constructor', { value: (this.constructor as any as $c).$c || this.constructor });
        Object.defineProperty(this, 'constructor', { value: this.constructor.$c });
    }
    $A.prototype.a = function () {
        return this.x += 1;
    };
    $A.$c = A;
    return $A;
}());
var A = nn($A);
$A.$c = A;
Object.defineProperty(A, 'name', { value: 'A' });
var $B = /** @class */ (function (_super) {
    __extends($B, _super);
    function $B() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    $B.prototype.a = function () {
        return this.x += 2;
    };
    $B.$c = B;
    return $B;
}($A));
var B = nn($B);
$B.$c = B;
Object.defineProperty(B, 'name', { value: 'B' });
var o = {
    'new A()': new A(),
    'A()': A(),
    'new B()': new B(),
    'B()': B()
};
console.log('$A.name:', $A.name);
console.log('A.name:', A.name);
console.log('$B.name:', $B.name);
console.log('B.name:', B.name);
for (var k in o) {
    var x = o[k];
    console.log("---\nx = " + k);
    console.log('console.log(x):      ', x);
    console.log('x instanceof A:      ', x instanceof A);
    console.log('x instanceof $A:     ', x instanceof $A);
    console.log('x instanceof B:      ', x instanceof B);
    console.log('x instanceof $B:     ', x instanceof $B);
    console.log('x instanceof Proxy:  ', x instanceof Proxy);
    console.log('x.constructor.name:  ', x.constructor.name);
    console.log('x.constructor == A:  ', x.constructor == A);
    console.log('x.constructor == $A: ', x.constructor == $A);
    console.log('x.constructor == B:  ', x.constructor == B);
    console.log('x.constructor == $B: ', x.constructor == $B);
    console.log('x.hasOwnProperty(\'constructor\'): ', x.hasOwnProperty('constructor'));
    console.log('x.propertyIsEnumerable(\'constructor\'): ', x.propertyIsEnumerable('constructor'));
    console.log('x.a():', x.a());
    console.log('x.a():', x.a());
    console.log('x.a():', x.a());
}
