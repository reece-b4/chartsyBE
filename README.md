# -hmcts-dev-test-backend-TS
- setup ssh for second/anonymised github account
- init yarn
- init typescript
- add express, nodemon & ts-node, scripts in package.json
- configure tsconfig - try ES2020 rather than ES6, strict checks all around, allow all types of import/module handling. skipLibCheck as security not necessary for this purpose. add @ alias for import paths
- add minimal get endpoint and test
- ignore dist and future .env dir/file
- match express and typescript versions to front end
- add sdk settings for types to work correctly with yarn pnp architecture
- false type errors persist
- sdk typescript version needs to be 5.4.6 with package.json version 5.1.6 for it to work - should not be this way
TODO: look into forced typescript version mismatch
- changed to pnpm to avoid yarn/pnp typescript version mismatch hacky fix