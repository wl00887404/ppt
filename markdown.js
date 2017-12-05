const fs = require('fs')
const hljs = require('highlight.js')
const md = require('markdown-it')({
	html: true,
	linkify: true,
	highlight: (str, lang) => {
		if (lang && hljs.getLanguage(lang)) {
			try {
				   return `<pre><code class="hljs">${hljs.highlight(lang, str, true).value}</code></pre>`;
			} catch (__) {}
		}
		return ''
	}
})

const target = process.argv[2]
if(!target){
	throw new Error("thee is no target argv")
}
const setting = JSON.parse(
	fs.readFileSync(`./${target}/setting.json`, { encoding: 'utf-8' })
)
const template = fs.readFileSync('./template/index.html', { encoding: 'utf-8' })
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
		.split(/<p>&lt;&lt;&lt;<\/p>/)
		.map(x => x.trim())
		.filter(x => x != '')
		.map(x => `<section>${x}</section>`)
		.join('')
}

const cropSlide = x => {
	return x
		.split(/<p>&lt;--<\/p>/)
		.map(x => x.trim())
		.map(x => {
			if (x != '<section>' && x != '</section>') {
				return `<section>${x}</section>`
			} else {
				return x
			}
		})
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
	.map(cropSlide)
	.map(slides => Object.assign({}, setting, { slides }))
	.fold(argsObj => fillInTemplate(template, argsObj))

fs.writeFileSync(`${target}/index.html`, html)
