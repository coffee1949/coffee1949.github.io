import {nodeResolve} from "@rollup/plugin-node-resolve";
//import babel from '@rolluprollup-plugin-babel' // rollup 的 babel 插件，ES6转ES5
import commonjs from '@rollup/plugin-commonjs' // 将非ES6语法的包转为ES6可用
import {uglify} from 'rollup-plugin-uglify' // 压缩包

export default {
    input: 'index.js',
    output: [
        { file: 'dist/build/index.js', format: 'esm', name: 'index'}
        // { file: 'dist/index.umd.js', format: 'umd', name: 'index' },
        // { file: 'dist/index.common.js', format: 'cjs', name: 'index' }
    ],
    plugins:[
        commonjs(),
        nodeResolve(),
        uglify()
    ]
}