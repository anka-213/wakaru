import { findModuleFromSource } from '../../utils/import'
import { removeDeclarationIfUnused, removeDefaultImportIfUnused } from '../../utils/scope'
import wrap from '../../wrapAstTransformation'
import { isHelperFunctionCall } from './isHelperFunctionCall'
import type { ASTTransformation } from '../../wrapAstTransformation'
import type { Identifier } from '@babel/types'
import type { ArrayExpression, ImportDefaultSpecifier } from 'jscodeshift'

/**
 * `@babel/runtime/helpers/arrayWithoutHoles` helper.
 *
 * Replace `empty slot` with `undefined` in ArrayExpression.
 *
 * We can further optimize this by detecting if we are wrapped by `toConsumableArray`
 * and skip the replacement as spread operator will handle `empty` correctly.
 */
export const transformAST: ASTTransformation = (context) => {
    const { root, j } = context

    const moduleName = '@babel/runtime/helpers/arrayWithoutHoles'
    const moduleEsmName = '@babel/runtime/helpers/esm/arrayWithoutHoles'
    const moduleSource = findModuleFromSource(j, root, moduleName) || findModuleFromSource(j, root, moduleEsmName)

    if (moduleSource) {
        const isImport = j.ImportDeclaration.check(moduleSource)
        const moduleVariableName = isImport
            ? ((moduleSource.specifiers![0] as ImportDefaultSpecifier).local as Identifier).name
            : (moduleSource.id as Identifier).name

        // arrayWithoutHoles([...])
        // arrayWithoutHoles.default([...])
        // (0, arrayWithoutHoles)([...])
        // (0, arrayWithoutHoles.default)([...])
        root
            .find(j.CallExpression)
            .filter((path) => {
                return isHelperFunctionCall(j, path.node, moduleVariableName)
                && path.node.arguments.length === 1
                && j.ArrayExpression.check(path.node.arguments[0])
            })
            .forEach((path) => {
                const arr = path.node.arguments[0] as ArrayExpression
                const elements = arr.elements.map(element => element ?? j.identifier('undefined'))
                path.replace(j.arrayExpression(elements))

                isImport
                    ? removeDefaultImportIfUnused(j, root, moduleVariableName)
                    : removeDeclarationIfUnused(j, path, moduleVariableName)
            })
    }
}

export default wrap(transformAST)
