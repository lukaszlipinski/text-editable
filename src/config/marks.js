// :: Object [Specs](#model.MarkSpec) for the marks in the schema.
const marks = {
    // :: MarkSpec A link. Has `href` and `title` attributes. `title`
    // defaults to the empty string. Rendered and parsed as an `<a>`
    // element.
    link: {
        attrs: {
            href: {},
            title: {default: null}
        },
        inclusive: false,
        parseDOM: [{tag: "a[href]", getAttrs(dom) {
            return {href: dom.getAttribute("href"), title: dom.getAttribute("title")}
        }}],
        toDOM(node) { return ["a", node.attrs] }
    },

    // :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
    // Has parse rules that also match `<i>` and `font-style: italic`.
    em: {
        parseDOM: [{tag: "i"}, {tag: "em"}, {style: "font-style=italic"}],
        toDOM() { return ["em"] }
    },

    // :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
    // also match `<b>` and `font-weight: bold`.
    strong: {
        parseDOM: [
            {tag: "strong"},
            // This works around a Google Docs misbehavior where
            // pasted content will be inexplicably wrapped in `<b>`
            // tags with a font-weight normal.
            {tag: "b", getAttrs: node => node.style.fontWeight != "normal" && null},
            {style: "font-weight", getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null}],
        toDOM() { return ["strong"] }
    },

    // :: MarkSpec Code font mark. Represented as a `<code>` element.
    code: {
        parseDOM: [{tag: "code"}],
        toDOM() { return ["code"] }
    },

    /*noStyles: {
        attrs: {
            style: {
                default: ''
            }
        },
        parseDOM: [
            {tag: "span", skip:true, contentElement: function(node) {
                return node.style !== null;
            }},
        ],
        toDOM(node) {
            return ["span", node.attrs];
        }
    },*/

    customStyles: {
        attrs: {
            style: {
                default: ''
            }
        },
        /*parseDOM: [
            {tag: "span"}
        ],*/
        toDOM(node) {
            console.log("node", node, this);
            return ["span", {style: 'color:red'}];
        }
    },
    customStyles2: {
        attrs: {
            style: {
                default: ''
            }
        },
        /*parseDOM: [
            {tag: "span"}
        ],*/
        toDOM(node) {
            console.log("node", node, this);
            return ["span", {style: 'font-size:24px'}];
        }
    }
};

export default marks;