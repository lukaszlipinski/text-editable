// :: Object
// [Specs](#model.NodeSpec) for the nodes defined in this schema.
const nodes = {
    // :: NodeSpec The top level document node.
    doc: {
        content: "block+"
    },

    // :: NodeSpec A plain paragraph textblock. Represented in the DOM
    // as a `<p>` element.
    paragraph: {
        content: "inline*",
        group: "block",
        parseDOM: [{tag: "p"}],
        toDOM() { return ["p", 0] }
    },

    // :: NodeSpec A blockquote (`<blockquote>`) wrapping one or more blocks.
    blockquote: {
        content: "block+",
        group: "block",
        defining: true,
        parseDOM: [{tag: "blockquote"}],
        toDOM() { return ["blockquote", 0] }
    },

    // :: NodeSpec A horizontal rule (`<hr>`).
    horizontal_rule: {
        group: "block",
        parseDOM: [{tag: "hr"}],
        toDOM() { return ["hr"]; }
    },

    // :: NodeSpec A heading textblock, with a `level` attribute that
    // should hold the number 1 to 6. Parsed and serialized as `<h1>` to
    // `<h6>` elements.
    heading: {
        attrs: {level: {default: 1}},
        content: "inline*",
        group: "block",
        defining: true,
        parseDOM: [
            {tag: "h1", attrs: {level: 1}},
            {tag: "h2", attrs: {level: 2}},
            {tag: "h3", attrs: {level: 3}},
            {tag: "h4", attrs: {level: 4}},
            {tag: "h5", attrs: {level: 5}},
            {tag: "h6", attrs: {level: 6}}],
        toDOM(node) {
            return ["h" + node.attrs.level, 0];
        }
    },

    // :: NodeSpec A code listing. Disallows marks or non-text inline
    // nodes by default. Represented as a `<pre>` element with a
    // `<code>` element inside of it.
    code_block: {
        content: "text*",
        marks: "",
        group: "block",
        code: true,
        defining: true,
        parseDOM: [
            {tag: "pre", preserveWhitespace: "full"}
        ],
        toDOM() {
            return ["pre", ["code", 0]];
        }
    },

    // :: NodeSpec The text node.
    text: {
        group: "inline"
    },

    // :: NodeSpec An inline image (`<img>`) node. Supports `src`,
    // `alt`, and `href` attributes. The latter two default to the empty
    // string.
    image: {
        inline: true,
        attrs: {
            src: {},
            alt: {default: null},
            title: {default: null}
        },
        group: "inline",
        draggable: true,
        parseDOM: [{tag: "img[src]", getAttrs(dom) {
            return {
                src: dom.getAttribute("src"),
                title: dom.getAttribute("title"),
                alt: dom.getAttribute("alt")
            }
        }}],
        toDOM(node) { return ["img", node.attrs] }
    },

    // :: NodeSpec A hard line break, represented in the DOM as `<br>`.
    hard_break: {
        inline: true,
        group: "inline",
        selectable: false,
        parseDOM: [{tag: "br"}],
        toDOM() { return ["br"] }
    },
    allow_spans_with_style: {
        attrs: {
            style: {default: null}
        },
        content: "inline*",
        group: "block",
        parseDOM: [{tag: "span", getAttrs(dom) {
            return {
                style: dom.getAttribute("style")
            }
        }}],
        toDOM(el) {
            return ["span", el.attrs, 0];
        }
    },
};

export default nodes;