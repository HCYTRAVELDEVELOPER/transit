rm -rf ./node_modules
rm -rf ./known-good/node_modules
npm ci
./bootstrap-compiler --app-name=compiler