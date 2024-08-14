# Golay code C23

This front-end web application allows the user to encode and decode data using the binary Golay code (length 23) algorithm and compare the code's effectiveness to raw inputs, when communicating through a noisy channel.

Available input modes:

-   binary
-   text<sup>\*</sup>
-   images (only `.bmp` currently supported)<sup>\*</sup>

> <sup>\*</sup> - the encoding algorithm appends binary 0 characters to create a string of 12-multiple length. Due to the nature of the algorithm, it is available to safely remove those appended characters after decoding without losing any data.

## Motivation

This is a university assignment for the Coding Theory course, lectured by Gintaras Skersys at Vilnius University. The assignment revolved around researching the designated coding algorithm, implementing it and assessing the code's error correction efficiency and characteristics.

## Technologies

The application is created using [`React`](https://react.dev), [`TypeScript`](https://www.typescriptlang.org) and [`daisyUI`](https://daisyui.com) as a component library, built and bundled using [`Vite`](https://vitejs.dev) tooling and utilizes [`pnpm`](https://pnpm.io) as a package manager.

## Try it out

The static site is published using [`github-pages`](https://pages.github.com). It can be accessed at [6ar8nas.github.io/coding-theory/](6ar8nas.github.io/coding-theory/).

## Running the application locally

### Prerequisites

-   [node 20.x](https://nodejs.org/dist/) or higher.
-   [pnpm 9.x](https://pnpm.io/installation) or higher.

### Development

1. Run `pnpm install` to install all packages.
1. Run `pnpm dev` to start the web server in development mode with hot reload.
1. Follow instructions in the console to open the application in the browser.

## References

-   R.Hill. A first course in coding theory. Oxford University Press, New York, 1991: §3.5–3.7, p. 82–89.
