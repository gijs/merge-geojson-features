#!/usr/bin/env node

"use strict";

var path = require("path");

var features = process.argv.slice(2).map(function(filename) {
  var data = require(path.join(process.cwd(), filename));

  switch (data.type) {
  case "FeatureCollection":
    return data.features;

  case "Feature":
    return [data];

  default:
    console.warn("Unrecognized GeoJSON type:", data.type);
  }
}).reduce(function(a, b) {
  return a.concat(b);
});

var seen = [];

features = features.filter(function(x) {
  if (x.id) {
    if (seen.indexOf(x.id) >= 0) {
      return false;
    }

    seen.push(x.id);
  }

  return true;
});

var collection = {
  type: "FeatureCollection",
  features: features
};

console.log("%j", collection);
