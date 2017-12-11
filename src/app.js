import {EditorState} from "prosemirror-state";
import {EditorView} from "prosemirror-view";
import {undo, redo, history} from "prosemirror-history";
import {keymap} from "prosemirror-keymap";
import {baseKeymap} from "prosemirror-commands";
import {DOMParser} from "prosemirror-model";

import {Schema} from "prosemirror-model"

const schema = new Schema({
	nodes: {
		text: {
			group: "inline"
		},
		doc: {
			content: "block+"
		},
		paragraph: {
			group: "block",
			content: "inline*",
			toDOM() {
				return ["p", {'style': 'color:red;'}, 0]
			},
			parseDOM: [{tag: "p"}]
		},
		boring_paragraph: {
			group: "block",
			content: "text*",
			marks: "",
			toDOM() {
				return ["p", {'class': "boring"}, 0]
			},
			parseDOM: [{tag: "p.boring", priority: 60}]
		}
	},
	marks: {
		shouting: {
			toDOM() { return ["shouting"] },
			parseDOM: [{tag: "shouting"}]
		},
		link: {
			attrs: {href: {}},
			toDOM(node) { return ["a", {href: node.attrs.href}] },
			parseDOM: [{tag: "a", getAttrs(dom) { return {href: dom.href} }}],
			inclusive: false
		}
	}
});

let content = document.getElementById("content");

let state = EditorState.create({
	doc: DOMParser.fromSchema(schema).parse(content),
	plugins: [
		history(),
		keymap({"Mod-z": undo, "Mod-y": redo}),
		keymap(baseKeymap)
	]
});
let view = new EditorView(document.body, {
	state: state,
	dispatchTransaction(transaction) {
		console.log("Document size went from", transaction.before.content.size,
			"to", transaction.doc.content.size)
		let newState = view.state.apply(transaction)
		view.updateState(newState)
	}
});