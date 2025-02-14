import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeExternalLinks from 'rehype-external-links'
import { escapeSvelte } from 'mdsvex'
import { lex, parse as parseFence } from 'fenceparser'
import { renderCodeToHTML, runTwoSlash, createShikiHighlighter } from 'shiki-twoslash'
import { statSync } from 'fs'
import { parse, join } from 'path'
import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import Slugger from 'github-slugger'

const remarkUraraFm =
  () =>
  (tree, { data, filename }) => {
    const filepath = filename.split('/src/routes')[1]
    let { dir, name } = parse(filepath)
    if (!data.fm) data.fm = {}
    data.fm.slug = filepath
    data.fm.path = join(dir, `/${name}`.replace('/index', '').replace('.svelte', ''))
    if (data.fm?.toc !== false) {
      let [slugs, toc] = [new Slugger(), []]
      visit(tree, 'heading', node => {
        toc.push({
          depth: node.depth,
          title: toString(node),
          slug: slugs.slug(toString(node))
        })
      })
      data.fm.toc = toc
    }
    if (!data.fm.date || !data.fm.lastmod) {
      const { ctime, mtime } = statSync(new URL(`./urara${filepath}`, import.meta.url))
      if (!data.fm.date) data.fm.date = ctime
      if (!data.fm.lastmod) data.fm.lastmod = mtime
    }
  }

const remarkUraraSpoiler = () => tree =>
  visit(tree, 'paragraph', node => {
    const { children } = node
    const text = children[0].value
    const re = /\|\|(.{1,}?)\|\|/g
    if (re.test(children[0].value)) {
      children[0].type = 'html'
      children[0].value = text.replace(re, (_match, p1) => `<span class="spoiler">${p1}</span>`)
    }
    return node
  })

/** @type {Parameters<typeof import("mdsvex").mdsvex>[0]} */
export const mdsvexConfig = {
  extensions: ['.svelte.md', '.md'],
  smartypants: {
    dashes: 'oldschool'
  },
  layout: {
    _flex: './src/lib/components/layout_flex.svelte',
    _card: './src/lib/components/layout_card.svelte',
    _: './src/lib/components/layout_post.svelte'
  },
  highlight: {
    highlighter: async (code, lang, meta) => {
      let fence, twoslash
      try { fence = parseFence(lex([lang, meta].filter(Boolean).join(' '))) }
      catch (error) { throw new Error(`Could not parse the codefence for this code sample \n${code}`) }
      if (fence?.twoslash === true) twoslash = runTwoSlash(code, lang)
      return `{@html \`${escapeSvelte(renderCodeToHTML(code, lang, fence ?? {}, {}, await createShikiHighlighter({ theme: 'material-default' }), twoslash))}\` }`
    }
  },
  remarkPlugins: [remarkUraraFm, remarkUraraSpoiler],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    [
      rehypeExternalLinks,
      {
        rel: ['nofollow', 'noopener', 'noreferrer', 'external'],
        target: '_blank'
      }
    ]
  ]
}
