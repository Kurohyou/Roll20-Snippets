.PHONY = docs

docs: pugdoc jsdoc

pugdoc:
	@echo pug-doc "./k-scaffold/**/*.pug" --output ./docs/data/_pugdoc.json

jsdoc:
	@echo jsdoc -r -X ./k-scaffold > ./docs/data/jsdoc-ast.json'