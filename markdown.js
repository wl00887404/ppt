const fs = require('fs')
const hljs = require('highlight.js')
const md = require('markdown-it')({
	html: true,
	linkify: true,
	highlight: (str, lang) => {
		if (lang && hljs.getLanguage(lang)) {
			try {
				const { value } = hljs.highlight(lang, str, true)
				const lineNumbers = range(0, value.split('\n').length - 1)
					.map(x => x + 1)
					.map(l => `<span>${l}</span>`)
					.join('')
				return `<pre><code class="hljs"><div class="num">${
					lineNumbers
				}</div><div class="code">${value}</div></code></pre>`
			} catch (__) {}
		}
		return ''
	}
})

const range = (min, max) => (max > min ? [min, ...range(min + 1, max)] : [])

const target = process.argv[2]
if (!target) {
	throw new Error('there is no target argv')
}

const setting = JSON.parse(
	fs.readFileSync(`./${target}/setting.json`, { encoding: 'utf-8' })
)
const { template } = setting
const templateRaw = fs.readFileSync(
	`./template/${template || 'default'}.html`,
	{ encoding: 'utf-8' }
)
const slidesRaw = fs.readFileSync(`./${target}/slides.md`, {
	encoding: 'utf-8'
})

class Box {
	constructor(x) {
		this.x = x
	}
	map(f) {
		return new Box(f(this.x))
	}
	fold(f) {
		return f(this.x)
	}
}

Box.of = x => new Box(x)

const cropChapter = x => {
	return x
		.split(/<p>(?:\{\{\{|\}\}\})<\/p>/)
		.map(x => x.trim())
		.filter(x => x != '')
		.map(cropSlide)
		.map(x => `<section>${x}</section>`)
		.join('')
}

const cropSlide = xs => {
	return xs
		.split(/<hr>/)
		.map(x => x.trim())
		.map(x => `<section>${x}</section>`)
		.join('')
}

const fillInTemplate = (template = '', argsObj = {}) => {
	const match = template.match(/\$\{[^\}]+\}/)
	if (match == null) {
		return template
	} else {
		const { index } = match
		const arg = match[0]
			.slice(2)
			.slice(0, -1)
			.trim()
		return (
			template.slice(0, index) +
			argsObj[arg] +
			fillInTemplate(template.slice(index + match[0].length), argsObj)
		)
	}
}

const html = Box.of(slidesRaw)
	.map(x => md.render(x))
	.map(cropChapter)
	.map(slides => Object.assign({}, setting, { slides }))
	.fold(argsObj => fillInTemplate(templateRaw, argsObj))
fs.writeFileSync(`${target}/index.html`, html)
