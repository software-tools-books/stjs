import assert from 'assert'

import { TextNode, TagNode } from '../micro-dom.js'
import parse from '../parse.js'

describe('parses HTML', () => {
  it('parses a single tag', async () => {
    const text = '<a></a>'
    const actual = parse(text)
    const expected = new TagNode('a', {})
    assert.deepStrictEqual(actual, expected)
  })

  it('parses a tag with attributes', async () => {
    const text = '<a k1="v1" k2="v2"></a>'
    const actual = parse(text)
    const expected = new TagNode('a', { k1: 'v1', k2: 'v2' })
    assert.deepStrictEqual(actual, expected)
  })

  it('parses nodes containing text', async () => {
    const text = '<a> contents </a>'
    const actual = parse(text)
    const expected = new TagNode('a', {}, new TextNode(' contents '))
    assert.deepStrictEqual(actual, expected)
  })

  it('parses nested nodes', async () => {
    const text = '<a><b1></b1><b2><c></c></b2></a>'
    const actual = parse(text)
    const expected = new TagNode('a', {},
      new TagNode('b1', {}),
      new TagNode('b2', {},
        new TagNode('c', {})
      )
    )
    assert.deepStrictEqual(actual, expected)
  })

  it('complains about unclosed tags', async () => {
    const text = '<a</a>'
    assert.throws(() => parse(text),
      Error,
      'Expected error for unclosed tag')
  })

  it('complains about mismatched tags', async () => {
    const text = '<a><b></a>'
    assert.throws(() => parse(text),
      Error,
      'Expected error for mismatched tag')
  })

  it('complains about dangling nodes', async () => {
    const text = '<a></a><b></b>'
    assert.throws(() => parse(text),
      Error,
      'Expected error for dangling tags')
  })
})