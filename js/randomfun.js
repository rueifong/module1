function linspace(a, b, n) {
    if (n < 2) {
        return n === 1 ? [a] : []
    }
    var i, ret = Array(n)
    n--
    for (i = n; i >= 0; i--) {
      ret[i] = (i * b + (n - i) * a) / n
    }
    return ret
}

function range(start, step, end) {
    var x = [];
    while (step > 0 ? end >= start : end <= start) {
        x.push(start);
        start += step;
    }
    return x;
}

function factorial(k) {
    if (k < 2) {
        return 1;
    }
    else {
        return k * factorial(k - 1);
    }
}

function N(x, mean = 0, std = 1) {
    var x = (x - mean) / std;
    var t = 1 / (1 + .2315419 * Math.abs(x));
    var d =.3989423 * Math.exp( -x * x / 2);
    var prob = d * t * (.3193815 + t * ( -.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if ( x > 0 ) {prob = 1 - prob;}
    return prob;
}

function normalPDF(x, mu = 0, sigma = 1) {
    if (sigma == 0) {
        return 0;
    }
    else {
        return Math.exp(-1 * Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2))) / (sigma * Math.sqrt(2 * Math.PI));
    }
}

function Array2DVar(x,y) {
    a = new Array(x);
    for (var i = 0; i < x; i++) {
        a[i] = new Array(y);
    }
    return a; 
}

function getRandom(p) {
    var num = Math.random();
    if (num < p) {    //probability p
        return 1;
    }  
    else {
        return -1;
    }  
}

function A(u, k, p, n) {
    return Math.pow((1 + (Math.pow(u, k) - 1) * p), n);
}

function C(n ,m) {
    return factorial(n) / (factorial(m) * factorial(n - m))
}