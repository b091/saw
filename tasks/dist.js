const path = require('path');
const Builder = require('systemjs-builder');
const builder = new Builder();

builder.config({
  defaultJSExtensions: true,
  transpiler: 'typescript',
  typescriptOptions: {
    'experimentalDecorators': true,
    'module': 'amd'
  },
  paths: {
    'app/*': 'src/*'
  },
  packages: {
    'app': {
      'main': 'index',
      'format': 'amd',
      'defaultExtension': 'js'
    }
  }
});

buildSFX()
  .then(() => console.log('Build complete'))
  .catch((err) => console.log('\n\tBuild Failed\n', err));

function buildSFX() {
  const moduleName = 'app';
  const buildConfig = {
    format: 'amd',
    minify: true,
    sourceMaps: true
  };
  return builder.buildStatic(moduleName, path.join('dist', 'scorm-api-wrapper.js'), buildConfig);
}

