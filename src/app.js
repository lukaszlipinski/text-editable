import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema} from "prosemirror-model"
import {DOMParser} from "prosemirror-model";

import {addListNodes} from "./schema-list";
import {exampleSetup} from "./example-setup/index";

import nodes from 'config/nodes';
import marks from 'config/marks';

// :: Schema
// This schema rougly corresponds to the document schema used by
// [CommonMark](http://commonmark.org/), minus the list elements,
// which are defined in the [`prosemirror-schema-list`](#schema-list)
// module.
//
// To reuse elements from this schema, extend or read from its
// `spec.nodes` and `spec.marks` [properties](#model.Schema.spec).
const schema = new Schema({nodes, marks});


// code{
// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
    var mySchema = new Schema({
        nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
        marks: schema.spec.marks
    });

    window.view = new EditorView(document.querySelector("#editor"), {
        state: EditorState.create({
            doc: DOMParser.fromSchema(mySchema).parse(document.querySelector("#content")),
            plugins: exampleSetup({
                schema: mySchema
            })
        })
    });
// }