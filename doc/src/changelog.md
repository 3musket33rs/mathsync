---
layout: default
title: Changelog
---

# On the road

* remove deprecated method `Summary#minus(Summary)` and deprecated class `ResolverFromSummarizers`
* seed bucket selector
* reduce dependencies to node to reduce browserify package size

# 0.4.0

* remove small summary generation from larger ones (concept is too weak)
* deprecate general summary substraction (concept is too weak - will be replaced on a case by case basis)
* rationalize javascript packages into a single one
* use ES6 syntax for promises

# 0.3.x

# 0.3.1

* fix dependency issue in javascript code

## 0.3.0

* performance improvements by batching summary updates
* handle version `0.7.3` of [Rusha](https://github.com/srijs/rusha)

# 0.2.0

* String serialization
* java and javascript interoperability with integration tests

# 0.1.0

* java and javascript libraries not interoperating
