var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('scheem.peg', 'utf-8');
// Show the PEG grammar file
console.log(data);
// Create my parser
var parse = PEG.buildParser(data).parse;
// basic test
assert.deepEqual( parse("(a b c)"), ["a", "b", "c"] );
assert.deepEqual( parse("(a b (c d e))"), ["a", "b", ["c", "d", "e"]] );
assert.deepEqual( parse("()"), [] );
assert.deepEqual( parse("(Hello World)"), ["Hello", "World"] );
assert.deepEqual( parse("(((1 2) (3 4)) ((5 6) (7 8)))"), [[["1", "2"], ["3", "4"]], [["5", "6"], ["7", "8"]]] );
assert.deepEqual( parse("(((((((11 22) 33) 44) 55) 66) 77) 88)"), [[[[[[["11", "22"], "33"], "44"], "55"], "66"], "77"], "88"] );
assert.deepEqual( parse("(11 (22 (33 (44 (55 (66 (77 88)))))))"), ["11", ["22", ["33", ["44", ["55", ["66", ["77", "88"]]]]]]] );

// whitespace test
assert.deepEqual( parse(" ( a  b  c ( 1  2 (3 4) )) "), ["a", "b", "c", ["1", "2", ["3", "4"]]] );
assert.deepEqual( parse("(define factorial\n" +
"\t(lambda (n)\n" +
"\t\t(if (= n 0) 1\n" +
"\t\t\t(* n (factorial (- n 1))))))\n"), ["define", "factorial", ["lambda", ["n"], ["if", ["=", "n", "0"], "1", ["*", "n", ["factorial", ["-", "n", "1"]]]]]] );

// quote test
assert.deepEqual( parse(" '(a ) "), ["quote", ["a"]] );
assert.deepEqual( parse(" '''''( old     post )"), ["quote", ["quote", ["quote", ["quote", ["quote", ["old", "post"]]]]]] );
assert.deepEqual( parse(" (some '( 'inside some '(.) ) ) "), ["some", ["quote", [["quote", "inside"], "some", ["quote", ["."]]]]] );

// comment test

assert.deepEqual( parse("" +
";; Defining factorial function with recursive;\n" +
";; Using Scheme syntax!\n" +
"(define factorial\n" +
";; Defining a lambda function\n" +
"\t(lambda (n)\n" +
";; If we're at the end, return 1\n" +
"\t\t(if (= n 0) 1\n" +
";; Else, just recursively calculate the factorial.\n" +
"\t\t\t(* n (factorial (- n 1))))))\n" +
""), ["define", "factorial", ["lambda", ["n"], ["if", ["=", "n", "0"], "1", ["*", "n", ["factorial", ["-", "n", "1"]]]]]] );
