npm install -g typedoc
npm i -g typescript
typedoc --options typedoc.json --readme README.md --out out ../src/index.ts --excludePrivate --name "Galigeo API"