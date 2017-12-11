import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"

import {Schema} from "prosemirror-model"
import {DOMParser} from "prosemirror-model";

import $ from 'jquery';

$('.toolbar').on('click', '[data-action]', function(e) {
	const $target = $(e.currentTarget);
	const action = $target.data('action');

	console.log(action);

});

const schema = new Schema({
	nodes: {
		doc: {
			content: "block+"
		},
		text: {
			group: "inline"
		},
		paragraph: {
			group: "block",
			content: "inline*",
			toDOM() {
				return ["p", {'style': 'color:red;'}, 0]
			},
			parseDOM: [{tag: "p"}]
		}
	},
	marks : {
		// :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
		// also match `<b>` and `font-weight: bold`.
		strong: {
			parseDOM: [
				{tag: "strong"},
				// This works around a Google Docs misbehavior where
				// pasted content will be inexplicably wrapped in `<b>`
				// tags with a font-weight normal.
				{tag: "b", getAttrs: node => node.style.fontWeight != "normal" && null},
				{style: "font-weight", getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null}
			],
			toDOM() { return ["strong"] }
		}

	}
});

//Plugin

class MenuView {
	constructor(items, editorView) {
		this.items = items;
		this.editorView = editorView;

		this.dom = document.createElement("div");
		this.dom.className = "menubar";
		items.forEach(({dom}) => this.dom.appendChild(dom));
		this.update();

		this.dom.addEventListener("mousedown", e => {
			e.preventDefault();
			editorView.focus();
			items.forEach(({command, dom}) => {
				if (dom.contains(e.target))
					command(editorView.state, editorView.dispatch, editorView)
			})
		})
	}

	update() {
		this.items.forEach(({command, dom}) => {
			let active = command(this.editorView.state, null, this.editorView)
			dom.style.display = active ? "" : "none"
		})
	}

	destroy() { this.dom.remove() }
}

function icon(text, name) {
	let span = document.createElement("span")
	span.className = "menuicon " + name
	span.title = name
	span.textContent = text
	return span
}

const {Plugin} = require("prosemirror-state")
function menuPlugin(items) {
	return new Plugin({
		view(editorView) {
			let menuView = new MenuView(items, editorView)
			editorView.dom.parentNode.insertBefore(menuView.dom, editorView.dom)
			return menuView
		}
	})
}

const {toggleMark} = require("prosemirror-commands");
let menu = menuPlugin([
	{command: toggleMark(schema.marks.strong), dom: icon("B", "strong")}
]);

//Plugin

let content = document.getElementById("content");

let state = EditorState.create({
	doc: DOMParser.fromSchema(schema).parse(content),
	plugins: [
		menu
	]
});
let view = new EditorView(document.getElementById('editor'), {
	state: state
});