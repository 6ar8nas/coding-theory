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

The static site is published using [`github-pages`](https://pages.github.com). It can be accessed at [6ar8nas.github.io/coding-theory/](https://6ar8nas.github.io/coding-theory/).

## Experiment

The experiments for the given Golay C23 implementation have been carried out using a utility function portrayed in [experiment.ts](./src/experiment.ts).

It tested for a random binary string of length 10008 being passed through coding and non-coding workflows and compared its outcomes with distortion probability ranging from 0 to 0.25 (with incremental increase of 0.0025). The final result is an average of 100 unique random binary vectors transmission error counts and time durations.

The experimental tests results can be found in [experiment.md](./experiment.md).

### Effectiveness

Data suggests, that Golay code C23 can exhibit its error correction properties while the channel's distortion probability is 15% or below, otherwise the code cannot usually correctly guess the word coming out of the channel and makes even more mistakes.

### Efficiency

The additional processing for encoding and decoding, as well as transmission of double the data (every 12 bits gets converted to 24) over the channel appears to make the Golay C23 coding implementation about 50-70 times slower compared to the non-coding workflow.

## Running the application locally

### Prerequisites

-   [node 20.x](https://nodejs.org/dist/) or higher.
-   [pnpm 9.x](https://pnpm.io/installation) or higher.

### Development

1. Run `pnpm install` to install all packages.
1. Run `pnpm dev` to start the web server in development mode with hot reload.
1. Follow instructions in the console to open the application in the browser.

### Experiment tests

-   Run `npx tsx ./src/experiment.ts`.

## References

-   R.Hill. A first course in coding theory. Oxford University Press, New York, 1991: §3.5–3.7, p. 82–89.
