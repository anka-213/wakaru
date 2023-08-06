import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { unpack } from '../src'

describe('Webpack 4', () => {
    it('testcases/webpack4', async () => {
        const source = await readFile('../../testcases/webpack4/dist/index.js', 'utf8')
        const result = unpack(source)
        if (!result) throw new Error('Failed to unpack')

        expect(result.modules.size).toBe(52)

        const modules = [...result.modules.values()]
            .map(({ id, isEntry, code }) => ({ id, isEntry, code }))
        expect(modules).toMatchSnapshot()
    })
})
