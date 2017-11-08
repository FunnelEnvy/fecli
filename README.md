# FunnelEnvy Command Line Interface

fecli is a command line tool that lets developers build experiments faster by using the sofware tools you already love and publish to Optimizely when ready. We build a lot of tests at [FunnelEnvy](http://www.funnelenvy.com) and found that (being stubborn engineers) we were more comfortable using our source editors and Git to develop locally - and this had a *significant* positive impact on our test velocity.

fecli includes a command line executable that also integrates with either the[Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en) (Google Chrome) or [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) (Firefox) extensions for local development / preview and the Optimizely API for publishing tests.


## Installation

```
npm install -g fecli
```
This will install the __fecli__ executable on your system.

### Dependencies


You'll need to have [node.js](http://nodejs.org/) installed locally to run `fecli` and either the Tampermonkey or Greasemonkey extensions to view variations locally.

## Quickstart

```
fecli
```

View available commands

```
fecli init [options] [project_id]
```
Initializes a new Optimizely project locally (use `-r` for remote).

[Project ID screenshot](http://d.pr/i/ZBnxk)
[Generate an API Token screenshot](http://d.pr/i/cEbjam)
[Generated API Token screenshot](http://d.pr/i/D7VmsQ)

```
fecli experiment <folder> <description> <url>
```
Create a local experiment

```
fecli variation <experiment> <folder> <description>
```
Create a local variation

```
fecli host [options] <path> [port]
```
Host a variation locally. Point your browser at http(s)://localhost:8080 (default port) for usage info.

```
fecli push-experiment <path>
```
Push a local experiment to Optimizely Classic

```
fecli push-variation <path>
```
Push a local variation to Optimizely Classic

---

*New features for Optimizely X*

```
fecli pull <experiment_id>
```
Pull an experiment from Optimizely X (do this before you push)

```
fecli push <path>
```
Push an experiment to Optimizely X

```
fecli compile <path>
```
Generate a `compiled.html` file for use with Adobe Test & Target


## Release History
* 0.15.0 Iteration option on push-experiment
* 0.14.3 Added push-experiment, push-variation tests
* 0.14.2 Show help when no arguments passed
* 0.14.1 Bugfixes
* 0.14.0 Move node client into [separate module](https://github.com/FunnelEnvy/optimizely-node)
* 0.12.0 Bugfixes, more compliant with semver
* 0.0.11 Separated create from push operations
* 0.0.10 Refactored and cleanup
* 0.0.7 Push
* 0.0.2 Clone bug fix
* 0.0.1 Initial release

## Contributing

Please see [CONTRIBUTING.md](contributing.md).

## Copyright and license

Code copyright 2015 Celerius Group Inc. Released under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0).
