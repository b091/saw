System.config({
  defaultJSExtensions: true,
  transpiler: "typescript",
  typescriptOptions: {
    "module": "amd",
    "experimentalDecorators": true
  },
  paths: {
    "github:*": "vendor/jspm_packages/github/*",
    "npm:*": "vendor/jspm_packages/npm/*"
  },

  map: {
    "typemoq": "npm:typemoq@0.0.6",
    "typescript": "npm:typescript@1.8.10",
    "github:jspm/nodelibs-os@0.1.0": {
      "os-browserify": "npm:os-browserify@0.1.2"
    },
    "npm:os-browserify@0.1.2": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    },
    "npm:typemoq@0.0.6": {
      "underscore": "npm:underscore@1.8.3"
    },
    "npm:typescript@1.8.10": {
      "os": "github:jspm/nodelibs-os@0.1.0"
    }
  }
});
