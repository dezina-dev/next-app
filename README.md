# TypeScript Next.js app

This demonstrates the chat app, with users & groups. Backend is done in node.js & mongodb.

## How to start?
```
npm run dev
```

## Contents
- Sign in, sign out, logout
- After sign in displays the my chat page where you can chat with available users
- In My groups page, shows the create group option & also list of groups if created by you or part of.
    - can add group members & delete members & groups
    - also can chat with group members

## Notes

This example shows how to integrate the TypeScript type system into Next.js. Since TypeScript is supported out of the box with Next.js, all we have to do is to install TypeScript.

```
npm install --save-dev typescript
```

To enable TypeScript's features, we install the type declarations for React and Node.

```
npm install --save-dev @types/react @types/react-dom @types/node
```

When we run `next dev` the next time, Next.js will start looking for any `.ts` or `.tsx` files in our project and builds it. It even automatically creates a `tsconfig.json` file for our project with the recommended settings.

Next.js has built-in TypeScript declarations, so we'll get autocompletion for Next.js' modules straight away.

A `type-check` script is also added to `package.json`, which runs TypeScript's `tsc` CLI in `noEmit` mode to run type-checking separately. You can then include this, for example, in your `test` scripts.
