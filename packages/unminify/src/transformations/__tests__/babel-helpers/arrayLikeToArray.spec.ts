import transform from '../../babel-helpers/arrayLikeToArray'
import { defineInlineTest } from '../test-utils'

const inlineTest = defineInlineTest(transform)

inlineTest('arrayLikeToArray',
  `
var _arrayLikeToArray = require("@babel/runtime/helpers/arrayLikeToArray");

_arrayLikeToArray([1,,3]);
_arrayLikeToArray.default([1,,3]);
(0, _arrayLikeToArray)([1,,3]);
(0, _arrayLikeToArray.default)([1,,3]);
`,
  `
[1, undefined, 3];
[1, undefined, 3];
[1, undefined, 3];
[1, undefined, 3];
`,
)

inlineTest('arrayLikeToArray - esm',
  `
import _arrayLikeToArray from "@babel/runtime/helpers/esm/arrayLikeToArray";

_arrayLikeToArray([1,,3]);
_arrayLikeToArray.default([1,,3]);
(0, _arrayLikeToArray)([1,,3]);
(0, _arrayLikeToArray.default)([1,,3]);
`,
  `
[1, undefined, 3];
[1, undefined, 3];
[1, undefined, 3];
[1, undefined, 3];
`,
)