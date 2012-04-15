var letter = {c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11};
var convert_pitch = function(pitch){
    return 12 + 12 * (pitch[1] - '0') + letter[pitch[0]];
};
var copy_note = function(note){
    return {tag: note.tag, pitch: note.pitch, time: note.time, dur: note.dur}
};
var true_compile = function(time, expr){
    var l, r;
    if(expr.tag == 'note'){
        return {
            expr: [{tag: 'note', pitch: convert_pitch(expr.pitch), time: time, dur: expr.dur}], 
            dur: expr.dur
        };
    }else if(expr.tag == 'rest'){
        return {
            expr: [],
            dur: expr.dur
        };
    }else if(expr.tag == 'repeat'){
        var newexpr = [];
        var newdur = 0;
        var ret = true_compile(time, expr.section);
        for(var i = 0; i < expr.count; i++){
            ret.expr.forEach(function(x){
                newexpr.push(copy_note(x));
                x.time += ret.dur;
            });
        }
        return {
            expr: newexpr,
            dur: ret.dur * expr.count
        };
    }else if(expr.tag == 'par'){
        l = true_compile(time, expr.left);
        r = true_compile(time, expr.right);
        return {
            expr: l.expr.concat(r.expr),
            dur: Math.max(l.dur, r.dur)
        };
    }else if(expr.tag == 'seq'){
        l = true_compile(time, expr.left);
        r = true_compile(time + l.dur, expr.right);
        return {
            expr: l.expr.concat(r.expr),
            dur: l.dur + r.dur
        };
    }
};
var compile = function(expr){
    return true_compile(0, expr).expr;
};
var melody_mus = { 
    tag: 'par',
    left: {
        tag: 'repeat',
        section: {
            tag: 'seq',
            left: { tag: 'note', pitch: 'a4', dur: 250 },
            right: { 
                tag: 'seq',
                left: {tag: 'note', pitch: 'b4', dur: 250},
                right: {tag: 'rest', dur: 100}
            } 
        }, 
        count: 3
    },
    right:{ 
        tag: 'seq',
        left: { tag: 'note', pitch: 'c4', dur: 500 },
        right: { tag: 'note', pitch: 'd4', dur: 500 }
    }
};
console.log(melody_mus);
console.log(compile(melody_mus));

