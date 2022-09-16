.PHONY = docs

docs: pugdoc jsdoc

pugdoc:
	@pug-doc k-scaffold/**/*.pug --output docs/data/_pugdoc.json

jsdoc:
	@jsdoc -r -X k-scaffold > ./docs/data/jsdoc-ast.json