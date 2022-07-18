call npm install -g typedoc
call npm i -g typescript
call typedoc --options typedoc.json --readme README.md --out ../../samples/doc ../src/index.ts --excludePrivate --name "Galigeo API"