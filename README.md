# HTML6 Language Server

Enhance your editor with **HTML6 support** via this Language Server Protocol (LSP) extension. Get **syntax validation**, **hover info**, and **auto-completion** for custom HTML6 components.

## Features

-   **Syntax validation**
    Detect invalid HTML6 usage of attributes like `if`, `map`, etc., and highlight issues in your editor.

-   **Hover information**
    Hover over HTML6 attributes and components to see helpful documentation.

-   **Auto-completion**
    Quickly insert custom components using `<component></component>` snippets. The server dynamically reads all `<template is="...">` tags in your project for suggestions.

-   **Real-time updates**
    New, modified, or deleted HTML files in your project automatically update the completion list.

## Installation

1. Install the HTML6 extension in your editor (VS Code, for example).
2. Open a project containing HTML6 templates with the .html extension.
3. The LSP will automatically activate and provide completions, hovers, and diagnostics.

## Usage

-   Type `<` to trigger auto-completion for your custom components.
-   Hover over an attribute like `if` to see its expected usage.
-   Save or modify your HTML files—completion suggestions update automatically.

## Requirements

-   Node.js >= 18
-   VS Code or any editor supporting LSP

## Contributing

Contributions are welcome! Please submit issues or pull requests on GitHub.
