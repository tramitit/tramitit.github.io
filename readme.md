Based on https://github.com/zeon-studio/hugoplate

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

---

## 📝 Customization and adding content

This template has been designed with a lot of customization options in mind. You can customize almost anything you want, including:

### 👉 Site Config

You can change the site title, base URL, language, theme, plugins, and more from the `hugo.toml` file.

### 👉 Site Params

You can customize all the parameters from the `config/_default/params.toml` file. This includes the logo, favicon, search, SEO metadata, and more.

### 👉 Colors and Fonts

You can change the colors and fonts from the `data/theme.json` file. This includes the primary color, secondary color, font family, and font size.

### 👉 Social Links

You can change the social links from the `data/social.json` file. Add your social links here, and they will automatically be displayed on the site.

### Content

Content is added in `content/english`, where each subdirectory therein corresponds to a page.

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

Copyright (c) 2023 - Present, Designed & Developed by [Zeon Studio](https://zeon.studio/)

**Code License:** Released under the [MIT](https://github.com/zeon-studio/hugoplate/blob/main/LICENSE) license.
