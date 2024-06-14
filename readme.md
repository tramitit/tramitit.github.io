# Tramitit website


## Say no to bureaucracy

Tramitit provides the information you need to navigate governmental procedures quickly.
The community provides detailed walkthroughs on every possible bureaucratic process you might go through.


### The repository

This is the source code for our website hosted at [tramitit.com](https://tramitit.com).
If you're looking for the source of the guides visit the repository [tramitit/guides](https://github.com/tramitit/guides) instead.


### ⚙️ Prerequisites

To start using this template, you need to have some prerequisites installed on your machine.

- [Hugo Extended v0.124+](https://gohugo.io/installation/)
- [Node v20+](https://nodejs.org/en/download/)
- [Go v1.22+](https://go.dev/doc/install)

### 👉 Project Setup

### 👉 Install Dependencies

Install all the dependencies using the following command.

```bash
npm install
```

### 👉 Development Command

Start the development server using the following command.

```bash
npm run dev
```

To perform a local simulation of the production build you can run

```bash
npm run preview
```

This removes certain development enabled features such as the upper left-hand corner information of your current screen size.

---

### Content

Content is added in `content/<language>/`, where each subdirectory therein corresponds to a page.
Note that the Tramitit guides are in [a different repository](https://github.com/tramitit/guides).

---

## 🚀 Build And Deploy

### 👉 Build Command

To build your project locally, you can use the following command. It will purge all the unused CSS and minify all the files.

```bash
npm run build
```

And if you want to Host some other hosting platforms. then you can build your project, and you will get a `public` folder. that you can copy and paste on your hosting platform.

for example the Python one-liner from the root of the project (i.e. where this readme file is located) is sufficient to serve the website:

```
python3 -m http.server -d ./public/
```

> **Note:** You must change the `baseURL` in the `hugo.toml` file. Otherwise, your site will not work properly.

## Contribute

Before committing run

```
npm run format
```

to apply standard formatting rules ensuring a standard coding style.

The content is all contained in the `content` directory, and all the front-end formatting is inside the `themes` directory.
The final build output is created by merging the content from `content` into the placeholder values in `themes`.

There is also the `config/_default` directory that contains things like google analytics setup.

---

### 📝 License

Copyright (c) 2024 - Present, Designed & Developed by [Tramitit](https://tramitit.com)
Copyright (c) 2023 - Present, Designed & Developed by [Zeon Studio](https://zeon.studio/)

**Code License:** Released under the [MIT](https://github.com/zeon-studio/hugoplate/blob/main/LICENSE) license.
